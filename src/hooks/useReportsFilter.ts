
import { useMemo } from 'react';
import { ReportWithPlayer } from '@/types/report';
import { useAuth } from '@/contexts/AuthContext';
import { ReportsFilterCriteria } from '@/components/reports/ReportsFilters';
import { getRecommendation } from '@/utils/reportDataExtraction';

export const useReportsFilter = (reports: ReportWithPlayer[], activeTab: string, searchFilters?: ReportsFilterCriteria) => {
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
    let filtered = reports.filter(report => {
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
          // Recruitment managers can see all reports (both submitted and draft)
          const shouldShow = true;
          console.log(`All-reports filter for manager ${report.id}:`, shouldShow);
          return shouldShow;
        }
      }
    });

    // Apply additional search filters if provided
    if (searchFilters) {
      filtered = filtered.filter(report => {
        // Search term filter (searches in player ID, scout name, report content)
        if (searchFilters.searchTerm && searchFilters.searchTerm.trim() !== '') {
          const searchTerm = searchFilters.searchTerm.toLowerCase();
          const playerId = report.playerId?.toLowerCase() || '';
          const scoutName = `${report.scoutProfile?.first_name || ''} ${report.scoutProfile?.last_name || ''}`.toLowerCase();
          
          // Search through report sections content
          const sectionContent = JSON.stringify(report.sections).toLowerCase();
          
          if (!playerId.includes(searchTerm) && 
              !scoutName.includes(searchTerm) &&
              !sectionContent.includes(searchTerm)) {
            return false;
          }
        }

        // Player name filter
        if (searchFilters.playerName && searchFilters.playerName.trim() !== '') {
          const playerName = report.player?.name?.toLowerCase() || '';
          if (!playerName.includes(searchFilters.playerName.toLowerCase())) {
            return false;
          }
        }

        // Club filter
        if (searchFilters.club && searchFilters.club.trim() !== '') {
          const playerClub = report.player?.club?.toLowerCase() || '';
          if (!playerClub.includes(searchFilters.club.toLowerCase())) {
            return false;
          }
        }

        // Positions filter
        if (searchFilters.positions && searchFilters.positions.trim() !== '') {
          const playerPositions = report.player?.positions?.join(' ').toLowerCase() || '';
          if (!playerPositions.includes(searchFilters.positions.toLowerCase())) {
            return false;
          }
        }

        // Verdict filter
        if (searchFilters.verdict && searchFilters.verdict.trim() !== '') {
          const reportVerdict = getRecommendation(report);
          if (reportVerdict !== searchFilters.verdict) {
            return false;
          }
        }

        // Status filter
        if (searchFilters.status && searchFilters.status.trim() !== '') {
          if (report.status !== searchFilters.status) {
            return false;
          }
        }

        // Scout filter
        if (searchFilters.scout && searchFilters.scout.trim() !== '') {
          if (report.scoutId !== searchFilters.scout) {
            return false;
          }
        }

        // Date range filter
        if (searchFilters.dateRange && searchFilters.dateRange.trim() !== '') {
          const reportDate = new Date(report.createdAt);
          const now = new Date();
          
          switch (searchFilters.dateRange) {
            case 'today':
              if (reportDate.toDateString() !== now.toDateString()) {
                return false;
              }
              break;
            case 'week':
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              if (reportDate < weekAgo) {
                return false;
              }
              break;
            case 'month':
              const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
              if (reportDate < monthAgo) {
                return false;
              }
              break;
            case 'quarter':
              const quarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
              if (reportDate < quarterAgo) {
                return false;
              }
              break;
          }
        }

        return true;
      });
    }
    
    console.log('Filtered reports result:', {
      activeTab,
      userRole: profile?.role,
      filteredCount: filtered.length,
      searchFilters,
      reports: filtered.map(r => ({ id: r.id, status: r.status, scoutId: r.scoutId }))
    });
    
    return filtered;
  }, [reports, activeTab, user?.id, profile?.role, searchFilters]);

  return filteredReports;
};
