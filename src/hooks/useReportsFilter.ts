
import { useMemo } from 'react';
import { ReportWithPlayer } from '@/types/report';
import { useAuth } from '@/contexts/AuthContext';

export const useReportsFilter = (reports: ReportWithPlayer[], activeTab: string) => {
  const { user } = useAuth();
  
  console.log('Filtering reports:', {
    totalReports: reports.length,
    activeTab,
    userId: user?.id,
    reportsByStatus: {
      submitted: reports.filter(r => r.status === 'submitted').length,
      draft: reports.filter(r => r.status === 'draft').length,
    }
  });
  
  const filteredReports = useMemo(() => {
    const filtered = reports.filter(report => {
      console.log(`Checking report ${report.id}:`, {
        status: report.status,
        scoutId: report.scoutId,
        userId: user?.id,
        matches: report.scoutId === user?.id
      });
      
      if (activeTab === "my-reports") {
        // Show submitted reports by the current user
        const shouldShow = report.status === "submitted" && report.scoutId === user?.id;
        console.log(`My-reports filter for ${report.id}:`, shouldShow);
        return shouldShow;
      } else if (activeTab === "my-drafts") {
        // Show draft reports by the current user
        const shouldShow = report.status === "draft" && report.scoutId === user?.id;
        console.log(`My-drafts filter for ${report.id}:`, shouldShow);
        return shouldShow;
      } else {
        // "all-reports" tab - show all reports the user has access to
        return true;
      }
    });
    
    console.log('Filtered reports result:', {
      activeTab,
      filteredCount: filtered.length,
      reports: filtered.map(r => ({ id: r.id, status: r.status, scoutId: r.scoutId }))
    });
    
    return filtered;
  }, [reports, activeTab, user?.id]);

  return filteredReports;
};
