
import { ReportWithPlayer } from "@/types/report";

// Get overall rating from a report - improved logic with better data handling
export const getOverallRating = (report: ReportWithPlayer) => {
  console.log(`Extracting rating for player ${report.player?.name}:`, {
    sections: report.sections,
    sectionsType: typeof report.sections,
    sectionsArray: Array.isArray(report.sections),
    rawReport: report
  });
  
  // Handle case where sections might be a string (JSON)
  let sections = report.sections;
  if (typeof sections === 'string') {
    try {
      sections = JSON.parse(sections);
      console.log('Parsed sections from string:', sections);
    } catch (e) {
      console.log('Failed to parse sections string:', e);
      return null;
    }
  }
  
  if (!sections || !Array.isArray(sections)) {
    console.log('No sections or sections not array:', sections);
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
      
      const isRatingField = 
        field.fieldId === "overallRating" || 
        field.fieldId === "overall_rating" ||
        field.fieldId === "rating" ||
        field.fieldId === "overall" ||
        field.fieldId?.toLowerCase().includes("overall") ||
        field.fieldId?.toLowerCase().includes("rating") ||
        field.fieldId?.toLowerCase().includes("score");
      
      console.log(`Field ${field.fieldId} is rating field:`, isRatingField);
      
      if (isRatingField && field.value !== null && field.value !== undefined && field.value !== "") {
        console.log('Found rating field:', field);
        const numericValue = typeof field.value === 'number' ? field.value : parseFloat(field.value);
        if (!isNaN(numericValue)) {
          console.log('Returning numeric rating:', numericValue);
          return numericValue;
        }
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
  
  // Handle case where sections might be a string (JSON)
  let sections = report.sections;
  if (typeof sections === 'string') {
    try {
      sections = JSON.parse(sections);
      console.log('Parsed sections from string for recommendation:', sections);
    } catch (e) {
      console.log('Failed to parse sections string for recommendation:', e);
      return null;
    }
  }
  
  if (!sections || !Array.isArray(sections)) {
    console.log('No sections or sections not array for recommendation:', sections);
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
      
      const isRecommendationField = 
        field.fieldId === "recommendation" || 
        field.fieldId === "overall_recommendation" ||
        field.fieldId === "verdict" ||
        field.fieldId === "decision" ||
        field.fieldId === "outcome" ||
        field.fieldId?.toLowerCase().includes("recommendation") ||
        field.fieldId?.toLowerCase().includes("verdict") ||
        field.fieldId?.toLowerCase().includes("decision") ||
        field.fieldId?.toLowerCase().includes("outcome");
      
      console.log(`Field ${field.fieldId} is recommendation field:`, isRecommendationField);
      
      if (isRecommendationField && field.value && field.value !== "") {
        console.log('Found recommendation field:', field);
        return field.value;
      }
    }
  }
  
  console.log('No recommendation found for player', report.player?.name);
  return null;
};
