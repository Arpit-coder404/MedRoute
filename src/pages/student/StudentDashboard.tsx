import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  MapPin,
  Zap,
  Cross,
  PhoneCall,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Compass,
  FileText,
  UserCheck,
  ExternalLink,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ResourceCard } from '../../components/resources/ResourceCard';
import { CampusMedicalMap } from '../../components/map/CampusMedicalMap';

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    resources,
    announcements,
    requests,
    recentResourceIds,
    setSelectedResourceId,
  } = useAppStore();

  // Quick resource shortcuts
  const medicalCentre = resources.find((r) => r.resource_type === 'medical_centre');
  const userRequests = requests.filter((r) => r.user_id === currentUser.id);

  // Recently viewed resources
  const recentResources = resources.filter((r) => recentResourceIds.includes(r.id));

  // Quick emergency dispatch action
  const handleLocateOnMap = (res: any) => {
    setSelectedResourceId(res.id);
    navigate('/map');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Dashboard Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-medblue uppercase tracking-wider">
              STUDENT HEALTH DESK
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
              ID: {currentUser.student_id || 'CAMPUS-ACTIVE'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mt-1">
            Welcome back, {currentUser.full_name.split(' ')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-mutedgrey mt-1">
            "Your campus medical resources, all in one place."
          </p>
        </div>

        {/* Quick Emergency Action */}
        <div className="flex items-center gap-3">
          <Link
            to="/emergency"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emergency hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emergency/20 transition-all"
          >
            <PhoneCall className="w-4 h-4 stroke-[2.5]" />
            <span>Emergency Assistance (112)</span>
          </Link>
        </div>
      </div>

      {/* Quick Action Hub */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-mutedgrey">
          Quick Medical Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <Link
            to="/resources/res_01"
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-medblue/40 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-lg bg-red-50 text-emergency flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-navy group-hover:text-medblue">
                Medical Centre
              </div>
              <div className="text-[11px] text-mutedgrey">Health Pavilion (24/7)</div>
            </div>
          </Link>

          <Link
            to="/resources?type=first_aid"
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-medblue/40 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-lg bg-medteal-50 text-medteal flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Cross className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-navy group-hover:text-medblue">
                Locate First Aid
              </div>
              <div className="text-[11px] text-mutedgrey">Wound & Trauma Kits</div>
            </div>
          </Link>

          <Link
            to="/resources?type=aed"
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-medblue/40 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-navy group-hover:text-medblue">
                AED Locations
              </div>
              <div className="text-[11px] text-mutedgrey">Public Defibrillators</div>
            </div>
          </Link>

          <Link
            to="/emergency"
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-medblue/40 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-medblue flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-navy group-hover:text-medblue">
                Campus Responders
              </div>
              <div className="text-[11px] text-mutedgrey">Direct Call & Triage</div>
            </div>
          </Link>

          <Link
            to="/report"
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-medblue/40 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-navy group-hover:text-medblue">
                Report Equipment
              </div>
              <div className="text-[11px] text-mutedgrey">Depleted or Damaged</div>
            </div>
          </Link>
        </div>
      </section>

      {/* Main Grid: Campus Map + Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Map Widget */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-navy flex items-center gap-2">
                <Compass className="w-4 h-4 text-medblue" />
                <span>Campus Medical Readiness Map</span>
              </h2>
              <p className="text-xs text-mutedgrey">
                Click any marker to inspect certified equipment and opening hours
              </p>
            </div>
            <Link
              to="/map"
              className="text-xs font-bold text-medblue hover:underline flex items-center gap-1"
            >
              <span>Full Screen Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <CampusMedicalMap compact={true} />
        </div>

        {/* Right Column: Campus Announcements & Active Requests */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active User Request Status (if any) */}
          {userRequests.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-medblue" />
                  <span>My Active Requests</span>
                </h3>
                <Link to="/requests" className="text-xs text-medblue hover:underline font-medium">
                  View all ({userRequests.length})
                </Link>
              </div>

              {userRequests.slice(0, 1).map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-navy">
                      #{req.id.toUpperCase()}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        req.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'acknowledged'
                          ? 'bg-blue-100 text-blue-800'
                          : req.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {req.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 line-clamp-2">{req.description}</p>
                  <div className="text-[10px] text-mutedgrey">
                    Location: {req.campus_location}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Campus Announcements */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-medteal" />
                <span>Campus Health Notices</span>
              </h3>
              <span className="text-[10px] text-mutedgrey font-mono">Verified Broadcasts</span>
            </div>

            <div className="space-y-3.5 divide-y divide-slate-100">
              {announcements.map((ann) => (
                <div key={ann.id} className="pt-3.5 first:pt-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        ann.priority === 'urgent'
                          ? 'bg-red-50 text-emergency'
                          : ann.priority === 'important'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ann.category.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-mutedgrey">
                      {new Date(ann.published_at).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-navy leading-snug">{ann.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recently Viewed Resources */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-navy">Recently Accessed Medical Facilities</h2>
            <p className="text-xs text-mutedgrey">
              Quick access to facilities you have previously browsed
            </p>
          </div>
          <Link
            to="/resources"
            className="text-xs font-bold text-medblue hover:underline flex items-center gap-1"
          >
            <span>View All ({resources.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentResources.map((res) => (
            <ResourceCard
              key={res.id}
              resource={res}
              onLocateOnMap={handleLocateOnMap}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

