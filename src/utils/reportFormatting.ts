
// Helper function to get rating color based on value
export const getRatingColor = (value: any): string => {
  if (typeof value === "number") {
    if (value >= 8) return "text-green-600";
    if (value >= 6) return "text-amber-600";
    return "text-red-600";
  }
  
  if (typeof value === "string") {
    if (["A", "A+", "Priority Sign", "Sign"].includes(value)) return "text-green-600";
    if (["B", "B+", "Consider"].includes(value)) return "text-amber-600";
    return "text-red-600";
  }
  
  return "";
};

export const formatDate = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(dateObj);
};
