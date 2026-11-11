-- ===================================================================
-- MEDROUTE: SMART CAMPUS MEDICAL RESPONSE & READINESS PLATFORM
-- Normalized PostgreSQL Schema with Row-Level Security (RLS)
-- ===================================================================

-- Create Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL CHECK (role IN ('student', 'staff', 'admin')) DEFAULT 'student',
    phone TEXT,
    student_id TEXT,
    department TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CAMPUS RESOURCES TABLE
CREATE TABLE IF NOT EXISTS campus_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    resource_type TEXT NOT NULL CHECK (
        resource_type IN (
            'medical_centre',
            'first_aid',
            'aed',
            'pharmacy',
            'ambulance_bay',
            'assembly_point',
            'accessible_entrance'
        )
    ),
    description TEXT NOT NULL,
    building TEXT NOT NULL,
    floor TEXT NOT NULL,
    location_description TEXT NOT NULL,
    zone TEXT NOT NULL CHECK (zone IN ('North', 'South', 'Central', 'East', 'West')),
    coord_x NUMERIC(5, 2) NOT NULL, -- Grid percentage (0 - 100)
    coord_y NUMERIC(5, 2) NOT NULL, -- Grid percentage (0 - 100)
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    contact_number TEXT,
    opening_hours TEXT NOT NULL DEFAULT '24 Hours / 7 Days',
    accessibility_details TEXT,
    has_wheelchair_ramp BOOLEAN DEFAULT TRUE,
    has_elevator_access BOOLEAN DEFAULT TRUE,
    status TEXT NOT NULL CHECK (
        status IN ('available', 'temporarily_unavailable', 'under_maintenance', 'unverified')
    ) DEFAULT 'available',
    last_verified_at TIMESTAMPTZ DEFAULT NOW(),
    verified_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RESOURCE EQUIPMENT INVENTORY
CREATE TABLE IF NOT EXISTS resource_equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id UUID NOT NULL REFERENCES campus_resources(id) ON DELETE CASCADE,
    equipment_name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 0),
    status TEXT NOT NULL CHECK (
        status IN ('operational', 'depleted', 'maintenance', 'missing')
    ) DEFAULT 'operational',
    last_checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ASSISTANCE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS assistance_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    request_category TEXT NOT NULL CHECK (
        request_category IN ('first_aid', 'directions', 'facility_info', 'equipment_issue', 'other')
    ),
    description TEXT NOT NULL,
    campus_location TEXT NOT NULL,
    building TEXT NOT NULL,
    floor TEXT,
    contact_preference TEXT NOT NULL CHECK (contact_preference IN ('phone', 'email', 'in_person')),
    contact_number TEXT,
    share_location_consent BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL CHECK (
        status IN ('submitted', 'acknowledged', 'in_progress', 'resolved', 'cancelled')
    ) DEFAULT 'submitted',
    assigned_staff_id UUID REFERENCES profiles(id),
    internal_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REQUEST UPDATES AUDIT TRAIL
CREATE TABLE IF NOT EXISTS request_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES assistance_requests(id) ON DELETE CASCADE,
    updated_by_id UUID REFERENCES profiles(id),
    previous_status TEXT NOT NULL,
    new_status TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RESOURCE ISSUE REPORTS
CREATE TABLE IF NOT EXISTS resource_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES campus_resources(id) ON DELETE CASCADE,
    issue_category TEXT NOT NULL CHECK (
        issue_category IN (
            'empty_first_aid',
            'damaged_aed',
            'unavailable_equipment',
            'incorrect_location',
            'closed_facility',
            'broken_accessibility',
            'incorrect_contact'
        )
    ),
    description TEXT NOT NULL,
    image_url TEXT,
    location TEXT NOT NULL,
    status TEXT NOT NULL CHECK (
        status IN ('submitted', 'under_review', 'assigned', 'resolved', 'rejected')
    ) DEFAULT 'submitted',
    assigned_staff_id UUID REFERENCES profiles(id),
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 7. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (
        category IN ('health_camp', 'awareness', 'maintenance', 'training')
    ),
    published_by TEXT NOT NULL,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    priority TEXT NOT NULL CHECK (priority IN ('normal', 'important', 'urgent')) DEFAULT 'normal'
);

-- 8. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (
        type IN ('request', 'report', 'maintenance', 'announcement', 'system')
    ),
    read_at TIMESTAMPTZ,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- INDEXES FOR PERFORMANCE
-- ===================================================================
CREATE INDEX IF NOT EXISTS idx_resources_type ON campus_resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_resources_status ON campus_resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_building ON campus_resources(building);
CREATE INDEX IF NOT EXISTS idx_requests_user ON assistance_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON assistance_requests(status);
CREATE INDEX IF NOT EXISTS idx_reports_resource ON resource_reports(resource_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON resource_reports(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- ===================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ===================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campus_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Campus Resources: Publicly readable by all authenticated campus members
CREATE POLICY "Public read resources" ON campus_resources
    FOR SELECT TO authenticated, anon USING (true);

-- Campus Resources: Only Staff and Admin can modify
CREATE POLICY "Staff modify resources" ON campus_resources
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role IN ('staff', 'admin')
        )
    );

-- Assistance Requests: Users see own requests; Staff/Admin see all
CREATE POLICY "Users read own requests" ON assistance_requests
    FOR SELECT TO authenticated
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role IN ('staff', 'admin')
        )
    );

CREATE POLICY "Users create requests" ON assistance_requests
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Resource Reports: Users can create and view their reports; Staff/Admin can review
CREATE POLICY "Users read own reports" ON resource_reports
    FOR SELECT TO authenticated
    USING (
        reporter_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role IN ('staff', 'admin')
        )
    );

CREATE POLICY "Users create reports" ON resource_reports
    FOR INSERT TO authenticated
    WITH CHECK (reporter_id = auth.uid());

-- Announcements: Public read
CREATE POLICY "Public read announcements" ON announcements
    FOR SELECT TO authenticated, anon USING (true);

-- Notifications: Users see only their notifications
CREATE POLICY "User read own notifications" ON notifications
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

