
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { ScoutUser } from "@/hooks/useScoutUsers";

interface ScoutManagementFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedScout: string;
  setSelectedScout: (scoutId: string) => void;
  scouts: ScoutUser[];
}

const ScoutManagementFilters = ({
  searchTerm,
  setSearchTerm,
  selectedScout,
  setSelectedScout,
  scouts
}: ScoutManagementFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={selectedScout} onValueChange={setSelectedScout}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All Scouts" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Scouts</SelectItem>
          {scouts.map((scout) => (
            <SelectItem key={scout.id} value={scout.id}>
              {scout.first_name} {scout.last_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline">
        <Filter className="h-4 w-4 mr-2" />
        Filters
      </Button>
    </div>
  );
};

export default ScoutManagementFilters;
