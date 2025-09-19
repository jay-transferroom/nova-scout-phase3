import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface PlayerAvatarProps {
  playerName: string;
  avatarUrl?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const PlayerAvatar = ({ playerName, avatarUrl, className, size = "md" }: PlayerAvatarProps) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-10 w-10"
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={avatarUrl} alt={playerName} />
      <AvatarFallback className="bg-grey-100 text-grey-700 text-xs font-medium">
        {getInitials(playerName)}
      </AvatarFallback>
    </Avatar>
  );
};

export { PlayerAvatar }