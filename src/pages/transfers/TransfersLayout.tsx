
import { Outlet } from "react-router-dom";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const TransfersLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("requirements");
  
  useEffect(() => {
    if (location.pathname.includes("/transfers/requirements")) {
      setActiveTab("requirements");
    } else if (location.pathname.includes("/transfers/pitches")) {
      setActiveTab("pitches");
    } else if (location.pathname.includes("/transfers/scouting-tasks")) {
      setActiveTab("scouting-tasks");
    } else if (location.pathname.includes("/transfers/upcoming-matches")) {
      setActiveTab("upcoming-matches");
    }
  }, [location]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    switch (value) {
      case "requirements":
        navigate("/transfers/requirements");
        break;
      case "pitches":
        navigate("/transfers/pitches");
        break;
      case "scouting-tasks":
        navigate("/transfers/scouting-tasks");
        break;
      case "upcoming-matches":
        navigate("/transfers/upcoming-matches");
        break;
    }
  };
  
  return (
    <div className="container mx-auto">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="border-b sticky top-0 bg-background z-10">
          <TabsList className="w-full justify-start p-0">
            <TabsTrigger value="requirements" className="py-3 px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              Requirements
            </TabsTrigger>
            <TabsTrigger value="pitches" className="py-3 px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              Player Pitches
            </TabsTrigger>
            <TabsTrigger value="scouting-tasks" className="py-3 px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              Scouting Tasks
            </TabsTrigger>
            <TabsTrigger value="upcoming-matches" className="py-3 px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
              Upcoming Matches
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="pt-6">
          <TabsContent value={activeTab} className="mt-0">
            <Outlet />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default TransfersLayout;
