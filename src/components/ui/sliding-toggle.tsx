import React from "react";
import { cn } from "@/lib/utils";

interface SlidingToggleProps {
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: React.ReactNode;
  }[];
  className?: string;
}

export const SlidingToggle = ({ value, onChange, options, className }: SlidingToggleProps) => {
  const selectedIndex = options.findIndex(option => option.value === value);
  
  return (
    <div className={cn("relative inline-flex bg-muted rounded-full p-1", className)}>
      {/* Options */}
      {options.map((option, index) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "relative z-10 flex items-center justify-center px-6 py-2 text-sm font-medium rounded-full transition-all duration-200",
            "whitespace-nowrap",
            value === option.value 
              ? "bg-background text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};