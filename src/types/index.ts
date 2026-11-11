export type UserRole = 'student' | 'staff' | 'admin';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role: UserRole;
  phone?: string;
  student_id?: string;
  department?: string;
  emergency_contact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  created_at: string;
}

export type ResourceType =
  | 'medical_centre'
  | 'first_aid'
  | 'aed'
  | 'pharmacy'
  | 'ambulance_bay'
  | 'assembly_point'
  | 'accessible_entrance';

export type ResourceStatus =
  | 'available'
  | 'temporarily_unavailable'
  | 'under_maintenance'
  | 'unverified';

export interface ResourceEquipment {
  id: string;
  resource_id: string;
  equipment_name: string;
  quantity: number;
  status: 'operational' | 'depleted' | 'maintenance' | 'missing';
  last_checked_at: string;
}

export interface CampusResource {
  id: string;
  name: string;
  resource_type: ResourceType;
  description: string;
  building: string;
  floor: string;
  location_description: string;
  // Map positioning for custom campus vector layout (percentages 0-100)
  map_coords: {
    x: number; // percentage 0-100 on campus grid
    y: number; // percentage 0-100 on campus grid
    zone: 'North' | 'South' | 'Central' | 'East' | 'West';
  };
  contact_number?: string;
  opening_hours: string;
  accessibility_details: string;
  has_wheelchair_ramp: boolean;
  has_elevator_access: boolean;
  status: ResourceStatus;
  last_verified_at: string;
  verified_by: string;
  equipment: ResourceEquipment[];
  created_at: string;
  updated_at: string;
  image_url?: string;
}

export type RequestCategory =
  | 'first_aid'
  | 'directions'
  | 'facility_info'
  | 'equipment_issue'
  | 'other';

export type RequestStatus =
  | 'submitted'
  | 'acknowledged'
  | 'in_progress'
  | 'resolved'
  | 'cancelled';

export interface RequestUpdate {
  id: string;
  request_id: string;
  updated_by: string;
  previous_status: RequestStatus;
  new_status: RequestStatus;
  note?: string;
  created_at: string;
}

export interface AssistanceRequest {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  request_category: RequestCategory;
  description: string;
  campus_location: string;
  building: string;
  floor?: string;
  contact_preference: 'phone' | 'email' | 'in_person';
  contact_number?: string;
  share_location_consent: boolean;
  status: RequestStatus;
  assigned_staff_id?: string;
  assigned_staff_name?: string;
  internal_notes?: string;
  updates: RequestUpdate[];
  created_at: string;
  updated_at: string;
}

export type IssueCategory =
  | 'empty_first_aid'
  | 'damaged_aed'
  | 'unavailable_equipment'
  | 'incorrect_location'
  | 'closed_facility'
  | 'broken_accessibility'
  | 'incorrect_contact';

export type ReportStatus =
  | 'submitted'
  | 'under_review'
  | 'assigned'
  | 'resolved'
  | 'rejected';

export interface ResourceReport {
  id: string;
  reporter_id: string;
  reporter_name: string;
  reporter_email: string;
  resource_id: string;
  resource_name: string;
  issue_category: IssueCategory;
  description: string;
  image_url?: string;
  location: string;
  status: ReportStatus;
  assigned_staff_id?: string;
  assigned_staff_name?: string;
  resolution_notes?: string;
  created_at: string;
  resolved_at?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'health_camp' | 'awareness' | 'maintenance' | 'training';
  published_by: string;
  published_at: string;
  expires_at: string;
  priority: 'normal' | 'important' | 'urgent';
}

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'request' | 'report' | 'maintenance' | 'announcement' | 'system';
  read_at: string | null;
  link?: string;
  created_at: string;
}

export interface FirstAidTopic {
  id: string;
  title: string;
  category: string;
  urgency: 'high' | 'medium' | 'low';
  summary: string;
  immediate_steps: string[];
  do_nots: string[];
  when_to_seek_er: string[];
  verified_sources: {
    name: string;
    url: string;
  }[];
  icon_name: string;
}

