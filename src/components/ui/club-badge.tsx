import * as React from "react"
import { cn } from "@/lib/utils"
import { getTeamLogoUrl } from "@/utils/teamLogos"

interface ClubBadgeProps {
  clubName: string;
  logoUrl?: string;
  className?: string;
}

const ClubBadge = ({ clubName, logoUrl, className }: ClubBadgeProps) => {
  // Use provided logoUrl or get from storage
  const teamLogoUrl = logoUrl || getTeamLogoUrl(clubName);
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {teamLogoUrl ? (
        <img 
          src={teamLogoUrl} 
          alt={`${clubName} logo`}
          className="h-6 w-6 rounded-full object-cover"
        />
      ) : (
        <div className="h-6 w-6 rounded-full bg-grey-200 flex items-center justify-center">
          <span className="text-xs font-medium text-grey-600">
            {clubName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <span className="text-sm font-medium text-grey-900">{clubName}</span>
    </div>
  );
};

export { ClubBadge }