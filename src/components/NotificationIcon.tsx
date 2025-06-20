
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NotificationIconProps {
  unreadCount: number;
}

const NotificationIcon = ({ unreadCount }: NotificationIconProps) => {
  return (
    <div className="relative">
      <Bell className="h-5 w-5 text-gray-600" />
      {unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </div>
  );
};

export default NotificationIcon;
