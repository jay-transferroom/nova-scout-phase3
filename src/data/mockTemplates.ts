
import { ReportTemplate } from "@/types/report";

export const mockTemplates: ReportTemplate[] = [
  {
    id: "t1",
    name: "Standard Scouting Report",
    description: "Complete assessment for professional players",
    defaultTemplate: true,
    sections: [
      {
        id: "technical",
        title: "Technical Attributes",
        fields: [
          {
            id: "firstTouch",
            label: "First Touch",
            type: "rating",
            required: true,
            ratingSystem: {
              type: "numeric-1-10",
              values: Array.from({ length: 10 }, (_, i) => ({
                value: i + 1,
                label: `${i + 1}`,
              })),
            },
          },
          {
            id: "passing",
            label: "Passing",
            type: "rating",
            required: true,
            ratingSystem: {
              type: "numeric-1-10",
              values: Array.from({ length: 10 }, (_, i) => ({
                value: i + 1,
                label: `${i + 1}`,
              })),
            },
          },
          {
            id: "shooting",
            label: "Shooting",
            type: "rating",
            required: true,
            ratingSystem: {
              type: "numeric-1-10",
              values: Array.from({ length: 10 }, (_, i) => ({
                value: i + 1,
                label: `${i + 1}`,
              })),
            },
          },
          {
            id: "technicalNotes",
            label: "Technical Notes",
            type: "text",
            required: false,
          },
        ],
      },
      {
        id: "tactical",
        title: "Tactical Intelligence",
        fields: [
          {
            id: "positioning",
            label: "Positioning",
            type: "rating",
            required: true,
            ratingSystem: {
              type: "numeric-1-10",
              values: Array.from({ length: 10 }, (_, i) => ({
                value: i + 1,
                label: `${i + 1}`,
              })),
            },
          },
          {
            id: "decisionMaking",
            label: "Decision Making",
            type: "rating",
            required: true,
            ratingSystem: {
              type: "numeric-1-10",
              values: Array.from({ length: 10 }, (_, i) => ({
                value: i + 1,
                label: `${i + 1}`,
              })),
            },
          },
          {
            id: "awareness",
            label: "Awareness",
            type: "rating",
            required: true,
            ratingSystem: {
              type: "numeric-1-10",
              values: Array.from({ length: 10 }, (_, i) => ({
                value: i + 1,
                label: `${i + 1}`,
              })),
            },
          },
          {
            id: "tacticalNotes",
            label: "Tactical Notes",
            type: "text",
            required: false,
          },
        ],
      },
      {
        id: "physical",
        title: "Physical Attributes",
        fields: [
          {
            id: "acceleration",
            label: "Acceleration",
            type: "rating",
            required: true,
            ratingSystem: {
              type: "numeric-1-10",
              values: Array.from({ length: 10 }, (_, i) => ({
                value: i + 1,
                label: `${i + 1}`,
              })),
            },
          },
          {
            id: "strength",
            label: "Strength",
            type: "rating",
            required: true,
            ratingSystem: {
              type: "numeric-1-10",
              values: Array.from({ length: 10 }, (_, i) => ({
                value: i + 1,
                label: `${i + 1}`,
              })),
            },
          },
          {
            id: "stamina",
            label: "Stamina",
            type: "rating",
            required: true,
            ratingSystem: {
              type: "numeric-1-10",
              values: Array.from({ length: 10 }, (_, i) => ({
                value: i + 1,
                label: `${i + 1}`,
              })),
            },
          },
          {
            id: "physicalNotes",
            label: "Physical Notes",
            type: "text",
            required: false,
          },
        ],
      },
      {
        id: "summary",
        title: "Summary & Recommendation",
        fields: [
          {
            id: "bestPosition",
            label: "Best Position",
            type: "dropdown",
            required: true,
            options: ["GK", "CB", "LB", "RB", "CDM", "CM", "CAM", "LW", "RW", "ST"],
          },
          {
            id: "potentialRole",
            label: "Potential Role",
            type: "dropdown",
            required: true,
            options: ["Starter", "Squad Player", "Prospect", "Not Suitable"],
          },
          {
            id: "recommendation",
            label: "Recommendation",
            type: "dropdown",
            required: true,
            options: ["Sign", "Monitor", "Not Suitable"],
          },
          {
            id: "summaryNotes",
            label: "Additional Notes",
            type: "text",
            required: false,
          },
        ],
      },
    ],
  },
  {
    id: "t2",
    name: "Youth Prospect Report",
    description: "Focused assessment for youth players (U21)",
    sections: [
      {
        id: "potential",
        title: "Development Potential",
        fields: [
          {
            id: "technicalPotential",
            label: "Technical Potential",
            type: "rating",
            required: true,
            ratingSystem: {
              type: "letter",
              values: [
                { value: "A", label: "Elite", color: "#22C55E" },
                { value: "B", label: "Very Good", color: "#84CC16" },
                { value: "C", label: "Average", color: "#EAB308" },
                { value: "D", label: "Below Average", color: "#F97316" },
                { value: "E", label: "Poor", color: "#EF4444" },
              ],
            },
          },
          {
            id: "tacticalPotential",
            label: "Tactical Potential",
            type: "rating",
            required: true,
            ratingSystem: {
              type: "letter",
              values: [
                { value: "A", label: "Elite", color: "#22C55E" },
                { value: "B", label: "Very Good", color: "#84CC16" },
                { value: "C", label: "Average", color: "#EAB308" },
                { value: "D", label: "Below Average", color: "#F97316" },
                { value: "E", label: "Poor", color: "#EF4444" },
              ],
            },
          },
          {
            id: "physicalPotential",
            label: "Physical Potential",
            type: "rating",
            required: true,
            ratingSystem: {
              type: "letter",
              values: [
                { value: "A", label: "Elite", color: "#22C55E" },
                { value: "B", label: "Very Good", color: "#84CC16" },
                { value: "C", label: "Average", color: "#EAB308" },
                { value: "D", label: "Below Average", color: "#F97316" },
                { value: "E", label: "Poor", color: "#EF4444" },
              ],
            },
          },
          {
            id: "developmentPlan",
            label: "Development Plan",
            type: "text",
            required: true,
          },
        ],
      },
    ],
  },
];
