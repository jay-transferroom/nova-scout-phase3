
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Notification } from "@/types/notification";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'scout_management':
        return 'bg-blue-100 text-blue-700';
      case 'status_update':
        return 'bg-green-100 text-green-700';
      case 'player_tracking':
        return 'bg-purple-100 text-purple-700';
      case 'xtv_change':
        return 'bg-orange-100 text-orange-700';
      case 'injury':
        return 'bg-red-100 text-red-700';
      case 'transfer':
        return 'bg-indigo-100 text-indigo-700';
      case 'availability':
        return 'bg-emerald-100 text-emerald-700';
      case 'market_tracking':
        return 'bg-yellow-100 text-yellow-700';
      case 'comparable_players':
        return 'bg-cyan-100 text-cyan-700';
      case 'players_of_interest':
        return 'bg-pink-100 text-pink-700';
      case 'questions':
        return 'bg-amber-100 text-amber-700';
      case 'chatbot':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className={cn(
      "p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors",
      !notification.read && "bg-blue-50"
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge 
              variant="secondary" 
              className={cn("text-xs", getNotificationTypeColor(notification.type))}
            >
              {getNotificationTypeLabel(notification.type)}
            </Badge>
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
          <h4 className="font-medium text-sm text-gray-900 truncate">
            {notification.title}
          </h4>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
            {notification.message}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
          </p>
        </div>
        {!notification.read && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkAsRead(notification.id)}
            className="shrink-0 h-8 w-8 p-0"
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
