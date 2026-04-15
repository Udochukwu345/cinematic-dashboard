
-- Add is_admin column to conversation_participants
ALTER TABLE public.conversation_participants
ADD COLUMN is_admin boolean NOT NULL DEFAULT false;

-- Allow admins to update participant records (promote/demote)
CREATE POLICY "Admins can update participants"
ON public.conversation_participants
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
    AND cp.user_id = auth.uid()
    AND cp.is_admin = true
  )
);

-- Allow admins to remove participants
DROP POLICY IF EXISTS "Users can leave conversations" ON public.conversation_participants;
CREATE POLICY "Users can leave or admins can remove"
ON public.conversation_participants
FOR DELETE
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM public.conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
    AND cp.user_id = auth.uid()
    AND cp.is_admin = true
  )
);

-- Allow any conversation member to update conversation (for updated_at timestamp)
DROP POLICY IF EXISTS "Creator can update conversation" ON public.conversations;
CREATE POLICY "Members can update conversation"
ON public.conversations
FOR UPDATE
USING (
  is_conversation_member(auth.uid(), id)
);
