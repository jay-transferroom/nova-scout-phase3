
import { ScoutUser } from "@/hooks/useScoutUsers";
import { ScoutingAssignmentWithDetails } from "@/hooks/useScoutingAssignments";
import ScoutPerformanceCard from "./ScoutPerformanceCard";

interface ScoutPerformanceGridProps {
  scouts: ScoutUser[];
  assignments: ScoutingAssignmentWithDetails[];
  selectedScout: string;
  onScoutClick: (scoutId: string) => void;
}

const ScoutPerformanceGrid = ({
  scouts,
  assignments,
  selectedScout,
  onScoutClick
}: ScoutPerformanceGridProps) => {
  if (scouts.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Scout Performance Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {scouts.slice(0, 4).map((scout) => (
          <ScoutPerformanceCard
            key={scout.id}
            scout={scout}
            assignments={assignments}
            selectedScout={selectedScout}
            onScoutClick={onScoutClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ScoutPerformanceGrid;
