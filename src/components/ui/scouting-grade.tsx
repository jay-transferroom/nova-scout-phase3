import * as React from "react"
import { cn } from "@/lib/utils"

interface ScoutingGradeProps {
  grade: string | number | null;
  className?: string;
}

const ScoutingGrade = ({ grade, className }: ScoutingGradeProps) => {
  if (!grade) return <span className="text-grey-400 text-sm">-</span>;

  const gradeStr = grade.toString().toUpperCase();
  
  // Determine dot color based on grade
  const getDotColor = (gradeValue: string) => {
    if (gradeValue.startsWith('A')) {
      return 'bg-success-500'; // Green for A grades
    } else if (gradeValue.startsWith('B')) {
      return 'bg-warning-500'; // Orange for B grades  
    } else if (gradeValue.startsWith('C')) {
      return 'bg-error-500'; // Red for C grades
    } else {
      // For numeric grades (1-10 scale)
      const numericGrade = parseFloat(gradeValue);
      if (!isNaN(numericGrade)) {
        if (numericGrade >= 8) return 'bg-success-500'; // Green for 8-10
        if (numericGrade >= 6) return 'bg-warning-500'; // Orange for 6-7
        return 'bg-error-500'; // Red for below 6
      }
      return 'bg-grey-400'; // Default grey
    }
  };

  const dotColor = getDotColor(gradeStr);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("w-2 h-2 rounded-full", dotColor)} />
      <span className="text-sm font-medium text-grey-900">{gradeStr}</span>
    </div>
  );
};

export { ScoutingGrade }