
import { VERDICT_OPTIONS } from "@/types/verdict";

// Field names that represent recommendation/verdict fields
const RECOMMENDATION_FIELD_NAMES = [
  'recommendation',
  'verdict', 
  'overall_recommendation',
  'final_recommendation',
  'scout_recommendation',
  'decision',
  'conclusion'
];

// Field names that represent rating fields
const RATING_FIELD_NAMES = [
  'overall_rating',
  'rating',
  'overall_score',
  'score',
  'total_rating',
  'final_rating',
  'composite_rating'
];

export const isRecommendationField = (fieldId: string): boolean => {
  return RECOMMENDATION_FIELD_NAMES.some(name => 
    fieldId.toLowerCase().includes(name.toLowerCase())
  );
};

export const isRatingField = (fieldId: string): boolean => {
  return RATING_FIELD_NAMES.some(name => 
    fieldId.toLowerCase().includes(name.toLowerCase())
  );
};

// Convert numeric recommendation values to text verdicts
export const convertNumericRecommendationToText = (value: any): string | null => {
  if (value === null || value === undefined || value === "") return null;
  
  // If it's already a text verdict from our options, return it
  if (typeof value === 'string' && VERDICT_OPTIONS.some(option => option.value === value)) {
    return value;
  }
  
  // If it's already a readable text verdict, return it
  if (typeof value === 'string' && VERDICT_OPTIONS.some(option => option.label === value)) {
    return value;
  }
  
  // Try to convert numeric or other values to verdict options
  const numValue = parseFloat(value);
  if (!isNaN(numValue)) {
    // Map numeric ratings to verdicts (adjust thresholds as needed)
    if (numValue >= 8) return 'recommend-signing';
    if (numValue >= 7) return 'add-to-shortlist';
    if (numValue >= 5) return 'monitor';
    if (numValue >= 3) return 'further-scouting';
    if (numValue >= 2) return 'with-reservations';
    return 'not-recommended';
  }
  
  // For other string values, try to map them to our verdict system
  const stringValue = value.toString().toLowerCase();
  
  if (stringValue.includes('sign') || stringValue.includes('proceed') || stringValue.includes('recommend')) {
    return 'recommend-signing';
  }
  if (stringValue.includes('shortlist') || stringValue.includes('track')) {
    return 'add-to-shortlist';
  }
  if (stringValue.includes('monitor') || stringValue.includes('watch')) {
    return 'monitor';
  }
  if (stringValue.includes('further') || stringValue.includes('more')) {
    return 'further-scouting';
  }
  if (stringValue.includes('concern') || stringValue.includes('reservation')) {
    return 'with-reservations';
  }
  if (stringValue.includes('not') || stringValue.includes('reject') || stringValue.includes('pass')) {
    return 'not-recommended';
  }
  
  return null;
};

// Updated standard scout verdicts
export const STANDARD_SCOUT_VERDICTS = VERDICT_OPTIONS.map(option => option.label);
