
import { useMemo } from 'react';
import { ReportWithPlayer } from '@/types/report';
import { useAuth } from '@/contexts/AuthContext';

export const useReportsFilter = (reports: ReportWithPlayer[], activeTab: string) => {
  const { user } = useAuth();
  
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      if (activeTab === "my-reports") {
        // Show submitted reports by the current user
        return report.status === "submitted" && report.scoutId === user?.id;
      } else if (activeTab === "my-drafts") {
        // Show draft reports by the current user
        return report.status === "draft" && report.scoutId === user?.id;
      } else {
        // "all-reports" tab - show all reports the user has access to
        return true;
      }
    });
  }, [reports, activeTab, user?.id]);

  return filteredReports;
};
