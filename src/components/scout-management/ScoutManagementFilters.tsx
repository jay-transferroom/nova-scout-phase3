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
  return;
};
export default ScoutManagementFilters;