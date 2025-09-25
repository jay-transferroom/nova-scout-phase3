import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Scout {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
}

interface ScoutAvatarsProps {
  scouts: Scout[];
  maxVisible?: number;
  size?: "sm" | "md" | "lg";
}

export const ScoutAvatars = ({ scouts, maxVisible = 3, size = "md" }: ScoutAvatarsProps) => {
  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-12 w-12 text-base", 
    lg: "h-14 w-14 text-lg"
  };
  
  const sizeClass = sizeClasses[size];
  const visibleScouts = scouts.slice(0, maxVisible);
  const remainingCount = scouts.length - maxVisible;

  const getInitials = (scout: Scout) => {
    if (scout.first_name && scout.last_name) {
      return `${scout.first_name[0]}${scout.last_name[0]}`;
    }
    return scout.email.substring(0, 2).toUpperCase();
  };

  const getFullName = (scout: Scout) => {
    if (scout.first_name && scout.last_name) {
      return `${scout.first_name} ${scout.last_name}`;
    }
    return scout.email;
  };

  if (scouts.length === 0) {
    return <span className="text-muted-foreground text-sm">Unassigned</span>;
  }

  if (scouts.length === 1) {
    const scout = scouts[0];
    return (
      <div className="flex items-center gap-2">
        <Avatar className={sizeClass}>
          <AvatarFallback className="bg-muted text-foreground font-medium">
            {getInitials(scout)}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{getFullName(scout)}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex -space-x-1">
        {visibleScouts.map((scout, index) => (
          <Avatar 
            key={scout.id} 
            className={`${sizeClass} border-2 border-background relative z-${10 - index}`}
            title={getFullName(scout)}
          >
            <AvatarFallback className="bg-muted text-foreground font-medium">
              {getInitials(scout)}
            </AvatarFallback>
          </Avatar>
        ))}
        {remainingCount > 0 && (
          <Avatar className={`${sizeClass} border-2 border-background bg-muted`}>
            <AvatarFallback className="bg-muted text-foreground font-medium">
              +{remainingCount}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
      <span className="text-sm font-medium ml-2">
        {scouts.length > 1 ? `${scouts.length} scouts` : getFullName(scouts[0])}
      </span>
    </div>
  );
};