
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { File, FileText, BookmarkCheck, Award, Star } from "lucide-react";
import { Report, ReportWithPlayer } from "@/types/report";
import { Player } from "@/types/player";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
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
            notes: "Excellent prospect with strong technical ability."
          },
          {
            fieldId: "recommendation",
            value: "Sign",
            notes: "Recommended for immediate acquisition."
          }
        ]
      }
    ],
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
      }
    ],
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
  {
    id: "report-3",
    playerId: "player-3",
    templateId: "template-1",
    scoutId: "scout-2", // Another scout
    createdAt: new Date("2025-04-05"),
    updatedAt: new Date("2025-04-05"),
    status: "submitted",
    sections: [
      {
        sectionId: "overall",
        fields: [
          {
            fieldId: "overallRating",
            value: 7,
            notes: "Good prospect with potential to develop."
          },
          {
            fieldId: "recommendation",
            value: "Consider",
            notes: "Worth monitoring for development."
          }
        ]
      }
    ],
    player: {
      id: "player-3",
      name: "Takashi Yamamoto",
      club: "FC Tokyo",
      age: 19,
      dateOfBirth: "2005-11-08",
      positions: ["CB", "CDM"],
      dominantFoot: "Right",
      nationality: "Japan",
      contractStatus: "Under Contract",
      region: "Asia"
    }
  },
  {
    id: "report-4",
    playerId: "player-4",
    templateId: "template-2",
    scoutId: "scout-1",
    createdAt: new Date("2025-04-08"),
    updatedAt: new Date("2025-04-08"),
    status: "draft",
    sections: [
      {
        sectionId: "overall",
        fields: [
          {
            fieldId: "overallRating",
            value: 6,
            notes: "Average prospect, limited ceiling."
          },
          {
            fieldId: "recommendation",
            value: "Pass",
            notes: "Not recommended for acquisition."
          }
        ]
      }
    ],
    player: {
      id: "player-4",
      name: "Lucas Silva",
      club: "Flamengo",
      age: 21,
      dateOfBirth: "2003-08-15",
      positions: ["RB", "RWB"],
      dominantFoot: "Right",
      nationality: "Brazil",
      contractStatus: "Under Contract",
      region: "South America"
    }
  }
];

// Helper function to get rating color based on value
const getRatingColor = (value: any): string => {
  if (typeof value === "number") {
    if (value >= 8) return "text-green-600";
    if (value >= 6) return "text-amber-600";
    return "text-red-600";
  }
  
  if (typeof value === "string") {
    if (["A", "A+", "Priority Sign", "Sign"].includes(value)) return "text-green-600";
    if (["B", "B+", "Consider"].includes(value)) return "text-amber-600";
    return "text-red-600";
  }
  
  return "";
};

const ReportsList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all-reports");
  
  // Filter reports based on active tab
  const filteredReports = mockReports.filter(report => {
    if (activeTab === "my-reports") {
      return report.scoutId === "scout-1"; // Assuming current user is scout-1
    } else if (activeTab === "my-drafts") {
      return report.scoutId === "scout-1" && report.status === "draft";
    } else {
      return true; // "all-reports" tab
    }
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(date);
  };

  const handleViewReport = (reportId: string) => {
    navigate(`/reports/${reportId}`);
  };

  // Get overall rating from a report
  const getOverallRating = (report: ReportWithPlayer) => {
    const overallSection = report.sections.find(section => section.sectionId === "overall");
    if (!overallSection) return null;
    
    const ratingField = overallSection.fields.find(field => field.fieldId === "overallRating");
    return ratingField?.value;
  };

  // Get recommendation from a report
  const getRecommendation = (report: ReportWithPlayer) => {
    const overallSection = report.sections.find(section => section.sectionId === "overall");
    if (!overallSection) return null;
    
    const recommendationField = overallSection.fields.find(field => field.fieldId === "recommendation");
    return recommendationField?.value;
  };

  return (
    <div className="container mx-auto pt-8 pb-16 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Player Reports</h1>
        <p className="text-muted-foreground">View and manage scouting reports</p>
      </div>

      <Tabs defaultValue="all-reports" onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all-reports" className="flex items-center gap-2">
            <BookmarkCheck className="h-4 w-4" />
            <span>All Reports</span>
          </TabsTrigger>
          <TabsTrigger value="my-reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>My Reports</span>
          </TabsTrigger>
          <TabsTrigger value="my-drafts" className="flex items-center gap-2">
            <File className="h-4 w-4" />
            <span>My Drafts</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>
            {activeTab === "all-reports" && "All Scouting Reports"}
            {activeTab === "my-reports" && "My Submitted Reports"}
            {activeTab === "my-drafts" && "My Draft Reports"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Player</TableHead>
                <TableHead>Club</TableHead>
                <TableHead>Positions</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <Award size={14} />
                    <span>Rating</span>
                  </div>
                </TableHead>
                <TableHead>Recommendation</TableHead>
                <TableHead>Scout</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => {
                  const overallRating = getOverallRating(report);
                  const recommendation = getRecommendation(report);
                  
                  return (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.player.name}</TableCell>
                      <TableCell>{report.player.club}</TableCell>
                      <TableCell>{report.player.positions.join(", ")}</TableCell>
                      <TableCell>{formatDate(report.createdAt)}</TableCell>
                      <TableCell>
                        {report.status === "draft" ? (
                          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                            Draft
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Submitted
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {overallRating !== null && (
                          <span className={`font-semibold text-base ${getRatingColor(overallRating)}`}>
                            {overallRating}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {recommendation && (
                          <span className={getRatingColor(recommendation)}>
                            {recommendation}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {report.scoutId === "scout-1" ? "You" : "Other Scout"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewReport(report.id)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                    No reports found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsList;
