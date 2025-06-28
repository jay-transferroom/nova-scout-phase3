
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2 } from "lucide-react";
import { Player } from "@/types/player";
import { toast } from "sonner";

interface PlayerAIRecommendationProps {
  player: Player;
}

const PlayerAIRecommendation = ({ player }: PlayerAIRecommendationProps) => {
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateRecommendation = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI generation - in reality this would call an edge function
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockRecommendation = `Based on ${player.name}'s profile analysis:

OVERALL ASSESSMENT: ${player.age < 23 ? 'Promising young talent' : player.age < 28 ? 'Established professional' : 'Experienced veteran'} with ${player.positions.length > 1 ? 'versatile positioning' : 'specialized role'}.

KEY STRENGTHS:
• ${player.age < 25 ? 'High potential for development' : 'Proven experience at professional level'}
• ${player.positions.length > 1 ? `Versatility across ${player.positions.join(', ')} positions` : `Specialist ${player.positions[0]} with focused skills`}
• ${player.nationality !== 'Unknown' ? `International experience (${player.nationality})` : 'Domestic experience'}

RECOMMENDATION:
${player.age < 21 ? 'Consider for academy development or loan opportunity' :
  player.age < 26 ? 'Strong candidate for first-team integration' :
  player.age < 30 ? 'Immediate impact player for squad depth' :
  'Valuable experience for squad leadership'}

NEXT STEPS:
• Schedule detailed scouting assessment
• ${player.age < 25 ? 'Monitor development progress' : 'Evaluate immediate availability'}
• Consider squad fit and tactical requirements`;

      setRecommendation(mockRecommendation);
    } catch (error) {
      toast.error("Failed to generate AI recommendation");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-purple-600" />
            AI Recommendation
          </CardTitle>
          <Button 
            onClick={generateRecommendation} 
            disabled={isGenerating}
            size="sm"
            variant={recommendation ? "outline" : "default"}
            className="gap-1.5"
          >
            {isGenerating ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
            {isGenerating ? "Analyzing..." : recommendation ? "Regenerate" : "Generate"}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {recommendation ? (
          <div className="space-y-3">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <pre className="whitespace-pre-wrap text-xs text-gray-800 font-medium leading-relaxed">
                {recommendation}
              </pre>
            </div>
            
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-purple-700 bg-purple-50 border-purple-200 text-xs">
                AI Generated
              </Badge>
            </div>
          </div>
        ) : isGenerating ? (
          <div className="flex items-center justify-center py-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              <p className="text-sm text-muted-foreground">Analyzing player data...</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="bg-gray-50 rounded-lg p-4 mb-3">
              <Sparkles className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Get AI insights for {player.name}</p>
              <p className="text-xs text-gray-500">
                Generate personalized recruitment recommendations based on player profile analysis
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerAIRecommendation;
