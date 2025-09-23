import { SlidingToggle } from "@/components/ui/sliding-toggle";
import { LayoutGrid, Table } from "lucide-react";

interface ScoutManagementViewToggleProps {
  currentView: 'kanban' | 'table';
  onViewChange: (view: 'kanban' | 'table') => void;
}

const ScoutManagementViewToggle = ({ currentView, onViewChange }: ScoutManagementViewToggleProps) => {
  return (
    <SlidingToggle
      value={currentView}
      onChange={(value) => onViewChange(value as 'kanban' | 'table')}
      options={[
        { 
          value: "kanban", 
          label: (
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              Board
            </div>
          )
        },
        { 
          value: "table", 
          label: (
            <div className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Table
            </div>
          )
        }
      ]}
    />
  );
};

export default ScoutManagementViewToggle;