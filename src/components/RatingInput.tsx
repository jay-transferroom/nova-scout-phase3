
import { RatingSystem } from "@/types/report";
import { cn } from "@/lib/utils";
import { Star, StarHalf, Trophy } from "lucide-react";

interface RatingInputProps {
  id: string;
  ratingSystem: RatingSystem;
  value: any;
  onChange: (value: any) => void;
}

const RatingInput = ({ id, ratingSystem, value, onChange }: RatingInputProps) => {
  const handleSelect = (newValue: string | number) => {
    onChange(newValue);
  };

  // For numeric rating systems
  if (ratingSystem.type.startsWith('numeric')) {
    const isOverallRating = id === "overallRating";
    
    return (
      <div className="flex flex-wrap gap-2 py-1">
        {ratingSystem.values.map((option) => {
          // Color logic based on rating value
          let bgColorClass = "bg-background";
          if (value === option.value) {
            if (isOverallRating) {
              // For overall rating, different color scheme
              const numValue = Number(option.value);
              if (numValue <= 3) bgColorClass = "bg-red-500";
              else if (numValue <= 5) bgColorClass = "bg-yellow-500";
              else if (numValue <= 7) bgColorClass = "bg-green-500";
              else bgColorClass = "bg-emerald-500";
            } else {
              bgColorClass = "bg-primary";
            }
          }
          
          return (
            <button
              key={option.value.toString()}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                "h-10 w-10 rounded-md border flex items-center justify-center text-sm font-medium transition-colors",
                value === option.value 
                  ? `${bgColorClass} text-white border-transparent` 
                  : "bg-background hover:bg-muted/50"
              )}
              title={option.description}
            >
              {isOverallRating && value === option.value ? (
                <Trophy className="h-5 w-5" />
              ) : (
                option.label || option.value
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // For letter-based rating system
  if (ratingSystem.type === 'letter') {
    return (
      <div className="flex flex-wrap gap-2 py-1">
        {ratingSystem.values.map((option) => (
          <button
            key={option.value.toString()}
            type="button"
            onClick={() => handleSelect(option.value)}
            className={cn(
              "h-10 px-4 rounded-md flex items-center justify-center text-sm font-medium transition-colors",
              value === option.value 
                ? cn(
                    "text-white border-transparent",
                    option.color ? `bg-[${option.color}]` : "bg-primary"
                  )
                : "bg-background hover:bg-muted/50 border"
            )}
            title={option.description}
          >
            <span>{option.value}</span>
            {option.label && <span className="ml-2 text-xs">{option.label}</span>}
          </button>
        ))}
      </div>
    );
  }

  // For custom tags
  if (ratingSystem.type === 'custom-tags') {
    return (
      <div className="flex flex-wrap gap-2 py-1">
        {ratingSystem.values.map((option) => (
          <button
            key={option.value.toString()}
            type="button"
            onClick={() => handleSelect(option.value)}
            className={cn(
              "rounded-full px-4 py-1 text-sm font-medium transition-colors",
              value === option.value 
                ? cn(
                    "text-white border-transparent",
                    option.color ? `bg-[${option.color}]` : "bg-primary"
                  )
                : "bg-background hover:bg-muted/50 border"
            )}
            title={option.description}
          >
            {option.label || option.value}
          </button>
        ))}
      </div>
    );
  }

  // For percentage system
  if (ratingSystem.type === 'percentage') {
    return (
      <div className="space-y-2">
        <input
          type="range"
          id={id}
          min="0"
          max="100"
          step="5"
          value={value || 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
        />
        {value && (
          <div className="text-center font-medium">
            {value}%
          </div>
        )}
      </div>
    );
  }

  // Fallback for any other type
  return (
    <div className="text-muted-foreground text-sm">
      Unsupported rating type: {ratingSystem.type}
    </div>
  );
};

export default RatingInput;
