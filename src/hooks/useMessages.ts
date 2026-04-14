import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Profile {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  message_type: string;
  media_url: string | null;
  reply_to: string | null;
  created_at: string;
  sender?: Profile;
}

export interface Conversation {
  id: string;
  name: string | null;
  is_group: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  last_message?: Message | null;
  participants?: Profile[];
}

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data: convos, error } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error || !convos) {
      setLoading(false);
      return;
    }

    // Fetch participants and last message for each
    const enriched = await Promise.all(
      convos.map(async (c: any) => {
        const { data: parts } = await supabase
          .from("conversation_participants")
          .select("user_id")
          .eq("conversation_id", c.id);

        const userIds = parts?.map((p: any) => p.user_id) || [];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, display_name, avatar_url")
          .in("user_id", userIds);

        const { data: msgs } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", c.id)
          .order("created_at", { ascending: false })
          .limit(1);

        return {
          ...c,
          participants: profiles || [],
          last_message: msgs?.[0] || null,
        } as Conversation;
      })
    );

    setConversations(enriched);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Realtime subscription for conversation updates
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("conversations-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, fetchConversations]);

  return { conversations, loading, refetch: fetchConversations };
}

export function useMessages(conversationId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState<Map<string, Profile>>(new Map());

  const fetchMessages = useCallback(async () => {
    if (!conversationId || !user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      // Fetch sender profiles
      const senderIds = [...new Set(data.map((m: any) => m.sender_id))];
      const { data: profs } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", senderIds);

      const profMap = new Map<string, Profile>();
      profs?.forEach((p: any) => profMap.set(p.user_id, p));
      setProfiles(profMap);

      setMessages(
        data.map((m: any) => ({ ...m, sender: profMap.get(m.sender_id) }))
      );
    }
    setLoading(false);
  }, [conversationId, user]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Realtime for new messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        async (payload) => {
          const newMsg = payload.new as any;
          let sender = profiles.get(newMsg.sender_id);
          if (!sender) {
            const { data } = await supabase
              .from("profiles")
              .select("user_id, display_name, avatar_url")
              .eq("user_id", newMsg.sender_id)
              .single();
            if (data) {
              sender = data;
              setProfiles((prev) => new Map(prev).set(newMsg.sender_id, data));
            }
          }
          setMessages((prev) => [...prev, { ...newMsg, sender }]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId, profiles]);

  const sendMessage = useCallback(
    async (content: string, type: string = "text", mediaUrl?: string) => {
      if (!conversationId || !user) return;

      await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: type === "text" ? content : null,
        message_type: type,
        media_url: mediaUrl || null,
      });

      // Update conversation timestamp
      await supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);
    },
    [conversationId, user]
  );

  const uploadMedia = useCallback(
    async (file: File): Promise<string | null> => {
      if (!user) return null;
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from("chat-media")
        .upload(path, file);

      if (error) return null;

      const { data } = supabase.storage.from("chat-media").getPublicUrl(path);
      return data.publicUrl;
    },
    [user]
  );

  return { messages, loading, sendMessage, uploadMedia, refetch: fetchMessages };
}

export function useCreateConversation() {
  const { user } = useAuth();

  const createDM = useCallback(
    async (otherUserId: string): Promise<string | null> => {
      if (!user) return null;

      // Check if DM already exists
      const { data: myConvos } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", user.id);

      if (myConvos) {
        for (const mc of myConvos) {
          const { data: parts } = await supabase
            .from("conversation_participants")
            .select("user_id")
            .eq("conversation_id", mc.conversation_id);

          const { data: conv } = await supabase
            .from("conversations")
            .select("is_group")
            .eq("id", mc.conversation_id)
            .single();

          if (
            conv && !conv.is_group &&
            parts?.length === 2 &&
            parts.some((p: any) => p.user_id === otherUserId)
          ) {
            return mc.conversation_id;
          }
        }
      }

      // Create new conversation
      const { data: conv, error } = await supabase
        .from("conversations")
        .insert({ is_group: false, created_by: user.id })
        .select()
        .single();

      if (error || !conv) return null;

      await supabase.from("conversation_participants").insert([
        { conversation_id: conv.id, user_id: user.id },
        { conversation_id: conv.id, user_id: otherUserId },
      ]);

      return conv.id;
    },
    [user]
  );

  const createGroup = useCallback(
    async (name: string, memberIds: string[]): Promise<string | null> => {
      if (!user) return null;

      const { data: conv, error } = await supabase
        .from("conversations")
        .insert({ name, is_group: true, created_by: user.id })
        .select()
        .single();

      if (error || !conv) return null;

      const participants = [user.id, ...memberIds].map((uid) => ({
        conversation_id: conv.id,
        user_id: uid,
      }));

      await supabase.from("conversation_participants").insert(participants);

      return conv.id;
    },
    [user]
  );

  return { createDM, createGroup };
}

export function useAllUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("user_id, display_name, avatar_url")
      .neq("user_id", user.id)
      .then(({ data }) => {
        if (data) setUsers(data);
      });
  }, [user]);

  return users;
}
