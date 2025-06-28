
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Recommendation
          </CardTitle>
          {!recommendation && (
            <Button 
              onClick={generateRecommendation} 
              disabled={isGenerating}
              size="sm"
              className="gap-2"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isGenerating ? "Analyzing..." : "Generate"}
            </Button>
          )}
        </div>
      </CardHeader>
      
      {recommendation && (
        <CardContent>
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-medium">
                {recommendation}
              </pre>
            </div>
            
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-purple-700 bg-purple-50 border-purple-200">
                AI Generated
              </Badge>
              <Button 
                onClick={generateRecommendation} 
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Regenerate
              </Button>
            </div>
          </div>
        </CardContent>
      )}
      
      {isGenerating && (
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-4"></div>
            <p className="text-muted-foreground">Analyzing player data and generating recommendation...</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default PlayerAIRecommendation;
