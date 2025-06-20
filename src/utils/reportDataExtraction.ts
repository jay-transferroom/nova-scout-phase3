import { ReportWithPlayer } from "@/types/report";
import { convertRatingToNumeric } from "./ratingConversion";
import { convertNumericRecommendationToText, isRecommendationField, isRatingField } from "./recommendationHelpers";

// Helper function to parse sections from string if needed
const parseSections = (sections: any): any[] => {
  if (typeof sections === 'string') {
    try {
      return JSON.parse(sections);
    } catch (e) {
      console.log('Failed to parse sections string:', e);
      return [];
    }
  }
  
  if (!sections || !Array.isArray(sections)) {
    return [];
  }
  
  return sections;
};

// Get overall rating from a report - improved logic with better data handling
export const getOverallRating = (report: ReportWithPlayer) => {
  console.log(`Extracting rating for player ${report.player?.name}:`, {
    sections: report.sections,
    sectionsType: typeof report.sections,
    sectionsArray: Array.isArray(report.sections),
    rawReport: report
  });
  
  const sections = parseSections(report.sections);
  
  if (sections.length === 0) {
    console.log('No sections or sections not array:', report.sections);
    return null;
  }
  
  // Try to find overall rating in different sections and field names
  for (const section of sections) {
    console.log(`Checking section:`, section);
    
    if (!section.fields || !Array.isArray(section.fields)) {
      console.log('Section has no fields or fields not array:', section.fields);
      continue;
    }
    
    // Look for common rating field names
    for (const field of section.fields) {
      console.log(`Checking field:`, field);
      
      const isRating = isRatingField(field.fieldId);
      
      console.log(`Field ${field.fieldId} is rating field:`, isRating);
      
      if (isRating && field.value !== null && field.value !== undefined && field.value !== "") {
        console.log('Found rating field:', field);
        
        // Handle different rating types
        if (typeof field.value === 'number') {
          console.log('Returning numeric rating:', field.value);
          return field.value;
        }
        
        // Try to parse as number first
        const numericValue = parseFloat(field.value);
        if (!isNaN(numericValue)) {
          console.log('Returning parsed numeric rating:', numericValue);
          return numericValue;
        }
        
        // If it's a letter or other string value, return as is
        console.log('Returning string rating:', field.value);
        return field.value;
      }
    }
  }
  
  console.log('No rating found for player', report.player?.name);
  return null;
};

// Get recommendation from a report - improved logic with better data handling
export const getRecommendation = (report: ReportWithPlayer) => {
  console.log(`Extracting recommendation for player ${report.player?.name}:`, {
    sections: report.sections,
    sectionsType: typeof report.sections,
    sectionsArray: Array.isArray(report.sections)
  });
  
  const sections = parseSections(report.sections);
  
  if (sections.length === 0) {
    console.log('No sections or sections not array for recommendation:', report.sections);
    return null;
  }
  
  // Try to find recommendation in different sections and field names
  for (const section of sections) {
    console.log(`Checking section for recommendation:`, section);
    
    if (!section.fields || !Array.isArray(section.fields)) {
      console.log('Section has no fields or fields not array for recommendation:', section.fields);
      continue;
    }
    
    // Look for common recommendation field names
    for (const field of section.fields) {
      console.log(`Checking recommendation field:`, field);
      
      const isRecommendation = isRecommendationField(field.fieldId);
      
      console.log(`Field ${field.fieldId} is recommendation field:`, isRecommendation);
      
      if (isRecommendation && field.value !== null && field.value !== undefined && field.value !== "") {
        console.log('Found recommendation field:', field);
        
        // If it's already a text recommendation, return it
        if (typeof field.value === 'string' && isNaN(parseFloat(field.value))) {
          console.log('Returning text recommendation:', field.value);
          return field.value;
        }
        
        // If it's a numeric value, try to convert it to meaningful text
        const numericRecommendation = convertNumericRecommendationToText(field.value);
        if (numericRecommendation) {
          console.log('Converted numeric recommendation to text:', numericRecommendation);
          return numericRecommendation;
        }
        
        // Otherwise return the raw value
        console.log('Returning raw recommendation value:', field.value);
        return field.value.toString();
      }
    }
  }

  // If no dedicated recommendation field found, try to derive from overall rating
  console.log('No recommendation field found, trying to derive from overall rating');
  const overallRating = getOverallRating(report);
  if (overallRating !== null && overallRating !== undefined) {
    const derivedRecommendation = convertNumericRecommendationToText(overallRating);
    if (derivedRecommendation) {
      console.log('Derived recommendation from overall rating:', derivedRecommendation);
      return derivedRecommendation;
    }
  }
  
  console.log('No recommendation found for player', report.player?.name);
  return null;
};

// Re-export display function for backward compatibility
export { extractReportDataForDisplay } from "./reportDisplay";
