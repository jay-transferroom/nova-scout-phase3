import { useState } from "react";
import { ReportField, ReportFieldType, DEFAULT_RATING_SYSTEMS, RatingSystemType, RatingSystem } from "@/types/report";
import { Button } from "@/components/ui/button";
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
import RatingOptionsEditor from "@/components/RatingOptionsEditor";

interface FieldEditorProps {
  field: ReportField;
  onUpdate: (field: ReportField) => void;
  defaultRatingSystem?: RatingSystem;
}

const FIELD_TYPES: { label: string; value: ReportFieldType }[] = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" },
  { label: "Rating", value: "rating" },
  { label: "Dropdown", value: "dropdown" },
  { label: "Checkbox", value: "checkbox" }
];

const RATING_SYSTEM_TYPES: { label: string; value: RatingSystemType }[] = [
  { label: "Numeric (1-5)", value: "numeric-1-5" },
  { label: "Numeric (1-10)", value: "numeric-1-10" },
  { label: "Letter Grades", value: "letter" },
  { label: "Custom Tags", value: "custom-tags" },
  { label: "Percentage", value: "percentage" }
];

const FieldEditor = ({ field, onUpdate, defaultRatingSystem }: FieldEditorProps) => {
  const [options, setOptions] = useState<string[]>(
    field.options?.map(o => o.toString()) || []
  );
  const [newOption, setNewOption] = useState("");
  
  const handleTypeChange = (type: ReportFieldType) => {
    let updatedField = { ...field, type };
    
    // Set up default options based on field type
    if (type === "rating") {
      // Use the default rating system if available, otherwise use the default numeric-1-10
      if (defaultRatingSystem) {
        updatedField = {
          ...updatedField,
          ratingSystem: { ...defaultRatingSystem }
        };
      } else if (!field.ratingSystem) {
        updatedField = {
          ...updatedField,
          ratingSystem: DEFAULT_RATING_SYSTEMS["numeric-1-10"]
        };
      }
    } else if (type === "dropdown" && (!field.options || field.options.length === 0)) {
      updatedField = {
        ...updatedField,
        options: ["Option 1", "Option 2", "Option 3"]
      };
    }
    
    onUpdate(updatedField);
  };
  
  const handleRatingSystemTypeChange = (ratingType: RatingSystemType) => {
    onUpdate({
      ...field,
      ratingSystem: DEFAULT_RATING_SYSTEMS[ratingType]
    });
  };
  
  const handleRatingSystemUpdate = (ratingSystem: RatingSystem) => {
    onUpdate({
      ...field,
      ratingSystem
    });
  };
  
  const useDefaultRatingSystem = () => {
    if (!defaultRatingSystem) return;
    
    onUpdate({
      ...field,
      ratingSystem: { ...defaultRatingSystem }
    });
  };
  
  const handleAddOption = () => {
    if (!newOption.trim()) return;
    
    const updatedOptions = [...options, newOption.trim()];
    setOptions(updatedOptions);
    setNewOption("");
    
    onUpdate({
      ...field,
      options: updatedOptions
    });
  };
  
  const handleDeleteOption = (indexToDelete: number) => {
    const updatedOptions = options.filter((_, index) => index !== indexToDelete);
    setOptions(updatedOptions);
    
    onUpdate({
      ...field,
      options: updatedOptions
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="field-label">Field Label</Label>
          <Input
            id="field-label"
            value={field.label}
            onChange={(e) => onUpdate({ ...field, label: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="field-type">Field Type</Label>
          <Select 
            value={field.type} 
            onValueChange={(value) => handleTypeChange(value as ReportFieldType)}
          >
            <SelectTrigger id="field-type">
              <SelectValue placeholder="Select field type" />
            </SelectTrigger>
            <SelectContent>
              {FIELD_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="field-description">Description (Optional)</Label>
        <Textarea
          id="field-description"
          value={field.description || ""}
          onChange={(e) => onUpdate({ ...field, description: e.target.value })}
          className="resize-none"
          placeholder="Help text to explain this field"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="field-required"
          checked={field.required || false}
          onCheckedChange={(checked) => {
            onUpdate({ ...field, required: !!checked });
          }}
        />
        <label htmlFor="field-required" className="text-sm">Required field</label>
      </div>
      
      {field.type === "rating" && (
        <div className="space-y-4 border p-3 rounded-md">
          {defaultRatingSystem && (
            <Button 
              variant="outline" 
              size="sm"
              className="mb-2"
              onClick={useDefaultRatingSystem}
            >
              Use Template's Default Rating System
            </Button>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="rating-system">Rating System</Label>
            <Select 
              value={field.ratingSystem?.type || "numeric-1-10"} 
              onValueChange={(value) => handleRatingSystemTypeChange(value as RatingSystemType)}
            >
              <SelectTrigger id="rating-system">
                <SelectValue placeholder="Select rating system" />
              </SelectTrigger>
              <SelectContent>
                {RATING_SYSTEM_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {field.ratingSystem && field.ratingSystem.type !== "percentage" && (
            <RatingOptionsEditor 
              ratingSystem={field.ratingSystem}
              onUpdate={handleRatingSystemUpdate}
            />
          )}
        </div>
      )}
      
      {field.type === "dropdown" && (
        <div className="space-y-3 border p-3 rounded-md">
          <Label>Dropdown Options</Label>
          
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input 
                  value={option} 
                  onChange={(e) => {
                    const updatedOptions = [...options];
                    updatedOptions[index] = e.target.value;
                    setOptions(updatedOptions);
                    onUpdate({
                      ...field,
                      options: updatedOptions
                    });
                  }}
                />
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteOption(index)}
                >
                  &times;
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add new option..."
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddOption();
                }
              }}
            />
            <Button onClick={handleAddOption} size="sm">
              Add
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldEditor;
