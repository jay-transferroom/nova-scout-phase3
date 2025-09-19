
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award } from "lucide-react";

const ReportsTableHeader = () => {
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent">
        <TableHead>Player</TableHead>
        <TableHead>Club</TableHead>
        <TableHead>Positions</TableHead>
        <TableHead>Report Date</TableHead>
        <TableHead className="w-[100px]">Status</TableHead>
        <TableHead>
          <div className="flex items-center gap-1">
            <Award size={14} />
            <span>Rating</span>
          </div>
        </TableHead>
        <TableHead>Verdict</TableHead>
        <TableHead>Scout</TableHead>
        <TableHead className="w-[250px] text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default ReportsTableHeader;
