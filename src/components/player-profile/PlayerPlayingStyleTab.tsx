import { Card, CardContent } from "@/components/ui/card";
import { Player } from "@/types/player";

interface PlayerPlayingStyleTabProps {
  player: Player;
}

export const PlayerPlayingStyleTab = ({ player }: PlayerPlayingStyleTabProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Playing Style</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Football Pitch */}
        <Card>
          <CardContent className="p-8">
            <div className="relative bg-emerald-500 rounded-lg p-6" style={{ aspectRatio: '4/3' }}>
              {/* Pitch markings */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                {/* Outer boundary */}
                <rect x="10" y="10" width="380" height="280" fill="none" stroke="white" strokeWidth="2" />
                
                {/* Center circle */}
                <circle cx="200" cy="150" r="40" fill="none" stroke="white" strokeWidth="2" />
                <circle cx="200" cy="150" r="2" fill="white" />
                
                {/* Center line */}
                <line x1="200" y1="10" x2="200" y2="290" stroke="white" strokeWidth="2" />
                
                {/* Goal areas */}
                <rect x="10" y="110" width="40" height="80" fill="none" stroke="white" strokeWidth="2" />
                <rect x="350" y="110" width="40" height="80" fill="none" stroke="white" strokeWidth="2" />
                
                {/* Penalty areas */}
                <rect x="10" y="80" width="80" height="140" fill="none" stroke="white" strokeWidth="2" />
                <rect x="310" y="80" width="80" height="140" fill="none" stroke="white" strokeWidth="2" />
                
                {/* Penalty spots */}
                <circle cx="70" cy="150" r="2" fill="white" />
                <circle cx="330" cy="150" r="2" fill="white" />
                
                {/* Corner arcs */}
                <path d="M 10 10 Q 20 10 20 20" fill="none" stroke="white" strokeWidth="2" />
                <path d="M 390 10 Q 380 10 380 20" fill="none" stroke="white" strokeWidth="2" />
                <path d="M 10 290 Q 20 290 20 280" fill="none" stroke="white" strokeWidth="2" />
                <path d="M 390 290 Q 380 290 380 280" fill="none" stroke="white" strokeWidth="2" />
              </svg>
              
              {/* Player positions */}
              <div className="absolute inset-0">
                {/* Attacking position (right wing) */}
                <div className="absolute w-4 h-4 bg-white rounded-full" style={{ top: '35%', right: '15%', transform: 'translate(50%, -50%)' }}></div>
                
                {/* Central position */}
                <div className="absolute w-6 h-6 bg-white rounded-full" style={{ top: '60%', right: '25%', transform: 'translate(50%, -50%)' }}></div>
                
                {/* Supporting positions */}
                <div className="absolute w-4 h-4 bg-white rounded-full" style={{ top: '75%', right: '35%', transform: 'translate(50%, -50%)' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Playing Style Description */}
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Mohamed Salah is an <span className="text-emerald-600">Inverted Winger</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Inverted Wingers tend to run inside from wide positions while attacking. They 
              take more shots relative to other wingers, but play fewer passes and crosses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};