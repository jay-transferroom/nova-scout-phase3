import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
interface ViewToggleProps {
  currentView: 'pitch' | 'list';
  onViewChange: (view: 'pitch' | 'list') => void;
}
const ViewToggle = ({
  currentView,
  onViewChange
}: ViewToggleProps) => {
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      <Button
        variant={currentView === 'pitch' ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange('pitch')}
        className="flex items-center gap-2"
      >
        <LayoutGrid className="h-4 w-4" />
        Pitch
      </Button>
      <Button
        variant={currentView === 'list' ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange('list')}
        className="flex items-center gap-2"
      >
        <List className="h-4 w-4" />
        List
      </Button>
    </div>
  );
};
export default ViewToggle;