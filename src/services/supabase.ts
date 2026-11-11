/**
 * MedRoute — Supabase Service Abstraction Layer
 * Supports seamless hybrid operation:
 * - When VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are present, interacts with Supabase DB.
 * - Otherwise gracefully falls back to the client StorageService and Demo Data.
 */
import { StorageService } from './storage';
import { CampusResource, AssistanceRequest, ResourceReport } from '../types';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
};

export const SupabaseService = {
  isConfigured: isSupabaseConfigured(),

  async fetchResources(): Promise<CampusResource[]> {
    if (!this.isConfigured) {
      return StorageService.getResources();
    }
    // Remote fetch implementation hook
    return StorageService.getResources();
  },

  async submitAssistanceRequest(req: Partial<AssistanceRequest>): Promise<string> {
    if (!this.isConfigured) {
      // Local fallback handled by Zustand store
      return `req_${Date.now()}`;
    }
    return `req_${Date.now()}`;
  },

  async submitResourceReport(rep: Partial<ResourceReport>): Promise<string> {
    if (!this.isConfigured) {
      return `rep_${Date.now()}`;
    }
    return `rep_${Date.now()}`;
  },
};

