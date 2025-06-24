
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCheck, Filter } from "lucide-react";
import NotificationItem from "@/components/NotificationItem";
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from "@/hooks/useNotifications";
import { NotificationType } from "@/types/notification";

const NotificationsList = () => {
  const [filter, setFilter] = useState<'all' | 'unread' | NotificationType>('all');
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const notificationTypes: { value: NotificationType; label: string }[] = [
    { value: 'scout_management', label: 'Scout Management' },
    { value: 'status_update', label: 'Status Updates' },
    { value: 'player_tracking', label: 'Player Tracking' },
    { value: 'xtv_change', label: 'xTV Changes' },
    { value: 'injury', label: 'Injuries' },
    { value: 'transfer', label: 'Transfers' },
    { value: 'availability', label: 'Availability' },
    { value: 'market_tracking', label: 'Market Tracking' },
    { value: 'comparable_players', label: 'Comparable Players' },
    { value: 'players_of_interest', label: 'Players of Interest' },
    { value: 'questions', label: 'Questions' },
    { value: 'chatbot', label: 'AI Insights' },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Notifications</h1>
        </div>
        <div>Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-gray-600 mt-1">
              Stay updated with your scouting activities and player updates
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge variant="secondary" className="mr-2">
                {unreadCount} unread
              </Badge>
            )}
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="mr-2"
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:flex">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            <TabsTrigger value="scout_management" className="hidden lg:flex">
              <Filter className="h-4 w-4 mr-1" />
              Filter by Type
            </TabsTrigger>
          </TabsList>

          <div className="grid gap-4 lg:grid-cols-4">
            <div className="lg:col-span-1 space-y-2">
              <Card className="lg:block hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Filter by Type</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <Button
                    variant={filter === 'all' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('all')}
                    className="w-full justify-start"
                  >
                    All Notifications
                  </Button>
                  <Button
                    variant={filter === 'unread' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('unread')}
                    className="w-full justify-start"
                  >
                    Unread ({unreadCount})
                  </Button>
                  {notificationTypes.map((type) => {
                    const count = notifications.filter(n => n.type === type.value).length;
                    return (
                      <Button
                        key={type.value}
                        variant={filter === type.value ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setFilter(type.value)}
                        className="w-full justify-start"
                      >
                        {type.label} ({count})
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-0">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No notifications found for the selected filter.
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredNotifications.map((notification) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={handleMarkAsRead}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default NotificationsList;
