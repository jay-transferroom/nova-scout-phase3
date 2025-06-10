import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, MapPin, Users } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { cn } from "@/lib/utils";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Mock fixture data - this would come from your data source
  const fixtures = [
    {
      id: "1",
      date: new Date(2025, 5, 12, 15, 0),
      homeTeam: "Manchester City",
      awayTeam: "Liverpool",
      competition: "Premier League",
      venue: "Etihad Stadium",
      playersToWatch: ["Erling Haaland", "Mohamed Salah"]
    },
    {
      id: "2",
      date: new Date(2025, 5, 15, 17, 30),
      homeTeam: "Barcelona",
      awayTeam: "Real Madrid",
      competition: "La Liga",
      venue: "Camp Nou",
      playersToWatch: ["Pedri", "Vinicius Jr"]
    },
    {
      id: "3",
      date: new Date(2025, 5, 18, 20, 0),
      homeTeam: "PSG",
      awayTeam: "Monaco",
      competition: "Ligue 1",
      venue: "Parc des Princes",
      playersToWatch: ["Kylian Mbappé"]
    }
  ];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getFixturesForDate = (date: Date) => {
    return fixtures.filter(fixture => isSameDay(fixture.date, date));
  };

  const selectedDateFixtures = selectedDate ? getFixturesForDate(selectedDate) : [];

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-muted-foreground mt-2">
          View upcoming fixtures for players on your shortlists and assignments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {format(currentDate, "MMMM yyyy")}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                >
                  Next
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {days.map(day => {
                  const dayFixtures = getFixturesForDate(day);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        "p-2 h-20 border rounded-lg text-left hover:bg-muted/50 transition-colors",
                        isSelected && "bg-primary text-primary-foreground",
                        !isCurrentMonth && "text-muted-foreground bg-muted/20",
                        isToday(day) && !isSelected && "bg-blue-50 border-blue-200"
                      )}
                    >
                      <div className="font-medium text-sm">{format(day, 'd')}</div>
                      <div className="mt-1 space-y-1">
                        {dayFixtures.slice(0, 2).map(fixture => (
                          <div key={fixture.id} className="text-xs bg-blue-100 text-blue-800 rounded px-1 py-0.5 truncate">
                            {fixture.homeTeam} vs {fixture.awayTeam}
                          </div>
                        ))}
                        {dayFixtures.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayFixtures.length - 2} more
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fixture Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate 
                  ? format(selectedDate, "EEEE, MMMM d")
                  : "Select a date"
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateFixtures.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateFixtures.map(fixture => (
                    <div key={fixture.id} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {format(fixture.date, "HH:mm")}
                        </span>
                        <Badge variant="outline">{fixture.competition}</Badge>
                      </div>
                      
                      <div className="text-center mb-3">
                        <div className="font-semibold">{fixture.homeTeam}</div>
                        <div className="text-sm text-muted-foreground">vs</div>
                        <div className="font-semibold">{fixture.awayTeam}</div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{fixture.venue}</span>
                      </div>
                      
                      {fixture.playersToWatch.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Players to Watch</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {fixture.playersToWatch.map(player => (
                              <Badge key={player} variant="secondary" className="text-xs">
                                {player}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {selectedDate 
                    ? "No fixtures scheduled for this date"
                    : "Select a date to view fixtures"
                  }
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Fixtures Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fixtures.slice(0, 3).map(fixture => (
                  <div key={fixture.id} className="flex items-center gap-3">
                    <div className="text-sm font-medium min-w-[60px]">
                      {format(fixture.date, "MMM d")}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {fixture.homeTeam} vs {fixture.awayTeam}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {fixture.competition}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
