
export interface PrivatePlayer {
  id: string;
  created_by_user_id: string;
  name: string;
  club?: string;
  age?: number;
  date_of_birth?: string;
  positions?: string[];
  nationality?: string;
  dominant_foot?: 'Left' | 'Right' | 'Both';
  region?: string;
  notes?: string;
  source_context?: string;
  visibility: 'private' | 'organization';
  created_at: string;
  updated_at: string;
}

export interface CreatePrivatePlayerData {
  name: string;
  club?: string;
  age?: number;
  date_of_birth?: string;
  positions?: string[];
  nationality?: string;
  dominant_foot?: 'Left' | 'Right' | 'Both';
  region?: string;
  notes?: string;
  source_context?: string;
  visibility?: 'private' | 'organization';
}
