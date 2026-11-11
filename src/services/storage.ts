import {
  UserProfile,
  CampusResource,
  AssistanceRequest,
  ResourceReport,
  Announcement,
  AppNotification,
  UserRole,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_RESOURCES,
  INITIAL_REQUESTS,
  INITIAL_REPORTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
} from '../data/demoData';

const KEYS = {
  CURRENT_USER: 'medroute_current_user_v1',
  RESOURCES: 'medroute_resources_v1',
  REQUESTS: 'medroute_requests_v1',
  REPORTS: 'medroute_reports_v1',
  ANNOUNCEMENTS: 'medroute_announcements_v1',
  NOTIFICATIONS: 'medroute_notifications_v1',
  RECENT_RESOURCES: 'medroute_recent_resources_v1',
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (e) {
    console.warn(`Storage read error for key: ${key}`, e);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Storage write error for key: ${key}`, e);
  }
}

export const StorageService = {
  getCurrentUser(): UserProfile {
    return getItem<UserProfile>(KEYS.CURRENT_USER, DEMO_USERS.student);
  },

  setCurrentUser(user: UserProfile): void {
    setItem(KEYS.CURRENT_USER, user);
  },

  switchRole(role: UserRole): UserProfile {
    const targetUser = DEMO_USERS[role] || DEMO_USERS.student;
    this.setCurrentUser(targetUser);
    return targetUser;
  },

  getResources(): CampusResource[] {
    return getItem<CampusResource[]>(KEYS.RESOURCES, INITIAL_RESOURCES);
  },

  setResources(resources: CampusResource[]): void {
    setItem(KEYS.RESOURCES, resources);
  },

  getRequests(): AssistanceRequest[] {
    return getItem<AssistanceRequest[]>(KEYS.REQUESTS, INITIAL_REQUESTS);
  },

  setRequests(requests: AssistanceRequest[]): void {
    setItem(KEYS.REQUESTS, requests);
  },

  getReports(): ResourceReport[] {
    return getItem<ResourceReport[]>(KEYS.REPORTS, INITIAL_REPORTS);
  },

  setReports(reports: ResourceReport[]): void {
    setItem(KEYS.REPORTS, reports);
  },

  getAnnouncements(): Announcement[] {
    return getItem<Announcement[]>(KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  },

  setAnnouncements(announcements: Announcement[]): void {
    setItem(KEYS.ANNOUNCEMENTS, announcements);
  },

  getNotifications(): AppNotification[] {
    return getItem<AppNotification[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },

  setNotifications(notifications: AppNotification[]): void {
    setItem(KEYS.NOTIFICATIONS, notifications);
  },

  getRecentResourceIds(): string[] {
    return getItem<string[]>(KEYS.RECENT_RESOURCES, ['res_01', 'res_03', 'res_02']);
  },

  addRecentResourceId(id: string): void {
    const existing = this.getRecentResourceIds();
    const updated = [id, ...existing.filter((item) => item !== id)].slice(0, 5);
    setItem(KEYS.RECENT_RESOURCES, updated);
  },

  resetAllDemoData(): void {
    setItem(KEYS.CURRENT_USER, DEMO_USERS.student);
    setItem(KEYS.RESOURCES, INITIAL_RESOURCES);
    setItem(KEYS.REQUESTS, INITIAL_REQUESTS);
    setItem(KEYS.REPORTS, INITIAL_REPORTS);
    setItem(KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    setItem(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    setItem(KEYS.RECENT_RESOURCES, ['res_01', 'res_03', 'res_02']);
  },
};

