
import { useMemo } from 'react';
import { ReportWithPlayer } from '@/types/report';

export const useReportsFilter = (reports: ReportWithPlayer[], activeTab: string) => {
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      if (activeTab === "my-reports") {
        return report.status === "submitted";
      } else if (activeTab === "my-drafts") {
        return report.status === "draft";
      } else {
        return true; // "all-reports" tab
      }
    });
  }, [reports, activeTab]);

  return filteredReports;
};
