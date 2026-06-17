
-- 1. conversation_participants INSERT policy
DROP POLICY IF EXISTS "Authenticated can add participants" ON public.conversation_participants;

CREATE POLICY "Admins or creator can add participants"
ON public.conversation_participants
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id AND c.created_by = auth.uid()
  ))
  OR EXISTS (
    SELECT 1 FROM public.conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
      AND cp.user_id = auth.uid()
      AND cp.is_admin = true
  )
);

-- 2. chat-media storage policies (bucket made private via storage tool)
DROP POLICY IF EXISTS "Public read access for chat-media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read chat-media" ON storage.objects;
DROP POLICY IF EXISTS "chat-media public read" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload chat-media" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload to chat-media" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own chat-media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own chat-media" ON storage.objects;

CREATE POLICY "chat-media owners can upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'chat-media'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "chat-media owners can update own files"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'chat-media'
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'chat-media'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "chat-media owners can delete own files"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'chat-media'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "chat-media members can read shared files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'chat-media'
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.media_url LIKE '%/chat-media/' || storage.objects.name
        AND public.is_conversation_member(auth.uid(), m.conversation_id)
    )
  )
);

-- 3. Lock down SECURITY DEFINER function execute privileges
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_conversation_member(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_conversation_member(uuid, uuid) TO authenticated;
