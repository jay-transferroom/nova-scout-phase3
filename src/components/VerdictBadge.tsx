
import { Badge } from "@/components/ui/badge";
import { getVerdictOption } from "@/types/verdict";

interface VerdictBadgeProps {
  verdict: string | null;
  className?: string;
}

const VerdictBadge = ({ verdict, className = "" }: VerdictBadgeProps) => {
  if (!verdict) return null;
  
  const option = getVerdictOption(verdict);
  if (!option) return <Badge variant="outline">{verdict}</Badge>;

  return (
    <Badge 
      variant="outline" 
      className={`${option.color} ${className} font-normal`}
    >
      {option.label}
    </Badge>
  );
};

export default VerdictBadge;
