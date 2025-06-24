
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Prospect } from "@/data/mockProspects";

interface ProspectProfileProps {
  prospect: Prospect;
}

const ProspectProfile = ({ prospect }: ProspectProfileProps) => {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <Avatar className="w-12 h-12">
        <AvatarFallback className="bg-green-100 text-green-700">
          {prospect.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="font-semibold">{prospect.name}</div>
        <div className="text-sm text-muted-foreground">
          {prospect.club} • Age {prospect.age} • {prospect.nationality}
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-lg text-green-600">{prospect.rating}</div>
        <div className="text-xs text-muted-foreground">Rating</div>
      </div>
    </div>
  );
};

export default ProspectProfile;
