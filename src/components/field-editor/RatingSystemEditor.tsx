
import { Label } from "@/components/ui/label";
import { RatingSystem } from "@/types/report";
import RatingOptionsEditor from "@/components/RatingOptionsEditor";

interface RatingSystemEditorProps {
  ratingSystem: RatingSystem;
  onUpdate: (ratingSystem: RatingSystem) => void;
}

const RatingSystemEditor = ({ ratingSystem, onUpdate }: RatingSystemEditorProps) => {
  return (
    <div className="space-y-2 border p-4 rounded">
      <Label>Rating Options</Label>
      <RatingOptionsEditor 
        ratingSystem={ratingSystem} 
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default RatingSystemEditor;
