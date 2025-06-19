
import { FileText, Star, Award, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReportWithPlayer } from "@/types/report";
import { getOverallRating, getRecommendation } from "@/utils/reportDataExtraction";
import { formatDate, getRatingColor } from "@/utils/reportFormatting";

interface PlayerReportsProps {
  playerReports: ReportWithPlayer[];
  reportsLoading: boolean;
  onViewReport: (reportId: string) => void;
}

export const PlayerReports = ({ playerReports, reportsLoading, onViewReport }: PlayerReportsProps) => {
  if (!playerReports || playerReports.length === 0) {
    return null;
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Scouting Reports ({playerReports.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reportsLoading ? (
            <p className="text-center py-4">Loading reports...</p>
          ) : (
            playerReports.map((report) => {
              const rating = getOverallRating(report);
              const recommendation = getRecommendation(report);
              
              return (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="capitalize">
                          {report.status}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {formatDate(report.createdAt)}
                        </span>
                        {report.scoutProfile && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <User className="h-3 w-3" />
                            <span>
                              {report.scoutProfile.first_name} {report.scoutProfile.last_name}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {rating !== null && (
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className={`font-medium ${getRatingColor(rating)}`}>
                              Rating: {rating}
                            </span>
                          </div>
                        )}
                        
                        {recommendation && (
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-blue-500" />
                            <span className="font-medium text-slate-600">
                              {recommendation}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onViewReport(report.id)}
                    >
                      View Report
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
