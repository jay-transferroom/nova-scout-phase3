
import { ReportWithPlayer } from "@/types/report";

// Get overall rating from a report - improved logic
export const getOverallRating = (report: ReportWithPlayer) => {
  console.log(`Extracting rating for player ${report.player?.name}:`, report.sections);
  
  if (!report.sections || !Array.isArray(report.sections)) {
    console.log('No sections or sections not array');
    return null;
  }
  
  // Try to find overall rating in different sections and field names
  for (const section of report.sections) {
    console.log(`Checking section:`, section);
    
    if (!section.fields || !Array.isArray(section.fields)) {
      console.log('Section has no fields or fields not array');
      continue;
    }
    
    // Look for common rating field names - only check fieldId since label doesn't exist on data
    for (const field of section.fields) {
      console.log(`Checking field:`, field);
      
      const isRatingField = 
        field.fieldId === "overallRating" || 
        field.fieldId === "overall_rating" ||
        field.fieldId === "rating" ||
        field.fieldId === "overall" ||
        field.fieldId.toLowerCase().includes("overall") ||
        field.fieldId.toLowerCase().includes("rating") ||
        field.fieldId.toLowerCase().includes("score");
      
      if (isRatingField && field.value !== null && field.value !== undefined && field.value !== "") {
        console.log('Found rating field:', field);
        const numericValue = typeof field.value === 'number' ? field.value : parseFloat(field.value);
        if (!isNaN(numericValue)) {
          return numericValue;
        }
      }
    }
  }
  
  console.log('No rating found');
  return null;
};

// Get recommendation from a report - improved logic
export const getRecommendation = (report: ReportWithPlayer) => {
  console.log(`Extracting recommendation for player ${report.player?.name}:`, report.sections);
  
  if (!report.sections || !Array.isArray(report.sections)) {
    console.log('No sections or sections not array');
    return null;
  }
  
  // Try to find recommendation in different sections and field names
  for (const section of report.sections) {
    console.log(`Checking section for recommendation:`, section);
    
    if (!section.fields || !Array.isArray(section.fields)) {
      console.log('Section has no fields or fields not array');
      continue;
    }
    
    // Look for common recommendation field names - only check fieldId since label doesn't exist on data
    for (const field of section.fields) {
      console.log(`Checking recommendation field:`, field);
      
      const isRecommendationField = 
        field.fieldId === "recommendation" || 
        field.fieldId === "overall_recommendation" ||
        field.fieldId === "verdict" ||
        field.fieldId === "decision" ||
        field.fieldId === "outcome" ||
        field.fieldId.toLowerCase().includes("recommendation") ||
        field.fieldId.toLowerCase().includes("verdict") ||
        field.fieldId.toLowerCase().includes("decision") ||
        field.fieldId.toLowerCase().includes("outcome");
      
      if (isRecommendationField && field.value && field.value !== "") {
        console.log('Found recommendation field:', field);
        return field.value;
      }
    }
  }
  
  console.log('No recommendation found');
  return null;
};
