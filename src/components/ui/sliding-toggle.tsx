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
      {/* Sliding background */}
      <div 
        className="absolute inset-y-1 bg-background rounded-full shadow-sm transition-all duration-300 ease-in-out"
        style={{
          width: `calc(50% - 2px)`,
          left: selectedIndex === 0 ? '2px' : '50%'
        }}
      />
      
      {/* Options */}
      {options.map((option, index) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "relative z-10 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200",
            "min-w-[80px]",
            value === option.value 
              ? "text-foreground" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};