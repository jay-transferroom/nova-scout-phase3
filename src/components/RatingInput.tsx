
import { RatingSystem } from "@/types/report";
import { cn } from "@/lib/utils";

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
    return (
      <div className="flex flex-wrap gap-2 py-1">
        {ratingSystem.values.map((option) => (
          <button
            key={option.value.toString()}
            type="button"
            onClick={() => handleSelect(option.value)}
            className={cn(
              "h-10 w-10 rounded-md border flex items-center justify-center text-sm font-medium transition-colors",
              value === option.value 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-background hover:bg-muted/50"
            )}
            title={option.description}
          >
            {option.label || option.value}
          </button>
        ))}
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
