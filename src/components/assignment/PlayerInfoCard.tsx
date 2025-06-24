
interface Player {
  id: string;
  name: string;
  club: string;
  positions: string[];
}

interface ExistingAssignment {
  assigned_to_scout?: {
    first_name?: string;
    last_name?: string;
  };
}

interface PlayerInfoCardProps {
  player: Player;
  existingAssignment: ExistingAssignment | null;
}

const PlayerInfoCard = ({ player, existingAssignment }: PlayerInfoCardProps) => {
  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <h4 className="font-medium">{player.name}</h4>
      <p className="text-sm text-gray-600">{player.club} • {player.positions.join(', ')}</p>
      {existingAssignment && (
        <p className="text-sm text-orange-600 mt-1">
          Currently assigned to: {existingAssignment.assigned_to_scout?.first_name} {existingAssignment.assigned_to_scout?.last_name}
        </p>
      )}
    </div>
  );
};

export default PlayerInfoCard;
