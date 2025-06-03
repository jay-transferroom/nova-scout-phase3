
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, FileText, BookmarkCheck } from "lucide-react";

interface ReportsTabNavigationProps {
  onTabChange: (value: string) => void;
}

const ReportsTabNavigation = ({ onTabChange }: ReportsTabNavigationProps) => {
  return (
    <Tabs defaultValue="all-reports" onValueChange={onTabChange} className="mb-6">
      <TabsList className="grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="all-reports" className="flex items-center gap-2">
          <BookmarkCheck className="h-4 w-4" />
          <span>All Reports</span>
        </TabsTrigger>
        <TabsTrigger value="my-reports" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Submitted</span>
        </TabsTrigger>
        <TabsTrigger value="my-drafts" className="flex items-center gap-2">
          <File className="h-4 w-4" />
          <span>Drafts</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ReportsTabNavigation;
