
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";

interface PlayerSearchFiltersProps {
  ageFilter: string;
  contractFilter: string;
  regionFilter: string;
  onAgeFilterChange: (value: string) => void;
  onContractFilterChange: (value: string) => void;
  onRegionFilterChange: (value: string) => void;
}

const PlayerSearchFilters = ({
  ageFilter,
  contractFilter,
  regionFilter,
  onAgeFilterChange,
  onContractFilterChange,
  onRegionFilterChange
}: PlayerSearchFiltersProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Filter Players</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Age</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onAgeFilterChange("all")} className={ageFilter === "all" ? "bg-accent" : ""}>
            All ages
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAgeFilterChange("u21")} className={ageFilter === "u21" ? "bg-accent" : ""}>
            Under 21
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAgeFilterChange("21-25")} className={ageFilter === "21-25" ? "bg-accent" : ""}>
            21-25 years
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAgeFilterChange("26+")} className={ageFilter === "26+" ? "bg-accent" : ""}>
            26+ years
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Contract Status</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onContractFilterChange("all")} className={contractFilter === "all" ? "bg-accent" : ""}>
            All statuses
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onContractFilterChange("Free Agent")} className={contractFilter === "Free Agent" ? "bg-accent" : ""}>
            Free Agent
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onContractFilterChange("Under Contract")} className={contractFilter === "Under Contract" ? "bg-accent" : ""}>
            Under Contract
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onContractFilterChange("Loan")} className={contractFilter === "Loan" ? "bg-accent" : ""}>
            Loan
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onContractFilterChange("Youth Contract")} className={contractFilter === "Youth Contract" ? "bg-accent" : ""}>
            Youth Contract
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Region</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onRegionFilterChange("all")} className={regionFilter === "all" ? "bg-accent" : ""}>
            All regions
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onRegionFilterChange("Europe")} className={regionFilter === "Europe" ? "bg-accent" : ""}>
            Europe
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onRegionFilterChange("South America")} className={regionFilter === "South America" ? "bg-accent" : ""}>
            South America
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onRegionFilterChange("North America")} className={regionFilter === "North America" ? "bg-accent" : ""}>
            North America
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onRegionFilterChange("Africa")} className={regionFilter === "Africa" ? "bg-accent" : ""}>
            Africa
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onRegionFilterChange("Asia")} className={regionFilter === "Asia" ? "bg-accent" : ""}>
            Asia
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onRegionFilterChange("Oceania")} className={regionFilter === "Oceania" ? "bg-accent" : ""}>
            Oceania
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PlayerSearchFilters;
