
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notification";

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: 'mock-1',
    userId: 'current-user',
    type: 'scout_management',
    title: 'New Assignment',
    message: 'You have been assigned to scout Marcus Johnson (Midfielder) by deadline: Dec 30, 2024',
    read: false,
    data: { player_id: '123', deadline: '2024-12-30', priority: 'High' },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'mock-2',
    userId: 'current-user',
    type: 'status_update',
    title: 'Report Completed',
    message: 'Sarah Wilson completed her scouting report for Alex Thompson',
    read: true,
    data: { report_id: '456', scout_name: 'Sarah Wilson', player_name: 'Alex Thompson' },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: 'mock-3',
    userId: 'current-user',
    type: 'player_tracking',
    title: 'Player Shortlisted',
    message: 'David Martinez has been added to your shortlist by John Smith',
    read: false,
    data: { player_id: '789', added_by: 'John Smith' },
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    id: 'mock-4',
    userId: 'current-user',
    type: 'xtv_change',
    title: 'xTV Update',
    message: 'James Rodriguez xTV score increased from 7.2 to 8.1 (+0.9)',
    read: false,
    data: { player_id: '101', old_score: 7.2, new_score: 8.1, change: 0.9 },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'mock-5',
    userId: 'current-user',
    type: 'injury',
    title: 'Injury Update',
    message: 'Kevin Anderson is expected to return from injury in 3 weeks',
    read: false,
    data: { player_id: '112', injury_status: 'recovering', return_date: '2025-01-15' },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'mock-6',
    userId: 'current-user',
    type: 'transfer',
    title: 'Transfer Alert',
    message: 'Luis Garcia has been transferred to Manchester City for £25M',
    read: true,
    data: { player_id: '131', from_club: 'Real Madrid', to_club: 'Manchester City', fee: '£25M' },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'mock-7',
    userId: 'current-user',
    type: 'availability',
    title: 'Player Available',
    message: 'Robert Chen is now available as a free agent',
    read: false,
    data: { player_id: '141', status: 'free_agent', contract_expired: '2024-12-01' },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'mock-8',
    userId: 'current-user',
    type: 'chatbot',
    title: 'AI Insight',
    message: 'Based on your recent activity, consider reviewing players in Serie A',
    read: false,
    data: { insight_type: 'recommendation', league: 'Serie A', reason: 'activity_pattern' },
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  // New player tracking notifications
  {
    id: 'mock-tracking-1',
    userId: 'current-user',
    type: 'player_tracking',
    title: 'Tracked Player Update',
    message: 'Marcus Johnson scored 2 goals in last night\'s match vs Liverpool',
    read: false,
    data: { player_id: '123', match: 'vs Liverpool', goals: 2, performance: 'excellent' },
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: 'mock-tracking-2',
    userId: 'current-user',
    type: 'player_tracking',
    title: 'Contract Update',
    message: 'David Martinez\'s contract with Real Madrid expires in 6 months',
    read: false,
    data: { player_id: '789', contract_status: 'expiring', months_remaining: 6 },
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
    updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
  },
];

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async (): Promise<Notification[]> => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        // Return mock data if there's an error or no real data
        return mockNotifications;
      }

      const realNotifications = (data || []).map((notification: any) => ({
        id: notification.id,
        userId: notification.user_id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        read: notification.read,
        data: notification.data,
        createdAt: new Date(notification.created_at),
        updatedAt: new Date(notification.updated_at),
      }));

      // Combine real notifications with mock data
      return [...realNotifications, ...mockNotifications];
    },
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      // If it's a mock notification, just update the local cache
      if (notificationId.startsWith('mock-')) {
        return; // Mock notifications don't need database updates
      }

      const { error } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('read', false);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
