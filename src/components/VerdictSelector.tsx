
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VERDICT_OPTIONS, VerdictType } from "@/types/verdict";

interface VerdictSelectorProps {
  value: string | null;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const VerdictSelector = ({ 
  value, 
  onValueChange, 
  placeholder = "Select verdict...",
  className = ""
}: VerdictSelectorProps) => {
  return (
    <Select value={value || ""} onValueChange={onValueChange}>
      <SelectTrigger className={`bg-background ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-background border shadow-lg z-50">
        {VERDICT_OPTIONS.map((option) => (
          <SelectItem 
            key={option.value} 
            value={option.value}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            <div className="flex items-center gap-2">
              <span>{option.icon}</span>
              <span>{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default VerdictSelector;
