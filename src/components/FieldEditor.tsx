import { ReportField, RatingSystem } from "@/types/report";
import FieldBasicInfo from "@/components/field-editor/FieldBasicInfo";
import FieldTypeSelector from "@/components/field-editor/FieldTypeSelector";
import DropdownOptionsEditor from "@/components/field-editor/DropdownOptionsEditor";
import RatingSystemEditor from "@/components/field-editor/RatingSystemEditor";
import { STANDARD_SCOUT_VERDICTS } from "@/utils/recommendationHelpers";

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
        updatedField.options = [...STANDARD_SCOUT_VERDICTS];
      } else {
        updatedField.options = ['Option 1', 'Option 2', 'Option 3'];
      }
    }
    
    onUpdate(updatedField);
  };

  const handleAddDropdownOption = () => {
    const currentOptions = (field.options as string[]) || [];
    onUpdate({
      ...field,
      options: [...currentOptions, `Option ${currentOptions.length + 1}`]
    });
  };

  const handleUpdateDropdownOption = (index: number, value: string) => {
    const currentOptions = (field.options as string[]) || [];
    const updatedOptions = [...currentOptions];
    updatedOptions[index] = value;
    onUpdate({
      ...field,
      options: updatedOptions
    });
  };

  const handleRemoveDropdownOption = (index: number) => {
    const currentOptions = (field.options as string[]) || [];
    onUpdate({
      ...field,
      options: currentOptions.filter((_, i) => i !== index)
    });
  };

  const handleUseScoutVerdicts = () => {
    onUpdate({
      ...field,
      options: [...STANDARD_SCOUT_VERDICTS]
    });
  };

  return (
    <div className="space-y-4">
      <FieldBasicInfo
        label={field.label}
        description={field.description || ""}
        required={field.required || false}
        onLabelChange={(value) => onUpdate({ ...field, label: value })}
        onDescriptionChange={(value) => onUpdate({ ...field, description: value })}
        onRequiredChange={(value) => onUpdate({ ...field, required: value })}
      />
      
      <FieldTypeSelector
        value={field.type}
        onChange={handleFieldTypeChange}
      />
      
      {field.type === 'dropdown' && (
        <DropdownOptionsEditor
          options={(field.options as string[]) || []}
          onAddOption={handleAddDropdownOption}
          onUpdateOption={handleUpdateDropdownOption}
          onRemoveOption={handleRemoveDropdownOption}
          onUseScoutRecommendations={handleUseScoutVerdicts}
        />
      )}
      
      {field.type === 'rating' && field.ratingSystem && (
        <RatingSystemEditor
          ratingSystem={field.ratingSystem}
          onUpdate={handleRatingSystemUpdate}
        />
      )}
    </div>
  );
};

export default FieldEditor;
