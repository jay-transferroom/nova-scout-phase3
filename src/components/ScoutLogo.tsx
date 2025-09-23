import React from "react";
import { cn } from "@/lib/utils";

interface ScoutLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ScoutLogo = ({ size = "md", className }: ScoutLogoProps) => {
  const sizeClasses = {
    sm: "text-sm px-2 py-1 rounded-lg",
    md: "text-lg px-3 py-1.5 rounded-xl",
    lg: "text-2xl px-4 py-2 rounded-2xl"
  };

  return (
    <div 
      className={cn(
        "bg-gradient-to-br from-green-500 to-green-700 text-white font-bold tracking-wide inline-flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      SCOUT
    </div>
  );
};