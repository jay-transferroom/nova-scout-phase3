
// Helper function to convert various rating types to numeric for recommendation logic
export const convertRatingToNumeric = (value: any): number | null => {
  if (typeof value === 'number') {
    return value;
  }
  
  if (typeof value === 'string') {
    // Handle letter grades
    const letterGrade = value.trim().toUpperCase();
    switch (letterGrade) {
      case 'A': return 9;
      case 'B': return 7.5;
      case 'C': return 6;
      case 'D': return 4;
      case 'E': return 2;
      default:
        // Try to parse as number
        const numericValue = parseFloat(value);
        return !isNaN(numericValue) ? numericValue : null;
    }
  }
  
  return null;
};
