import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, Calendar, User, Award } from "lucide-react";
import { Report, ReportWithPlayer, ReportFieldType, ReportField } from "@/types/report";
import { Player } from "@/types/player";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Mock data for demonstration
const mockReports: Array<ReportWithPlayer> = [
  {
    id: "report-1",
    playerId: "player-1",
    templateId: "template-1",
    scoutId: "scout-1",
    createdAt: new Date("2025-04-15"),
    updatedAt: new Date("2025-04-15"),
    status: "submitted",
    sections: [
      {
        sectionId: "overall",
        fields: [
          {
            fieldId: "overallRating",
            value: 8,
            notes: "Excellent prospect with strong technical ability and good physical attributes."
          },
          {
            fieldId: "recommendation",
            value: "Sign",
            notes: "Recommended for immediate acquisition."
          }
        ]
      },
      {
        sectionId: "technical",
        fields: [
          {
            fieldId: "passing",
            value: 7,
            notes: "Good range of passing, comfortable on the ball."
          },
          {
            fieldId: "shooting",
            value: 8,
            notes: "Excellent shot technique and power."
          }
        ]
      },
      {
        sectionId: "physical",
        fields: [
          {
            fieldId: "speed",
            value: 9,
            notes: "Explosive speed, very quick over short distances."
          },
          {
            fieldId: "strength",
            value: 6,
            notes: "Good upper body strength, can improve lower body."
          }
        ]
      }
    ],
    matchContext: {
      date: "2025-04-15",
      opposition: "Arsenal",
      competition: "Premier League",
      minutesPlayed: 90,
      conditions: "Dry, Good pitch",
      roleContext: "Started as CM in a 4-3-3"
    },
    tags: ["Technical", "Creative", "High Potential"],
    player: {
      id: "player-1",
      name: "Marcus Johnson",
      club: "Manchester United",
      age: 22,
      dateOfBirth: "2002-06-12",
      positions: ["CM", "CAM"],
      dominantFoot: "Right",
      nationality: "England",
      contractStatus: "Under Contract",
      region: "Europe"
    }
  },
  {
    id: "report-2",
    playerId: "player-2",
    templateId: "template-2",
    scoutId: "scout-1",
    createdAt: new Date("2025-04-10"),
    updatedAt: new Date("2025-04-10"),
    status: "submitted",
    sections: [
      {
        sectionId: "overall",
        fields: [
          {
            fieldId: "overallRating",
            value: 9,
            notes: "Exceptional talent with high ceiling."
          },
          {
            fieldId: "recommendation",
            value: "Priority Sign",
            notes: "Should be a top priority target."
          }
        ]
      },
      {
        sectionId: "technical",
        fields: [
          {
            fieldId: "dribbling",
            value: "A",
            notes: "Elite dribbler, excellent close control."
          },
          {
            fieldId: "vision",
            value: "B+",
            notes: "Very good vision and decision making."
          }
        ]
      }
    ],
    matchContext: {
      date: "2025-04-10",
      opposition: "Barcelona",
      competition: "Champions League",
      minutesPlayed: 75,
      conditions: "Rainy",
      roleContext: "Left Wing in a 4-3-3"
    },
    tags: ["Elite", "Technical", "Creative"],
    player: {
      id: "player-2",
      name: "Carlos Sanchez",
      club: "Real Madrid",
      age: 24,
      dateOfBirth: "2000-03-22",
      positions: ["LW", "ST"],
      dominantFoot: "Left",
      nationality: "Spain",
      contractStatus: "Under Contract",
      region: "Europe"
    }
  },
  // Reports for other players...
];

// Helper function to get rating color based on value
const getRatingColor = (value: any): string => {
  if (typeof value === "number") {
    if (value >= 8) return "text-green-600";
    if (value >= 6) return "text-amber-600";
    return "text-red-600";
  }
  
  if (typeof value === "string") {
    if (["A", "A+", "A-", "B+", "Priority Sign", "Sign"].includes(value)) return "text-green-600";
    if (["B", "B-", "C+", "Consider"].includes(value)) return "text-amber-600";
    return "text-red-600";
  }
  
  return "";
};

const ReportView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<ReportWithPlayer | null>(null);
  const [activeTab, setActiveTab] = useState("summary");
  
  useEffect(() => {
    if (!id) return;
    
    // In a real app, this would fetch from an API
    const foundReport = mockReports.find(r => r.id === id);
    if (foundReport) {
      setReport(foundReport);
    }
  }, [id]);
  
  if (!report) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <p>Loading report...</p>
      </div>
    );
  }
  
  // Find overall rating if available
  const overallSection = report.sections.find(section => section.sectionId === "overall");
  const overallRatingField = overallSection?.fields.find(field => field.fieldId === "overallRating");
  const recommendationField = overallSection?.fields.find(field => field.fieldId === "recommendation");
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(date);
  };

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/reports")} className="gap-2">
          <ArrowLeft size={16} />
          Back to Reports
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Player info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Player Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col items-center mb-4">
                  {report.player.image ? (
                    <img 
                      src={report.player.image} 
                      alt={report.player.name} 
                      className="w-24 h-24 rounded-full object-cover mb-2" 
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold">{report.player.name.charAt(0)}</span>
                    </div>
                  )}
                  <h2 className="text-2xl font-bold text-center">{report.player.name}</h2>
                  <div className="flex flex-wrap gap-1 mt-2 justify-center">
                    {report.player.positions.map((position) => (
                      <Badge key={position} variant="outline">{position}</Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Age</span>
                    <span className="font-medium">{report.player.age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Club</span>
                    <span className="font-medium">{report.player.club}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nationality</span>
                    <span className="font-medium">{report.player.nationality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Foot</span>
                    <span className="font-medium">{report.player.dominantFoot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contract</span>
                    <span className="font-medium">{report.player.contractStatus}</span>
                  </div>
                </div>
                
                {report.matchContext && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Calendar size={16} />
                        Match Context
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date</span>
                          <span>{report.matchContext.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Opposition</span>
                          <span>{report.matchContext.opposition}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Competition</span>
                          <span>{report.matchContext.competition}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Minutes</span>
                          <span>{report.matchContext.minutesPlayed}</span>
                        </div>
                        {report.matchContext.roleContext && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Role</span>
                            <span>{report.matchContext.roleContext}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText size={16} />
                    Report Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span>{formatDate(report.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Scout</span>
                      <span>{report.scoutId === "scout-1" ? "You" : "Other Scout"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant={report.status === "submitted" ? "secondary" : "outline"}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {report.tags && report.tags.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-1">
                        {report.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Report content */}
        <div className="lg:col-span-2">
          {/* Overall Assessment */}
          {overallSection && (
            <Card className="mb-6 border-primary/30 bg-primary/5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Award className="text-primary" size={20} />
                  <CardTitle className="text-xl text-primary">Overall Assessment</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {overallRatingField && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium">Overall Rating</h3>
                        <span className={`text-xl font-bold ${getRatingColor(overallRatingField.value)}`}>
                          {overallRatingField.value}
                        </span>
                      </div>
                      {overallRatingField.notes && (
                        <p className="text-sm text-muted-foreground">{overallRatingField.notes}</p>
                      )}
                    </div>
                  )}
                  
                  {recommendationField && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium">Recommendation</h3>
                        <span className={`text-lg font-semibold ${getRatingColor(recommendationField.value)}`}>
                          {recommendationField.value}
                        </span>
                      </div>
                      {recommendationField.notes && (
                        <p className="text-sm text-muted-foreground">{recommendationField.notes}</p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs for different sections of the report */}
          <Card>
            <CardHeader className="pb-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="technical">Technical</TabsTrigger>
                  <TabsTrigger value="physical">Physical</TabsTrigger>
                </TabsList>
              
                <TabsContent value="summary" className="space-y-4 pt-6">
                  {report.sections
                    .filter(section => section.sectionId !== "overall" && 
                      (section.sectionId === "summary" || !["technical", "physical"].includes(section.sectionId)))
                    .map(section => (
                      <div key={section.sectionId} className="space-y-4">
                        {section.fields.map(field => (
                          <div key={field.fieldId} className="border-b pb-4 last:border-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{field.fieldId}</h3>
                              {typeof field.value === "number" || 
                              (typeof field.value === "string" && field.value.length < 10) ? (
                                <span className={`font-semibold ${getRatingColor(field.value)}`}>
                                  {field.value}
                                </span>
                              ) : null}
                            </div>
                            {typeof field.value === "string" && field.value.length > 10 ? (
                              <p className="mt-1">{field.value}</p>
                            ) : null}
                            {field.notes && <p className="text-sm text-muted-foreground mt-1">{field.notes}</p>}
                          </div>
                        ))}
                      </div>
                    ))}
                </TabsContent>
                
                <TabsContent value="technical" className="space-y-4 pt-6">
                  {report.sections
                    .filter(section => section.sectionId === "technical")
                    .map(section => (
                      <div key={section.sectionId} className="space-y-4">
                        {section.fields.map(field => (
                          <div key={field.fieldId} className="border-b pb-4 last:border-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{field.fieldId}</h3>
                              {typeof field.value === "number" || 
                              (typeof field.value === "string" && field.value.length < 10) ? (
                                <span className={`font-semibold ${getRatingColor(field.value)}`}>
                                  {field.value}
                                </span>
                              ) : null}
                            </div>
                            {typeof field.value === "string" && field.value.length > 10 ? (
                              <p className="mt-1">{field.value}</p>
                            ) : null}
                            {field.notes && <p className="text-sm text-muted-foreground mt-1">{field.notes}</p>}
                          </div>
                        ))}
                      </div>
                    ))}
                </TabsContent>
                
                <TabsContent value="physical" className="space-y-4 pt-6">
                  {report.sections
                    .filter(section => section.sectionId === "physical")
                    .map(section => (
                      <div key={section.sectionId} className="space-y-4">
                        {section.fields.map(field => (
                          <div key={field.fieldId} className="border-b pb-4 last:border-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{field.fieldId}</h3>
                              {typeof field.value === "number" || 
                              (typeof field.value === "string" && field.value.length < 10) ? (
                                <span className={`font-semibold ${getRatingColor(field.value)}`}>
                                  {field.value}
                                </span>
                              ) : null}
                            </div>
                            {typeof field.value === "string" && field.value.length > 10 ? (
                              <p className="mt-1">{field.value}</p>
                            ) : null}
                            {field.notes && <p className="text-sm text-muted-foreground mt-1">{field.notes}</p>}
                          </div>
                        ))}
                      </div>
                    ))}
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
