
import { useState } from "react";
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

interface ReportFieldProps {
  field: ReportFieldType;
  value: any;
  notes?: string;
  onChange: (value: any, notes?: string) => void;
}

const ReportField = ({ field, value, notes, onChange }: ReportFieldProps) => {
  const [fieldNotes, setFieldNotes] = useState<string>(notes || "");
  
  const handleNotesChange = (newNotes: string) => {
    setFieldNotes(newNotes);
    onChange(value, newNotes);
  };

  console.log(`ReportField for ${field.id}:`, { 
    fieldType: field.type, 
    options: field.options, 
    value: value,
    label: field.label 
  });

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
            onChange={(e) => onChange(e.target.value, fieldNotes)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            className="resize-none"
          />
        )}

        {field.type === "number" && (
          <Input
            id={field.id}
            type="number"
            value={value || ""}
            onChange={(e) => onChange(Number(e.target.value), fieldNotes)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        )}

        {field.type === "dropdown" && field.options && (
          <Select
            value={value || ""}
            onValueChange={(newValue) => onChange(newValue, fieldNotes)}
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
              onCheckedChange={(checked) => onChange(checked, fieldNotes)}
            />
            <label
              htmlFor={field.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.label}
            </label>
          </div>
        )}

        {field.type === "rating" && field.ratingSystem && (
          <RatingInput
            id={field.id}
            ratingSystem={field.ratingSystem}
            value={value}
            onChange={(newValue) => onChange(newValue, fieldNotes)}
          />
        )}
      </div>

      {field.type !== "checkbox" && (
        <div className="mt-2">
          <Label htmlFor={`${field.id}-notes`} className="text-xs text-muted-foreground">
            Notes
          </Label>
          <Textarea
            id={`${field.id}-notes`}
            value={fieldNotes}
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
