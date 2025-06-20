
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import TemplateSelection from "@/components/TemplateSelection";
import { Player } from "@/types/player";
import { ReportTemplate } from "@/types/report";

interface TemplateSelectionScreenProps {
  player: Player | null;
  onSelectTemplate: (player: Player, template: ReportTemplate) => void;
  onBack: () => void;
}

const TemplateSelectionScreen = ({ player, onSelectTemplate, onBack }: TemplateSelectionScreenProps) => {
  if (!player) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft size={16} />
            Back
          </Button>
        </div>
        <div className="text-center">
          <p>Loading player information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>

      <TemplateSelection 
        player={player}
        isOpen={true}
        onClose={onBack}
        onSelectTemplate={onSelectTemplate}
      />
    </div>
  );
};

export default TemplateSelectionScreen;
