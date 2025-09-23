import React from "react";
import { cn } from "@/lib/utils";

interface ScoutLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ScoutLogo = ({ size = "md", className }: ScoutLogoProps) => {
  const sizeClasses = {
    sm: "text-sm px-3 py-1 rounded-lg",
    md: "text-lg px-4 py-2 rounded-xl",
    lg: "text-2xl px-6 py-3 rounded-2xl"
  };

  return (
    <div 
      className={cn(
        "bg-green-600 text-white font-bold tracking-wide inline-flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      SCOUT
    </div>
  );
};