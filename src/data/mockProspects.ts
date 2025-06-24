
export const mockProspects = {
  'Centre Back': [
    {
      id: '1',
      name: 'Dahoud Malacia',
      club: 'AS Monaco',
      age: 24,
      xTV: 45.2,
      rating: 89.1,
      strengths: ['Aerial ability', 'Passing range', 'Leadership'],
      recommendation: 'Highly recommended',
      matchPercentage: 90,
      transferValue: '£35M',
      nationality: 'Netherlands'
    }
  ],
  'Central Midfield': [
    {
      id: '2',
      name: 'Marco Silva',
      club: 'FC Porto',
      age: 22,
      xTV: 38.7,
      rating: 82.3,
      strengths: ['Vision', 'Work rate', 'Set pieces'],
      recommendation: 'Good potential',
      matchPercentage: 85,
      transferValue: '£28M',
      nationality: 'Portugal'
    }
  ],
  'Full Back': [
    {
      id: '3',
      name: 'Carlos Mendoza',
      club: 'Valencia CF',
      age: 21,
      xTV: 25.8,
      rating: 78.9,
      strengths: ['Pace', 'Crossing', 'Defensive work rate'],
      recommendation: 'Promising prospect',
      matchPercentage: 82,
      transferValue: '£18M',
      nationality: 'Spain'
    }
  ]
};

export interface Prospect {
  id: string;
  name: string;
  club: string;
  age: number;
  xTV: number;
  rating: number;
  strengths: string[];
  recommendation: string;
  matchPercentage: number;
  transferValue: string;
  nationality: string;
}
