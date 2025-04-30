
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: ReportSection[];
  defaultTemplate?: boolean;
}

export interface ReportSection {
  id: string;
  title: string;
  fields: ReportField[];
  optional?: boolean;
}

export type ReportFieldType = 'rating' | 'text' | 'dropdown' | 'checkbox' | 'number';

export interface ReportField {
  id: string;
  label: string;
  type: ReportFieldType;
  required?: boolean;
  options?: string[] | number[];
  ratingSystem?: RatingSystem;
  description?: string;
}

export type RatingSystemType = 'numeric-1-5' | 'numeric-1-10' | 'letter' | 'custom-tags' | 'percentage';

export interface RatingSystem {
  type: RatingSystemType;
  values: Array<{
    value: string | number;
    label?: string;
    color?: string;
    description?: string;
  }>;
}

export interface Report {
  id: string;
  playerId: string;
  templateId: string;
  scoutId: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'submitted' | 'reviewed';
  sections: ReportSectionData[];
  matchContext?: {
    date: string;
    opposition: string;
    competition: string;
    minutesPlayed: number;
    conditions?: string;
    roleContext?: string;
  };
  tags?: string[];
  flaggedForReview?: boolean;
}

export interface ReportSectionData {
  sectionId: string;
  fields: {
    fieldId: string;
    value: any;
    notes?: string;
  }[];
}
