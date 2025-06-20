
import { convertRatingToNumeric } from "./ratingConversion";

// Helper function to convert numeric recommendation to text
export const convertNumericRecommendationToText = (value: any): string | null => {
  const numericValue = convertRatingToNumeric(value);
  
  if (numericValue !== null) {
    if (numericValue >= 9) return "Priority Sign";
    if (numericValue >= 8) return "Monitor / Track Further";
    if (numericValue >= 7) return "Consider";
    if (numericValue >= 6) return "Keep Watching";
    if (numericValue < 6) return "Pass";
  }
  return null;
};

// Check if a field is a recommendation field
export const isRecommendationField = (fieldId: string): boolean => {
  return fieldId === "recommendation" || 
    fieldId === "overall_recommendation" ||
    fieldId === "verdict" ||
    fieldId === "decision" ||
    fieldId === "outcome" ||
    fieldId?.toLowerCase().includes("recommendation") ||
    fieldId?.toLowerCase().includes("verdict") ||
    fieldId?.toLowerCase().includes("decision") ||
    fieldId?.toLowerCase().includes("outcome");
};

// Check if a field is a rating field
export const isRatingField = (fieldId: string): boolean => {
  return fieldId === "overallRating" || 
    fieldId === "overall_rating" ||
    fieldId === "rating" ||
    fieldId === "overall" ||
    fieldId?.toLowerCase().includes("overall") ||
    fieldId?.toLowerCase().includes("rating") ||
    fieldId?.toLowerCase().includes("score");
};
