import { Button } from "@/components/ui/button";
import { LayoutGrid, Table } from "lucide-react";

interface ScoutManagementViewToggleProps {
  currentView: 'kanban' | 'table';
  onViewChange: (view: 'kanban' | 'table') => void;
}

const ScoutManagementViewToggle = ({ currentView, onViewChange }: ScoutManagementViewToggleProps) => {
  return (
    <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
      <Button
        variant={currentView === 'kanban' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('kanban')}
        className="flex items-center gap-2"
      >
        <LayoutGrid className="h-4 w-4" />
        Board
      </Button>
      <Button
        variant={currentView === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('table')}
        className="flex items-center gap-2"
      >
        <Table className="h-4 w-4" />
        Table
      </Button>
    </div>
  );
};

export default ScoutManagementViewToggle;