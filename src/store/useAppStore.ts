import { create } from 'zustand';
import {
  UserProfile,
  CampusResource,
  AssistanceRequest,
  ResourceReport,
  Announcement,
  AppNotification,
  UserRole,
  ResourceType,
  ResourceStatus,
  RequestStatus,
  ReportStatus,
  RequestCategory,
  IssueCategory,
} from '../types';
import { StorageService } from '../services/storage';

interface AppState {
  currentUser: UserProfile;
  resources: CampusResource[];
  requests: AssistanceRequest[];
  reports: ResourceReport[];
  announcements: Announcement[];
  notifications: AppNotification[];
  recentResourceIds: string[];
  selectedResourceId: string | null;
  searchQuery: string;
  activeFilterCategory: ResourceType | 'all';
  activeFilterStatus: ResourceStatus | 'all';
  activeZone: 'all' | 'North' | 'South' | 'Central' | 'East' | 'West';

  // Actions
  switchUserRole: (role: UserRole) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  setSelectedResourceId: (id: string | null) => void;
  recordViewedResource: (id: string) => void;
  setSearchQuery: (q: string) => void;
  setActiveFilterCategory: (cat: ResourceType | 'all') => void;
  setActiveFilterStatus: (status: ResourceStatus | 'all') => void;
  setActiveZone: (zone: 'all' | 'North' | 'South' | 'Central' | 'East' | 'West') => void;

  // Requests
  createAssistanceRequest: (data: {
    request_category: RequestCategory;
    description: string;
    campus_location: string;
    building: string;
    floor?: string;
    contact_preference: 'phone' | 'email' | 'in_person';
    contact_number?: string;
    share_location_consent: boolean;
  }) => string;
  updateRequestStatus: (
    requestId: string,
    newStatus: RequestStatus,
    note?: string
  ) => void;
  assignRequestStaff: (
    requestId: string,
    staffId: string,
    staffName: string
  ) => void;

  // Reports
  createResourceReport: (data: {
    resource_id: string;
    resource_name: string;
    issue_category: IssueCategory;
    description: string;
    location: string;
    image_url?: string;
  }) => string;
  updateReportStatus: (
    reportId: string,
    newStatus: ReportStatus,
    resolutionNotes?: string
  ) => void;

  // Resources
  updateResource: (resourceId: string, updates: Partial<CampusResource>) => void;
  verifyResource: (resourceId: string, verifierName: string) => void;
  addResource: (resource: Omit<CampusResource, 'id' | 'created_at' | 'updated_at'>) => void;

  // Notifications
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'created_at' | 'read_at'>) => void;

  // Reset
  resetDemoData: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: StorageService.getCurrentUser(),
  resources: StorageService.getResources(),
  requests: StorageService.getRequests(),
  reports: StorageService.getReports(),
  announcements: StorageService.getAnnouncements(),
  notifications: StorageService.getNotifications(),
  recentResourceIds: StorageService.getRecentResourceIds(),
  selectedResourceId: null,
  searchQuery: '',
  activeFilterCategory: 'all',
  activeFilterStatus: 'all',
  activeZone: 'all',

  switchUserRole: (role: UserRole) => {
    const user = StorageService.switchRole(role);
    set({ currentUser: user });
  },

  updateUserProfile: (profile: Partial<UserProfile>) => {
    const current = get().currentUser;
    const updated = { ...current, ...profile };
    StorageService.setCurrentUser(updated);
    set({ currentUser: updated });
  },

  setSelectedResourceId: (id: string | null) => {
    set({ selectedResourceId: id });
    if (id) {
      get().recordViewedResource(id);
    }
  },

  recordViewedResource: (id: string) => {
    StorageService.addRecentResourceId(id);
    set({ recentResourceIds: StorageService.getRecentResourceIds() });
  },

  setSearchQuery: (searchQuery: string) => set({ searchQuery }),
  setActiveFilterCategory: (activeFilterCategory) => set({ activeFilterCategory }),
  setActiveFilterStatus: (activeFilterStatus) => set({ activeFilterStatus }),
  setActiveZone: (activeZone) => set({ activeZone }),

  createAssistanceRequest: (data) => {
    const current = get();
    const reqId = `req_${Math.floor(1000 + Math.random() * 9000)}`;
    const newRequest: AssistanceRequest = {
      id: reqId,
      user_id: current.currentUser.id,
      user_name: current.currentUser.full_name,
      user_email: current.currentUser.email,
      ...data,
      status: 'submitted',
      updates: [
        {
          id: `upd_${Date.now()}`,
          request_id: reqId,
          updated_by: current.currentUser.full_name,
          previous_status: 'submitted',
          new_status: 'submitted',
          note: 'Assistance request logged by user.',
          created_at: new Date().toISOString(),
        },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updatedRequests = [newRequest, ...current.requests];
    StorageService.setRequests(updatedRequests);

    // Create user notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      user_id: current.currentUser.id,
      title: 'Assistance Request Logged',
      message: `Your request #${reqId.toUpperCase()} has been submitted. Note: Submitting this form does not guarantee immediate assistance. For life-threatening emergencies, call emergency services directly.`,
      type: 'request',
      read_at: null,
      link: '/requests',
      created_at: new Date().toISOString(),
    };
    const updatedNotifs = [newNotif, ...current.notifications];
    StorageService.setNotifications(updatedNotifs);

    set({
      requests: updatedRequests,
      notifications: updatedNotifs,
    });

    return reqId;
  },

  updateRequestStatus: (requestId, newStatus, note) => {
    const current = get();
    const target = current.requests.find((r) => r.id === requestId);
    if (!target) return;

    const previousStatus = target.status;
    const now = new Date().toISOString();
    const newUpdate = {
      id: `upd_${Date.now()}`,
      request_id: requestId,
      updated_by: current.currentUser.full_name,
      previous_status: previousStatus,
      new_status: newStatus,
      note: note || `Status updated to ${newStatus.replace('_', ' ')}`,
      created_at: now,
    };

    const updatedRequests = current.requests.map((req) => {
      if (req.id === requestId) {
        return {
          ...req,
          status: newStatus,
          updated_at: now,
          updates: [...req.updates, newUpdate],
        };
      }
      return req;
    });

    StorageService.setRequests(updatedRequests);

    // Notify student
    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      user_id: target.user_id,
      title: `Request #${requestId.toUpperCase()} Update`,
      message: `${current.currentUser.full_name} updated status to ${newStatus.replace('_', ' ').toUpperCase()}${note ? `: "${note}"` : ''}`,
      type: 'request',
      read_at: null,
      link: '/requests',
      created_at: now,
    };
    const updatedNotifs = [notif, ...current.notifications];
    StorageService.setNotifications(updatedNotifs);

    set({
      requests: updatedRequests,
      notifications: updatedNotifs,
    });
  },

  assignRequestStaff: (requestId, staffId, staffName) => {
    const current = get();
    const now = new Date().toISOString();
    const updatedRequests = current.requests.map((req) => {
      if (req.id === requestId) {
        return {
          ...req,
          assigned_staff_id: staffId,
          assigned_staff_name: staffName,
          updated_at: now,
          updates: [
            ...req.updates,
            {
              id: `upd_${Date.now()}`,
              request_id: requestId,
              updated_by: current.currentUser.full_name,
              previous_status: req.status,
              new_status: req.status,
              note: `Assigned to ${staffName}`,
              created_at: now,
            },
          ],
        };
      }
      return req;
    });

    StorageService.setRequests(updatedRequests);
    set({ requests: updatedRequests });
  },

  createResourceReport: (data) => {
    const current = get();
    const repId = `rep_${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();
    const newReport: ResourceReport = {
      id: repId,
      reporter_id: current.currentUser.id,
      reporter_name: current.currentUser.full_name,
      reporter_email: current.currentUser.email,
      ...data,
      status: 'submitted',
      created_at: now,
    };

    const updatedReports = [newReport, ...current.reports];
    StorageService.setReports(updatedReports);

    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      user_id: current.currentUser.id,
      title: `Report #${repId.toUpperCase()} Submitted`,
      message: `Thank you for reporting the issue for "${data.resource_name}". Our campus safety team has been notified.`,
      type: 'report',
      read_at: null,
      link: '/report',
      created_at: now,
    };
    const updatedNotifs = [notif, ...current.notifications];
    StorageService.setNotifications(updatedNotifs);

    set({
      reports: updatedReports,
      notifications: updatedNotifs,
    });

    return repId;
  },

  updateReportStatus: (reportId, newStatus, resolutionNotes) => {
    const current = get();
    const now = new Date().toISOString();
    const target = current.reports.find((r) => r.id === reportId);
    if (!target) return;

    const updatedReports = current.reports.map((rep) => {
      if (rep.id === reportId) {
        return {
          ...rep,
          status: newStatus,
          resolution_notes: resolutionNotes || rep.resolution_notes,
          resolved_at: newStatus === 'resolved' ? now : rep.resolved_at,
          assigned_staff_id: rep.assigned_staff_id || current.currentUser.id,
          assigned_staff_name: rep.assigned_staff_name || current.currentUser.full_name,
        };
      }
      return rep;
    });

    StorageService.setReports(updatedReports);

    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      user_id: target.reporter_id,
      title: `Report #${reportId.toUpperCase()} Status: ${newStatus.toUpperCase()}`,
      message: `Your equipment report regarding "${target.resource_name}" is now marked as ${newStatus}.${resolutionNotes ? ` Resolution note: "${resolutionNotes}"` : ''}`,
      type: 'report',
      read_at: null,
      link: '/report',
      created_at: now,
    };
    const updatedNotifs = [notif, ...current.notifications];
    StorageService.setNotifications(updatedNotifs);

    set({
      reports: updatedReports,
      notifications: updatedNotifs,
    });
  },

  updateResource: (resourceId, updates) => {
    const current = get();
    const now = new Date().toISOString();
    const updatedResources = current.resources.map((res) => {
      if (res.id === resourceId) {
        return {
          ...res,
          ...updates,
          updated_at: now,
        };
      }
      return res;
    });

    StorageService.setResources(updatedResources);
    set({ resources: updatedResources });
  },

  verifyResource: (resourceId, verifierName) => {
    const current = get();
    const now = new Date().toISOString();
    const updatedResources = current.resources.map((res) => {
      if (res.id === resourceId) {
        return {
          ...res,
          status: 'available' as ResourceStatus,
          last_verified_at: now,
          verified_by: verifierName,
          updated_at: now,
        };
      }
      return res;
    });

    StorageService.setResources(updatedResources);
    set({ resources: updatedResources });
  },

  addResource: (resourceData) => {
    const current = get();
    const newId = `res_${Date.now().toString(36)}`;
    const now = new Date().toISOString();
    const newRes: CampusResource = {
      ...resourceData,
      id: newId,
      created_at: now,
      updated_at: now,
    };

    const updated = [newRes, ...current.resources];
    StorageService.setResources(updated);
    set({ resources: updated });
  },

  markNotificationAsRead: (notificationId) => {
    const current = get();
    const now = new Date().toISOString();
    const updated = current.notifications.map((n) =>
      n.id === notificationId ? { ...n, read_at: now } : n
    );
    StorageService.setNotifications(updated);
    set({ notifications: updated });
  },

  markAllNotificationsAsRead: () => {
    const current = get();
    const now = new Date().toISOString();
    const updated = current.notifications.map((n) => ({
      ...n,
      read_at: n.read_at || now,
    }));
    StorageService.setNotifications(updated);
    set({ notifications: updated });
  },

  addNotification: (notifData) => {
    const current = get();
    const newNotif: AppNotification = {
      ...notifData,
      id: `notif_${Date.now()}`,
      created_at: new Date().toISOString(),
      read_at: null,
    };
    const updated = [newNotif, ...current.notifications];
    StorageService.setNotifications(updated);
    set({ notifications: updated });
  },

  resetDemoData: () => {
    StorageService.resetAllDemoData();
    set({
      currentUser: StorageService.getCurrentUser(),
      resources: StorageService.getResources(),
      requests: StorageService.getRequests(),
      reports: StorageService.getReports(),
      announcements: StorageService.getAnnouncements(),
      notifications: StorageService.getNotifications(),
      recentResourceIds: StorageService.getRecentResourceIds(),
      selectedResourceId: null,
      searchQuery: '',
      activeFilterCategory: 'all',
      activeFilterStatus: 'all',
      activeZone: 'all',
    });
  },
}));

