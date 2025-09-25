import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Player } from "@/types/player";
interface PlayerCareerTabProps {
  player: Player;
}
export const PlayerCareerTab = ({
  player
}: PlayerCareerTabProps) => {
  // Mock career data based on the screenshot
  const careerData = [{
    year: "2017",
    team: "Liverpool FC",
    logo: "🔴",
    // Using emoji for now, could be replaced with actual logos
    from: "Jul 2017",
    to: "Today",
    type: "Transfer",
    fee: "€42M"
  }, {
    year: "2016",
    team: "AS Roma",
    logo: "🟡",
    from: "Jul 2016",
    to: "Jul 2017",
    type: "Transfer",
    fee: "€15M"
  }, {
    year: "2015",
    team: "AS Roma",
    logo: "🟡",
    from: "Aug 2015",
    to: "Jun 2016",
    type: "Loan",
    fee: "-"
  }, {
    year: "2015",
    team: "ACF Fiorentina",
    logo: "🟣",
    from: "Feb 2015",
    to: "Jun 2015",
    type: "Loan",
    fee: "-"
  }, {
    year: "2014",
    team: "Chelsea FC",
    logo: "🔵",
    from: "Jan 2014",
    to: "Jul 2016",
    type: "Transfer",
    fee: "€16.5M"
  }];
  return <div className="space-y-6">
      <h2 className="text-3xl font-bold">Career</h2>
      
      {/* Career Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-muted-foreground">Year</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Team</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">From</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">To</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Fee</th>
                </tr>
              </thead>
              <tbody>
                {careerData.map((career, index) => <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-4 text-muted-foreground">{career.year}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{career.logo}</span>
                        <span className="font-medium">{career.team}</span>
                      </div>
                    </td>
                    <td className="p-4">{career.from}</td>
                    <td className="p-4">{career.to}</td>
                    <td className="p-4">{career.type}</td>
                    <td className="p-4 font-medium">{career.fee}</td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        
      </div>
    </div>;
};