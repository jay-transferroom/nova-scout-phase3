
import { ReportField as ReportFieldType } from "@/types/report";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import RatingInput from "@/components/RatingInput";
import { DEFAULT_RATING_SYSTEMS } from "@/types/report";

interface ReportFieldProps {
  field: ReportFieldType;
  value: any;
  notes?: string;
  onChange: (value: any, notes?: string) => void;
}

const ReportField = ({ field, value, notes, onChange }: ReportFieldProps) => {
  const handleValueChange = (newValue: any) => {
    onChange(newValue, notes);
  };

  const handleNotesChange = (newNotes: string) => {
    onChange(value, newNotes);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <Label htmlFor={field.id} className="text-base font-medium">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {field.description && (
          <span className="text-xs text-muted-foreground">{field.description}</span>
        )}
      </div>

      <div>
        {field.type === "text" && (
          <Textarea
            id={field.id}
            value={value || ""}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="resize-none"
          />
        )}

        {field.type === "number" && (
          <Input
            id={field.id}
            type="number"
            value={value || ""}
            onChange={(e) => handleValueChange(Number(e.target.value))}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        )}

        {field.type === "dropdown" && field.options && (
          <Select
            value={value || ""}
            onValueChange={(newValue) => handleValueChange(newValue)}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              {field.options.map((option) => (
                <SelectItem 
                  key={option.toString()} 
                  value={option.toString()}
                  className="hover:bg-accent hover:text-accent-foreground"
                >
                  {option.toString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {field.type === "checkbox" && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={value || false}
              onCheckedChange={(checked) => handleValueChange(checked)}
            />
            <label
              htmlFor={field.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.label}
            </label>
          </div>
        )}

        {field.type === "rating" && (
          (() => {
            const ratingSystem = field.ratingSystem || DEFAULT_RATING_SYSTEMS['numeric-1-10'];
            
            if (!ratingSystem) {
              return (
                <div className="text-red-500 text-sm">
                  Rating system not configured for this field
                </div>
              );
            }

            return (
              <RatingInput
                id={field.id}
                ratingSystem={ratingSystem}
                value={value}
                onChange={(newValue) => handleValueChange(newValue)}
              />
            );
          })()
        )}
      </div>

      {field.type !== "checkbox" && (
        <div className="mt-2">
          <Label htmlFor={`${field.id}-notes`} className="text-xs text-muted-foreground">
            Notes
          </Label>
          <Textarea
            id={`${field.id}-notes`}
            value={notes || ""}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Add any additional notes here..."
            className="resize-none text-sm h-20"
          />
        </div>
      )}
    </div>
  );
};

export default ReportField;
