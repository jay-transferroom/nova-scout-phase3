
import { ReportField, RatingSystem, RatingOption } from "@/types/report";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import RatingOptionsEditor from "@/components/RatingOptionsEditor";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface FieldEditorProps {
  field: ReportField;
  onUpdate: (field: ReportField) => void;
}

// Standard scout recommendations based on the framework
const SCOUT_RECOMMENDATIONS = [
  "Sign / Proceed to next stage",
  "Monitor / Track Further", 
  "Further Scouting Required",
  "Concerns / With Reservations",
  "Do Not Pursue"
];

const FieldEditor = ({ field, onUpdate }: FieldEditorProps) => {
  const handleRatingSystemUpdate = (ratingSystem: RatingSystem) => {
    onUpdate({
      ...field,
      ratingSystem: ratingSystem
    });
  };

  const handleFieldTypeChange = (type: string) => {
    let updatedField = { ...field, type: type as any };
    
    // Set default options for specific field types
    if (type === 'dropdown') {
      if (field.label.toLowerCase().includes('recommendation') || 
          field.label.toLowerCase().includes('verdict') ||
          field.label.toLowerCase().includes('decision')) {
        updatedField.options = [...SCOUT_RECOMMENDATIONS];
      } else {
        updatedField.options = ['Option 1', 'Option 2', 'Option 3'];
      }
    }
    
    onUpdate(updatedField);
  };

  const handleAddDropdownOption = () => {
    const currentOptions = field.options || [];
    onUpdate({
      ...field,
      options: [...currentOptions, `Option ${currentOptions.length + 1}`]
    });
  };

  const handleUpdateDropdownOption = (index: number, value: string) => {
    const currentOptions = field.options || [];
    const updatedOptions = [...currentOptions];
    updatedOptions[index] = value;
    onUpdate({
      ...field,
      options: updatedOptions
    });
  };

  const handleRemoveDropdownOption = (index: number) => {
    const currentOptions = field.options || [];
    onUpdate({
      ...field,
      options: currentOptions.filter((_, i) => i !== index)
    });
  };

  const handleUseScoutRecommendations = () => {
    onUpdate({
      ...field,
      options: [...SCOUT_RECOMMENDATIONS]
    });
  };

  return (
    <div className="space-y-4">
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
        <Select value={field.type} onValueChange={handleFieldTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="dropdown">Dropdown</SelectItem>
            <SelectItem value="checkbox">Checkbox</SelectItem>
            <SelectItem value="number">Number</SelectItem>
          </SelectContent>
        </Select>
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
      
      {field.type === 'dropdown' && (
        <div className="space-y-2 border p-4 rounded">
          <div className="flex justify-between items-center">
            <Label>Dropdown Options</Label>
            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleUseScoutRecommendations}
                className="text-xs"
              >
                Use Scout Recommendations
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddDropdownOption}
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            {(field.options || []).map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={option.toString()}
                  onChange={(e) => handleUpdateDropdownOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveDropdownOption(index)}
                  className="text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
          
          {(!field.options || field.options.length === 0) && (
            <p className="text-sm text-muted-foreground">No options added yet</p>
          )}
        </div>
      )}
      
      {field.type === 'rating' && field.ratingSystem && (
        <div className="space-y-2 border p-4 rounded">
          <Label>Rating Options</Label>
          <RatingOptionsEditor 
            ratingSystem={field.ratingSystem} 
            onUpdate={handleRatingSystemUpdate}
          />
        </div>
      )}
      
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
    </div>
  );
};

export default FieldEditor;
