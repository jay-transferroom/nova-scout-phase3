import { ReportWithPlayer } from "@/types/report";

// Helper function to convert numeric recommendation to text
const convertNumericRecommendationToText = (value: any): string | null => {
  if (typeof value === 'number') {
    if (value >= 9) return "Priority Sign";
    if (value >= 8) return "Monitor / Track Further";
    if (value >= 7) return "Consider";
    if (value >= 6) return "Keep Watching";
    if (value < 6) return "Pass";
  }
  return null;
};

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
      
      if (isRecommendationField && field.value !== null && field.value !== undefined && field.value !== "") {
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

// Extract report data for display
export const extractReportDataForDisplay = (report: ReportWithPlayer, template: any) => {
  let sections = report.sections;
  if (typeof sections === 'string') {
    try {
      sections = JSON.parse(sections);
    } catch (e) {
      console.error('Failed to parse sections:', e);
      return [];
    }
  }

  if (!sections || !Array.isArray(sections)) {
    return [];
  }

  return sections.map((section) => {
    const templateSection = template?.sections?.find((ts: any) => ts.id === section.sectionId);
    
    return {
      sectionId: section.sectionId,
      title: templateSection?.title || section.sectionId.charAt(0).toUpperCase() + section.sectionId.slice(1),
      fields: section.fields.map((field) => {
        const templateField = templateSection?.fields?.find((tf: any) => tf.id === field.fieldId);
        
        let displayValue = field.value;
        if (field.value !== null && field.value !== undefined && field.value !== "") {
          if (templateField?.type === 'rating' && typeof field.value === 'number') {
            displayValue = `${field.value}/10`;
          } else {
            displayValue = field.value.toString();
          }
        }

        return {
          fieldId: field.fieldId,
          label: templateField?.label || field.fieldId.charAt(0).toUpperCase() + field.fieldId.slice(1),
          value: field.value,
          displayValue,
          notes: field.notes
        };
      })
    };
  });
};
