
// Extract report data for display
export const extractReportDataForDisplay = (report: any, template: any) => {
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

  return sections.map((section: any) => {
    const templateSection = template?.sections?.find((ts: any) => ts.id === section.sectionId);
    
    return {
      sectionId: section.sectionId,
      title: templateSection?.title || section.sectionId.charAt(0).toUpperCase() + section.sectionId.slice(1),
      fields: section.fields.map((field: any) => {
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
