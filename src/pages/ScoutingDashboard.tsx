
import { useState } from "react";
import PlayerSearch from "@/components/PlayerSearch";
import PlayerProfilePreview from "@/components/PlayerProfilePreview";
import TemplateSelection from "@/components/TemplateSelection";
import { Player } from "@/types/player";
import { ReportTemplate } from "@/types/report";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ScoutingDashboard = () => {
  const navigate = useNavigate();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handleClosePlayerProfile = () => {
    setSelectedPlayer(null);
  };

  const handleCreateReport = (player: Player) => {
    setIsTemplateDialogOpen(true);
  };

  const handleSelectTemplate = (player: Player, template: ReportTemplate) => {
    setIsTemplateDialogOpen(false);
    toast({
      title: "Report Started",
      description: `New ${template.name} for ${player.name} created.`,
    });
    // In a real app, this would navigate to the report builder with the player and template
    console.log("Creating report for", player.name, "using template", template.name);
    
    // For now, we'll just close everything since we haven't built the report builder yet
    setSelectedPlayer(null);
  };

  return (
    <div className="container mx-auto pt-8 pb-16 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Football Scouting System</h1>
        <p className="text-muted-foreground">Search for players and create scouting reports</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-4">Player Search</h2>
          </div>
          <PlayerSearch onSelectPlayer={handleSelectPlayer} />
        </div>
        
        <div className="hidden md:block">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-4">Player Profile</h2>
          </div>
          <div className="rounded-lg border h-[calc(100%-3rem)] flex items-center justify-center text-muted-foreground">
            {selectedPlayer ? (
              <PlayerProfilePreview 
                player={selectedPlayer} 
                onCreateReport={handleCreateReport} 
                onClose={handleClosePlayerProfile} 
              />
            ) : (
              <p>Select a player to view their profile</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile view for player profile */}
      <Sheet open={!!selectedPlayer && window.innerWidth < 768} onOpenChange={(open) => !open && setSelectedPlayer(null)}>
        <SheetContent className="w-full sm:max-w-md p-0">
          {selectedPlayer && (
            <PlayerProfilePreview 
              player={selectedPlayer} 
              onCreateReport={handleCreateReport} 
              onClose={handleClosePlayerProfile} 
            />
          )}
        </SheetContent>
      </Sheet>
      
      {/* Template selection dialog */}
      {selectedPlayer && (
        <TemplateSelection 
          player={selectedPlayer}
          isOpen={isTemplateDialogOpen}
          onClose={() => setIsTemplateDialogOpen(false)}
          onSelectTemplate={handleSelectTemplate}
        />
      )}
    </div>
  );
};

export default ScoutingDashboard;
