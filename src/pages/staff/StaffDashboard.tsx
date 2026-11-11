import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Phone,
  FileText,
  MapPin,
  Send,
  Wrench,
  HelpCircle,
  Plus,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { RequestStatus, ResourceStatus } from '../../types';

export const StaffDashboard: React.FC = () => {
  const {
    currentUser,
    switchUserRole,
    requests,
    resources,
    reports,
    updateRequestStatus,
    assignRequestStaff,
    updateResource,
    updateReportStatus,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'requests' | 'reports' | 'resources'>('requests');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [statusNote, setStatusNote] = useState('');

  // If role is student, show role switch prompt
  if (currentUser.role === 'student') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-medteal-50 text-medteal flex items-center justify-center mx-auto border border-medteal/30">
          <Stethoscope className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-navy">Campus Medical Responder Desk</h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          This portal is restricted to authorized campus medical officers, triage nurses, and certified first responders to coordinate assistance calls and verify safety gear.
        </p>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-navy font-medium max-w-sm mx-auto">
          You are currently viewing as: <strong>Student ({currentUser.full_name})</strong>
        </div>
        <button
          onClick={() => switchUserRole('staff')}
          className="px-6 py-2.5 rounded-xl bg-medteal hover:bg-medteal-600 text-white font-bold text-xs shadow-md transition-colors"
        >
          Switch to Dr. Priya Sharma (Medical Staff Demo)
        </button>
      </div>
    );
  }

  const pendingCount = requests.filter((r) => r.status === 'submitted').length;
  const inProgressCount = requests.filter((r) => r.status === 'in_progress').length;
  const resolvedCount = requests.filter((r) => r.status === 'resolved').length;
  const openReportsCount = reports.filter((r) => r.status !== 'resolved').length;

  const activeRequest = requests.find((r) => r.id === selectedRequestId) || requests[0] || null;

  const handleUpdateStatus = (reqId: string, status: RequestStatus) => {
    updateRequestStatus(reqId, status, statusNote.trim() || undefined);
    setStatusNote('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Staff Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-medteal uppercase tracking-wider">
              RESPONDER DISPATCH DESK
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-medteal-50 text-medteal-700 font-mono font-bold border border-medteal/20">
              OFFICIAL RESPONDER ROLE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mt-1">
            Campus Health Coordination Center
          </h1>
          <p className="text-xs sm:text-sm text-mutedgrey mt-0.5">
            Logged in as {currentUser.full_name} ({currentUser.department})
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'requests'
                ? 'bg-white text-navy shadow-sm'
                : 'text-slate-600 hover:text-navy'
            }`}
          >
            Assistance Queue ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'reports'
                ? 'bg-white text-navy shadow-sm'
                : 'text-slate-600 hover:text-navy'
            }`}
          >
            Equipment Reports ({openReportsCount})
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'resources'
                ? 'bg-white text-navy shadow-sm'
                : 'text-slate-600 hover:text-navy'
            }`}
          >
            Station Status
          </button>
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-mutedgrey font-bold uppercase tracking-wider">
            Pending Triage
          </div>
          <div className="text-3xl font-black text-amber-600">{pendingCount}</div>
          <div className="text-[11px] text-slate-500">Require triage acknowledgment</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-mutedgrey font-bold uppercase tracking-wider">
            Active Cases
          </div>
          <div className="text-3xl font-black text-medblue">{inProgressCount}</div>
          <div className="text-[11px] text-slate-500">First-responders en route</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-mutedgrey font-bold uppercase tracking-wider">
            Resolved Today
          </div>
          <div className="text-3xl font-black text-medteal">{resolvedCount}</div>
          <div className="text-[11px] text-slate-500">Closed assistance logs</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs text-mutedgrey font-bold uppercase tracking-wider">
            Station Issues
          </div>
          <div className="text-3xl font-black text-emergency">{openReportsCount}</div>
          <div className="text-[11px] text-slate-500">Open equipment alerts</div>
        </div>
      </div>

      {/* TAB 1: Assistance Request Management */}
      {activeTab === 'requests' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Requests List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold text-navy uppercase tracking-wider">
              Incoming Assistance Queue
            </h3>
            {requests.map((req) => {
              const isSelected = activeRequest?.id === req.id;
              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequestId(req.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-2 ${
                    isSelected
                      ? 'bg-medteal-50/70 border-medteal shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-navy">
                      #{req.id.toUpperCase()}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        req.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'acknowledged'
                          ? 'bg-blue-100 text-blue-800'
                          : req.status === 'resolved'
                          ? 'bg-mint text-emerald-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div className="font-bold text-navy">{req.user_name}</div>
                  <p className="text-slate-600 line-clamp-2">{req.description}</p>
                  <div className="text-[10px] text-mutedgrey flex items-center justify-between pt-1 border-t border-slate-100">
                    <span>{req.building}</span>
                    <span>{new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Request Triage Panel */}
          {activeRequest && (
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="space-y-2 pb-5 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-extrabold text-navy">
                    Triage #{activeRequest.id.toUpperCase()}
                  </span>
                  <span className="text-xs text-mutedgrey">
                    {new Date(activeRequest.created_at).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-base font-bold text-navy capitalize">
                  {activeRequest.request_category.replace('_', ' ')}: {activeRequest.user_name}
                </h3>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {activeRequest.description}
                </p>
              </div>

              {/* Patient Location & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-mutedgrey uppercase">Location</span>
                  <div className="font-bold text-navy">{activeRequest.building}</div>
                  <div className="text-slate-600">{activeRequest.campus_location}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-mutedgrey uppercase">Contact</span>
                  <div className="font-bold text-navy">{activeRequest.contact_preference}</div>
                  {activeRequest.contact_number && (
                    <a
                      href={`tel:${activeRequest.contact_number.replace(/[^\d+]/g, '')}`}
                      className="text-medblue hover:underline font-mono font-bold flex items-center gap-1 mt-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{activeRequest.contact_number}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-navy uppercase tracking-wider">
                  Update Triage Status
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleUpdateStatus(activeRequest.id, 'acknowledged')}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs"
                  >
                    Mark Acknowledged
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(activeRequest.id, 'in_progress')}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-bold text-xs"
                  >
                    Dispatch First-Responder
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(activeRequest.id, 'resolved')}
                    className="px-3.5 py-1.5 rounded-lg bg-mint text-emerald-800 hover:bg-emerald-100 font-bold text-xs"
                  >
                    Mark Resolved
                  </button>
                </div>

                {/* Optional Status Note */}
                <div className="pt-2">
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Add responder note (e.g., Nurse en route with splint kit)..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-medteal"
                  />
                </div>
              </div>

              {/* Assigned Staff Action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600">
                  Assigned Officer:{' '}
                  <strong>{activeRequest.assigned_staff_name || 'Unassigned'}</strong>
                </span>
                <button
                  onClick={() =>
                    assignRequestStaff(activeRequest.id, currentUser.id, currentUser.full_name)
                  }
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy font-semibold text-xs"
                >
                  Assign to Me
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Equipment Reports Management */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-navy uppercase tracking-wider">
            Reported Resource Shortages & Repairs
          </h3>
          <div className="divide-y divide-slate-100">
            {reports.map((rep) => (
              <div key={rep.id} className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-navy">#{rep.id.toUpperCase()}</span>
                    <span className="font-semibold text-navy">{rep.resource_name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                      {rep.status}
                    </span>
                  </div>
                  <p className="text-slate-600">{rep.description}</p>
                  <div className="text-[11px] text-mutedgrey">
                    Reported by {rep.reporter_name} at {rep.location} on {new Date(rep.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {rep.status !== 'resolved' ? (
                    <button
                      onClick={() =>
                        updateReportStatus(rep.id, 'resolved', 'Restocked by campus health staff.')
                      }
                      className="px-3 py-1.5 rounded-lg bg-mint text-emerald-800 hover:bg-emerald-100 font-bold text-xs"
                    >
                      Mark Resolved / Restocked
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Campus Resource Status Toggle */}
      {activeTab === 'resources' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-navy uppercase tracking-wider">
            Campus Medical Resource Availability Management
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-navy font-bold uppercase tracking-wider text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">Resource Name</th>
                  <th className="py-3 px-3">Building</th>
                  <th className="py-3 px-3">Current Status</th>
                  <th className="py-3 px-3">Quick Status Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resources.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-navy">{res.name}</td>
                    <td className="py-3 px-3 text-slate-600">{res.building}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          res.status === 'available'
                            ? 'bg-mint text-emerald-800'
                            : res.status === 'under_maintenance'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {res.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateResource(res.id, { status: 'available' })}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-navy text-[10px] font-semibold"
                        >
                          Set Available
                        </button>
                        <button
                          onClick={() => updateResource(res.id, { status: 'under_maintenance' })}
                          className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-semibold"
                        >
                          Maintenance
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

