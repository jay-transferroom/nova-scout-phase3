
import { useMemo } from 'react';
import { ReportWithPlayer } from '@/types/report';
import { useAuth } from '@/contexts/AuthContext';

export const useReportsFilter = (reports: ReportWithPlayer[], activeTab: string) => {
  const { user, profile } = useAuth();
  
  console.log('Filtering reports:', {
    totalReports: reports.length,
    activeTab,
    userId: user?.id,
    userRole: profile?.role,
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
        // For managers/directors (non-scouts), show all submitted reports. Scouts see their own submitted reports.
        const isManager = profile?.role !== 'scout';
        const shouldShow = isManager
          ? report.status === "submitted"
          : report.status === "submitted" && report.scoutId === user?.id;
        console.log(`My-reports filter for ${report.id}:`, { shouldShow, isManager, role: profile?.role });
        return shouldShow;
      } else if (activeTab === "my-drafts") {
        // Show draft reports by the current user
        const shouldShow = report.status === "draft" && report.scoutId === user?.id;
        console.log(`My-drafts filter for ${report.id}:`, shouldShow);
        return shouldShow;
      } else {
        // "all-reports" tab behavior depends on user role
        if (profile?.role === 'scout') {
          // Scouts can only see their own reports (both submitted and draft)
          const shouldShow = report.scoutId === user?.id;
          console.log(`All-reports filter for scout ${report.id}:`, shouldShow);
          return shouldShow;
        } else {
          // Recruitment managers can see all submitted reports
          const shouldShow = report.status === "submitted";
          console.log(`All-reports filter for manager ${report.id}:`, shouldShow);
          return shouldShow;
        }
      }
    });
    
    console.log('Filtered reports result:', {
      activeTab,
      userRole: profile?.role,
      filteredCount: filtered.length,
      reports: filtered.map(r => ({ id: r.id, status: r.status, scoutId: r.scoutId }))
    });
    
    return filtered;
  }, [reports, activeTab, user?.id, profile?.role]);

  return filteredReports;
};
