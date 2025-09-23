-- Add like/dislike/saved functionality to chats table
ALTER TABLE public.chats 
ADD COLUMN liked BOOLEAN DEFAULT NULL,
ADD COLUMN saved BOOLEAN DEFAULT FALSE;

-- Add index for better performance on saved chats
CREATE INDEX idx_chats_saved ON public.chats(user_id, saved) WHERE saved = true;