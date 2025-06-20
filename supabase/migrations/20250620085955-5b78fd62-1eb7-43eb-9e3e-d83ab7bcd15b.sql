
-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  data JSONB DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Insert mock notifications for testing
INSERT INTO public.notifications (user_id, type, title, message, read, data) VALUES
  -- Use a placeholder UUID that will be replaced with actual user IDs
  ('00000000-0000-0000-0000-000000000000', 'scout_management', 'New Assignment', 'You have been assigned to scout Marcus Johnson (Midfielder) by deadline: Dec 25, 2024', false, '{"player_id": "123", "deadline": "2024-12-25", "priority": "High"}'),
  ('00000000-0000-0000-0000-000000000000', 'status_update', 'Report Completed', 'Sarah Wilson completed her scouting report for Alex Thompson', true, '{"report_id": "456", "scout_name": "Sarah Wilson", "player_name": "Alex Thompson"}'),
  ('00000000-0000-0000-0000-000000000000', 'player_tracking', 'Player Shortlisted', 'David Martinez has been added to your shortlist by John Smith', false, '{"player_id": "789", "added_by": "John Smith"}'),
  ('00000000-0000-0000-0000-000000000000', 'xtv_change', 'xTV Update', 'James Rodriguez xTV score increased from 7.2 to 8.1 (+0.9)', false, '{"player_id": "101", "old_score": 7.2, "new_score": 8.1, "change": 0.9}'),
  ('00000000-0000-0000-0000-000000000000', 'injury', 'Injury Update', 'Kevin Anderson is expected to return from injury in 3 weeks', false, '{"player_id": "112", "injury_status": "recovering", "return_date": "2025-01-15"}'),
  ('00000000-0000-0000-0000-000000000000', 'transfer', 'Transfer Alert', 'Luis Garcia has been transferred to Manchester City for £25M', true, '{"player_id": "131", "from_club": "Real Madrid", "to_club": "Manchester City", "fee": "£25M"}'),
  ('00000000-0000-0000-0000-000000000000', 'availability', 'Player Available', 'Robert Chen is now available as a free agent', false, '{"player_id": "141", "status": "free_agent", "contract_expired": "2024-12-01"}'),
  ('00000000-0000-0000-0000-000000000000', 'market_tracking', 'Market Update', 'Similar players to your shortlist have increased in value by avg 15%', false, '{"category": "midfielder", "avg_increase": 15, "affected_players": 8}'),
  ('00000000-0000-0000-0000-000000000000', 'comparable_players', 'New Match Found', 'Found 3 players similar to Andrea Silva based on your criteria', false, '{"reference_player": "Andrea Silva", "matches_found": 3, "similarity_score": 0.92}'),
  ('00000000-0000-0000-0000-000000000000', 'players_of_interest', 'Interest Update', 'Tom Wilson is being tracked by 5 other clubs', true, '{"player_id": "161", "tracking_clubs": 5, "competition_level": "high"}'),
  ('00000000-0000-0000-0000-000000000000', 'questions', 'Question Received', 'Manager asked: "What are your thoughts on defensive midfielders under 23?"', false, '{"question_id": "q1", "from": "Manager", "question": "What are your thoughts on defensive midfielders under 23?"}'),
  ('00000000-0000-0000-0000-000000000000', 'chatbot', 'AI Insight', 'Based on your recent activity, consider reviewing players in Serie A', false, '{"insight_type": "recommendation", "league": "Serie A", "reason": "activity_pattern"}');
