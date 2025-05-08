
import { ReportField } from "@/types/report";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface FieldEditorProps {
  field: ReportField;
  onUpdate: (field: ReportField) => void;
}

const FieldEditor = ({ field, onUpdate }: FieldEditorProps) => {
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
    </div>
  );
};

export default FieldEditor;
