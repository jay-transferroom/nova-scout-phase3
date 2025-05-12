
import { useState } from "react";
import { RatingSystem, RatingOption } from "@/types/report";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface RatingOptionsEditorProps {
  ratingSystem: RatingSystem;
  onUpdate: (ratingSystem: RatingSystem) => void;
}

const RatingOptionsEditor = ({ ratingSystem, onUpdate }: RatingOptionsEditorProps) => {
  const isNumeric = ratingSystem.type.startsWith('numeric');
  const isLetter = ratingSystem.type === 'letter';
  const isCustomTag = ratingSystem.type === 'custom-tags';

  const handleUpdateOption = (index: number, field: string, value: string) => {
    const updatedValues = [...ratingSystem.values];
    updatedValues[index] = {
      ...updatedValues[index],
      [field]: field === "value" && isNumeric ? Number(value) : value
    };
    
    onUpdate({
      ...ratingSystem,
      values: updatedValues
    });
  };

  const handleDeleteOption = (index: number) => {
    // Don't allow deleting if we have minimum options
    if (isNumeric && ratingSystem.values.length <= 2) return;
    if ((isLetter || isCustomTag) && ratingSystem.values.length <= 1) return;
    
    const updatedValues = ratingSystem.values.filter((_, i) => i !== index);
    onUpdate({
      ...ratingSystem,
      values: updatedValues
    });
  };

  const handleAddOption = () => {
    let newValue: RatingOption;
    
    if (isNumeric) {
      const highest = Math.max(...ratingSystem.values.map(v => Number(v.value)));
      newValue = {
        value: highest + 1,
        label: `${highest + 1}`,
        description: "",
        color: "#8B5CF6" // Default color
      };
    } else if (isLetter) {
      newValue = {
        value: "X",
        label: "New Grade",
        description: "",
        color: "#8B5CF6" // Default color
      };
    } else {
      newValue = {
        value: "New Tag",
        description: "",
        color: "#8B5CF6" // Default color
      };
    }
    
    onUpdate({
      ...ratingSystem,
      values: [...ratingSystem.values, newValue]
    });
  };

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">Rating Options</div>
      
      <div className="space-y-3">
        {ratingSystem.values.map((option, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-center">
            {/* Display or edit the value */}
            <div className="col-span-2">
              <Input
                type={isNumeric ? "number" : "text"}
                value={option.value.toString()}
                onChange={(e) => handleUpdateOption(index, "value", e.target.value)}
                disabled={isNumeric} // Lock numeric values
                className="w-full"
              />
            </div>
            
            {/* Display or edit the label */}
            <div className="col-span-3">
              <Input
                value={option.label || ""}
                onChange={(e) => handleUpdateOption(index, "label", e.target.value)}
                placeholder="Label (optional)"
                className="w-full"
              />
            </div>
            
            {/* Display or edit the description */}
            <div className="col-span-4">
              <Input
                value={option.description || ""}
                onChange={(e) => handleUpdateOption(index, "description", e.target.value)}
                placeholder="Description (optional)"
                className="w-full"
              />
            </div>
            
            {/* Color picker */}
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded border border-gray-300" 
                  style={{ backgroundColor: option.color || "#000000" }}
                ></div>
                <Input
                  type="color"
                  value={option.color || "#000000"}
                  onChange={(e) => handleUpdateOption(index, "color", e.target.value)}
                  className="w-full h-8 p-1 cursor-pointer"
                  title="Choose color for this rating"
                />
              </div>
            </div>
            
            {/* Delete button */}
            <div className="col-span-1">
              <Button
                variant="ghost"
                size="sm"
                className={`p-0 h-8 w-8 ${
                  (isNumeric && ratingSystem.values.length <= 2) || 
                  ((isLetter || isCustomTag) && ratingSystem.values.length <= 1)
                    ? "opacity-50 cursor-not-allowed"
                    : "text-destructive hover:text-destructive"
                }`}
                onClick={() => handleDeleteOption(index)}
                disabled={(isNumeric && ratingSystem.values.length <= 2) || 
                         ((isLetter || isCustomTag) && ratingSystem.values.length <= 1)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add new option button */}
      <Button
        variant="outline"
        size="sm"
        className="w-full mt-2"
        onClick={handleAddOption}
      >
        <Plus size={16} className="mr-1" />
        Add Rating Option
      </Button>
    </div>
  );
};

export default RatingOptionsEditor;
