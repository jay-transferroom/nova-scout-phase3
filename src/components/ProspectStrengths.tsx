
import { Badge } from "@/components/ui/badge";

interface ProspectStrengthsProps {
  strengths: string[];
}

const ProspectStrengths = ({ strengths }: ProspectStrengthsProps) => {
  return (
    <div>
      <h4 className="font-medium mb-2">Key Strengths</h4>
      <div className="flex flex-wrap gap-2">
        {strengths.map((strength, index) => (
          <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
            {strength}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ProspectStrengths;
