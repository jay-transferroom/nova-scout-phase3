
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, Filter } from "lucide-react";

interface ShortlistFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: () => void;
  euGbeFilter: string;
  onEuGbeFilterChange: (value: string) => void;
}

export const ShortlistFilters = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  euGbeFilter,
  onEuGbeFilterChange
}: ShortlistFiltersProps) => {
  return (
    <>
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Sorting and Filtering Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" />
          <span className="text-sm font-medium">Sort by:</span>
          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="age">Age</SelectItem>
              <SelectItem value="xtv">xTV Score</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="potential">Potential</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={onSortOrderChange}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">EU/GBE:</span>
          <Select value={euGbeFilter} onValueChange={onEuGbeFilterChange}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pass">Pass</SelectItem>
              <SelectItem value="fail">Fail</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};
