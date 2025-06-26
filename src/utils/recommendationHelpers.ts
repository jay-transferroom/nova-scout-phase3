
export const isRatingField = (fieldId: string): boolean => {
  const ratingFields = [
    'overallrating',
    'overall_rating', 
    'rating',
    'overallRating',
    'finalrating',
    'final_rating',
    'finalRating'
  ];
  
  return ratingFields.some(field => 
    fieldId.toLowerCase().includes(field.toLowerCase())
  );
};

export const isRecommendationField = (fieldId: string): boolean => {
  const recommendationFields = [
    'recommendation',
    'final_recommendation',
    'finalrecommendation',
    'finalRecommendation',
    'scout_recommendation',
    'scoutrecommendation',
    'scoutRecommendation',
    'overall_recommendation',
    'overallrecommendation',
    'overallRecommendation'
  ];
  
  console.log(`Checking if ${fieldId} is a recommendation field against:`, recommendationFields);
  
  const isRecommendation = recommendationFields.some(field => 
    fieldId.toLowerCase() === field.toLowerCase()
  );
  
  console.log(`Field ${fieldId} is recommendation field:`, isRecommendation);
  
  return isRecommendation;
};

export const convertNumericRecommendationToText = (value: any): string | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  // If it's already a string and not a number, return it as is
  if (typeof value === 'string' && isNaN(parseFloat(value))) {
    return value;
  }

  const numericValue = typeof value === 'number' ? value : parseFloat(value);
  
  if (isNaN(numericValue)) {
    return value.toString();
  }

  // Convert numeric ratings to recommendation text
  if (numericValue >= 9) {
    return "Sign Immediately";
  } else if (numericValue >= 8) {
    return "Highly Recommend";
  } else if (numericValue >= 7) {
    return "Recommend";
  } else if (numericValue >= 6) {
    return "Consider";
  } else if (numericValue >= 5) {
    return "Monitor";
  } else {
    return "Not Recommended";
  }
};
