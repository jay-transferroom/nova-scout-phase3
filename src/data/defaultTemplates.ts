
import { ReportTemplate, DEFAULT_RATING_SYSTEMS } from '@/types/report';

export const DEFAULT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'initial-assessment',
    name: '📄 Initial Assessment Template',
    description: 'Quickly record first impressions from video or data review. Used by analysts, solo scouts, early-stage filters.',
    defaultTemplate: true,
    defaultRatingSystem: DEFAULT_RATING_SYSTEMS['numeric-1-5'],
    sections: [
      {
        id: 'player-info',
        title: 'Player Information',
        fields: [
          {
            id: 'discovery-context',
            label: 'How discovered',
            type: 'dropdown',
            required: true,
            options: ['TransferRoom', 'Wyscout', 'Data shortlist', 'Referral', 'Live scouting', 'Social media', 'Other'],
            description: 'Platform or method used to discover this player'
          }
        ]
      },
      {
        id: 'assessment',
        title: 'Quick Assessment',
        fields: [
          {
            id: 'strengths',
            label: 'Key Strengths',
            type: 'text',
            required: true,
            description: 'What stands out positively about this player?'
          },
          {
            id: 'weaknesses',
            label: 'Potential Concerns',
            type: 'text',
            required: false,
            description: 'Any immediate red flags or areas of concern?'
          },
          {
            id: 'tracking-likelihood',
            label: 'Likelihood to track further',
            type: 'rating',
            required: true,
            ratingSystem: DEFAULT_RATING_SYSTEMS['numeric-1-5'],
            description: 'How likely are we to continue tracking this player?'
          }
        ]
      },
      {
        id: 'next-steps',
        title: 'Next Steps',
        fields: [
          {
            id: 'tags',
            label: 'Tags',
            type: 'text',
            required: false,
            description: 'E.g. "raw potential", "check again in 6 months", "priority target"'
          },
          {
            id: 'follow-up-notes',
            label: 'Follow-up Notes',
            type: 'text',
            required: false,
            description: 'Any specific actions or timeline for next review'
          }
        ]
      }
    ]
  },
  {
    id: 'match-report',
    name: '📊 Match Report Template',
    description: 'Document observations from a full match or live viewing. Used by in-person scouts and video scouts.',
    defaultTemplate: false,
    defaultRatingSystem: DEFAULT_RATING_SYSTEMS['letter'],
    sections: [
      {
        id: 'match-context',
        title: 'Match Context',
        fields: [
          {
            id: 'opposition',
            label: 'Opposition',
            type: 'text',
            required: true,
            description: 'Team played against'
          },
          {
            id: 'competition',
            label: 'Competition',
            type: 'text',
            required: true,
            description: 'League, cup, friendly, etc.'
          },
          {
            id: 'minutes-played',
            label: 'Minutes Played',
            type: 'number',
            required: true,
            description: 'Total minutes on the pitch'
          },
          {
            id: 'position-played',
            label: 'Position Played',
            type: 'text',
            required: true,
            description: 'Primary position during the match'
          },
          {
            id: 'team-result',
            label: 'Team Result',
            type: 'text',
            required: false,
            description: 'Win/Draw/Loss and score'
          }
        ]
      },
      {
        id: 'performance-analysis',
        title: 'Performance Analysis',
        fields: [
          {
            id: 'tactical-fit',
            label: 'Tactical Fit & Role',
            type: 'text',
            required: true,
            description: 'How did the player fit into the team system and execute their role?'
          },
          {
            id: 'physical-attributes',
            label: 'Physical Attributes',
            type: 'rating',
            required: true,
            ratingSystem: DEFAULT_RATING_SYSTEMS['letter'],
            description: 'Pace, strength, agility, stamina, aerial ability'
          },
          {
            id: 'technical-attributes',
            label: 'Technical Attributes',
            type: 'rating',
            required: true,
            ratingSystem: DEFAULT_RATING_SYSTEMS['letter'],
            description: 'Ball control, passing, shooting, dribbling, crossing'
          },
          {
            id: 'tactical-attributes',
            label: 'Tactical Attributes',
            type: 'rating',
            required: true,
            ratingSystem: DEFAULT_RATING_SYSTEMS['letter'],
            description: 'Positioning, decision making, game understanding'
          },
          {
            id: 'psychological-attributes',
            label: 'Psychological Attributes',
            type: 'rating',
            required: true,
            ratingSystem: DEFAULT_RATING_SYSTEMS['letter'],
            description: 'Mentality, composure under pressure, work rate'
          }
        ]
      },
      {
        id: 'character-assessment',
        title: 'Character & Leadership',
        fields: [
          {
            id: 'attitude-notes',
            label: 'Attitude & Leadership',
            type: 'text',
            required: false,
            description: 'How does the player interact with teammates, handle setbacks, show leadership?'
          },
          {
            id: 'coachability',
            label: 'Coachability',
            type: 'text',
            required: false,
            description: 'Response to coaching, adaptability, willingness to learn'
          }
        ]
      },
      {
        id: 'overall-rating',
        title: 'Overall Assessment',
        fields: [
          {
            id: 'match-rating',
            label: 'Final Match Rating',
            type: 'rating',
            required: true,
            ratingSystem: DEFAULT_RATING_SYSTEMS['letter'],
            description: 'Overall performance in this specific match'
          },
          {
            id: 'key-moments',
            label: 'Key Moments',
            type: 'text',
            required: false,
            description: 'Standout moments, good or bad, that defined the performance'
          }
        ]
      }
    ]
  },
  {
    id: 'final-recommendation',
    name: '📝 Final Recommendation Template',
    description: 'Summarise findings and recommend action. Used by Heads of Scouting and collaborative teams after multiple viewings.',
    defaultTemplate: false,
    defaultRatingSystem: DEFAULT_RATING_SYSTEMS['custom-tags'],
    sections: [
      {
        id: 'summary',
        title: 'Summary of Findings',
        fields: [
          {
            id: 'reports-summary',
            label: 'Summary of Key Reports',
            type: 'text',
            required: true,
            description: 'Consolidate findings from 2+ reports or accumulated tracking'
          },
          {
            id: 'strongest-attributes',
            label: 'Strongest Attributes',
            type: 'text',
            required: true,
            description: 'What are this player\'s best qualities across all observations?'
          },
          {
            id: 'development-areas',
            label: 'Areas for Development',
            type: 'text',
            required: true,
            description: 'Key weaknesses or areas that need improvement'
          }
        ]
      },
      {
        id: 'concerns-flags',
        title: 'Concerns & Red Flags',
        fields: [
          {
            id: 'concerns',
            label: 'Concerns or Flags',
            type: 'text',
            required: false,
            description: 'Any significant concerns about attitude, injury history, contract situation, etc.'
          },
          {
            id: 'risk-assessment',
            label: 'Risk Assessment',
            type: 'dropdown',
            required: true,
            options: ['Low Risk', 'Medium Risk', 'High Risk'],
            description: 'Overall risk level for potential recruitment'
          }
        ]
      },
      {
        id: 'recommendation',
        title: 'Final Recommendation',
        fields: [
          {
            id: 'recommended-action',
            label: 'Recommended Action',
            type: 'dropdown',
            required: true,
            options: ['Contact agent immediately', 'Continue monitoring', 'Arrange live viewing', 'Request more data', 'Not suitable', 'Archive - revisit later'],
            description: 'What should be the next step with this player?'
          },
          {
            id: 'priority-level',
            label: 'Priority Level',
            type: 'dropdown',
            required: true,
            options: ['High Priority', 'Medium Priority', 'Low Priority'],
            description: 'How urgent is action on this player?'
          },
          {
            id: 'overall-recommendation',
            label: 'Overall Recommendation',
            type: 'rating',
            required: true,
            ratingSystem: DEFAULT_RATING_SYSTEMS['custom-tags'],
            description: 'Final recommendation rating'
          }
        ]
      },
      {
        id: 'supporting-info',
        title: 'Supporting Information',
        fields: [
          {
            id: 'key-stats',
            label: 'Key Statistics',
            type: 'text',
            required: false,
            description: 'Important performance metrics or data points'
          },
          {
            id: 'market-value',
            label: 'Estimated Market Value',
            type: 'text',
            required: false,
            description: 'Current estimated transfer value or contract situation'
          },
          {
            id: 'additional-notes',
            label: 'Additional Notes',
            type: 'text',
            required: false,
            description: 'Any other relevant information for decision makers'
          }
        ]
      }
    ]
  }
];
