
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

interface DropdownOptionsEditorProps {
  options: string[];
  onAddOption: () => void;
  onUpdateOption: (index: number, value: string) => void;
  onRemoveOption: (index: number) => void;
  onUseScoutRecommendations: () => void;
}

const DropdownOptionsEditor = ({
  options,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
  onUseScoutRecommendations
}: DropdownOptionsEditorProps) => {
  return (
    <div className="space-y-2 border p-4 rounded">
      <div className="flex justify-between items-center">
        <Label>Dropdown Options</Label>
        <div className="space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onUseScoutRecommendations}
            className="text-xs"
          >
            Use Scout Recommendations
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddOption}
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              value={option}
              onChange={(e) => onUpdateOption(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemoveOption(index)}
              className="text-destructive"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>
      
      {options.length === 0 && (
        <p className="text-sm text-muted-foreground">No options added yet</p>
      )}
    </div>
  );
};

export default DropdownOptionsEditor;
