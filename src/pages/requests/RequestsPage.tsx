import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin,
  Plus,
  User,
  ShieldCheck,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { RequestStatus, RequestCategory } from '../../types';

export const RequestsPage: React.FC = () => {
  const { requests, currentUser, updateRequestStatus } = useAppStore();

  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  // If student: only their requests; if staff/admin: can see all
  const visibleRequests = requests.filter((r) => {
    if (currentUser.role === 'student' && r.user_id !== currentUser.id) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  const activeRequest =
    requests.find((r) => r.id === selectedRequestId) || visibleRequests[0] || null;

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800">
            Submitted
          </span>
        );
      case 'acknowledged':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
            Acknowledged
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 animate-pulse">
            In Progress
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-mint text-emerald-800">
            Resolved
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-medblue uppercase tracking-wider">
              CAMPUS ASSISTANCE LOG
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
              {currentUser.role === 'student' ? 'My Requests' : 'All Campus Requests'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mt-1">
            Assistance Request Tracking
          </h1>
          <p className="text-xs sm:text-sm text-mutedgrey mt-0.5">
            Monitor triage progress, assigned medical personnel, and live updates.
          </p>
        </div>

        <Link
          to="/emergency"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-medblue hover:bg-medblue-600 text-white font-bold text-xs shadow-sm transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Assistance Request</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {(['all', 'submitted', 'acknowledged', 'in_progress', 'resolved'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider text-[11px] transition-colors whitespace-nowrap ${
              statusFilter === st
                ? 'bg-navy text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Two-Column List & Details */}
      {visibleRequests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <FileText className="w-12 h-12 text-mutedgrey mx-auto" />
          <h3 className="text-base font-bold text-navy">No Assistance Requests</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You do not have any requests in this status category.
          </p>
          <Link
            to="/emergency"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-medblue text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Create Request</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Requests List */}
          <div className="lg:col-span-5 space-y-3">
            {visibleRequests.map((req) => {
              const isSelected = activeRequest?.id === req.id;
              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequestId(req.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-2.5 ${
                    isSelected
                      ? 'bg-medblue-50/70 border-medblue shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-navy">
                      #{req.id.toUpperCase()}
                    </span>
                    {getStatusBadge(req.status)}
                  </div>

                  <p className="text-slate-800 font-medium line-clamp-2 leading-relaxed">
                    {req.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-mutedgrey pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-medblue" />
                      {req.building}
                    </span>
                    <span>
                      {new Date(req.created_at).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Request Detail Panel */}
          {activeRequest && (
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              {/* Header */}
              <div className="space-y-3 pb-5 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-extrabold text-navy">
                      #{activeRequest.id.toUpperCase()}
                    </span>
                    {getStatusBadge(activeRequest.status)}
                  </div>
                  <span className="text-xs text-mutedgrey font-mono">
                    Logged {new Date(activeRequest.created_at).toLocaleString()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-navy capitalize">
                  {activeRequest.request_category.replace('_', ' ')} Assistance
                </h3>

                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  "{activeRequest.description}"
                </p>
              </div>

              {/* Location & Contact Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-mutedgrey">
                    Campus Location
                  </span>
                  <div className="font-bold text-navy">{activeRequest.building}</div>
                  <div className="text-slate-600">{activeRequest.campus_location}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-mutedgrey">
                    Requester Contact
                  </span>
                  <div className="font-bold text-navy">{activeRequest.user_name}</div>
                  <div className="text-slate-600 font-mono">
                    {activeRequest.contact_number || activeRequest.user_email}
                  </div>
                </div>
              </div>

              {/* Responder Assignment */}
              {activeRequest.assigned_staff_name ? (
                <div className="p-4 rounded-xl bg-mint/50 border border-emerald-300 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-medteal shrink-0" />
                    <div>
                      <div className="font-bold text-navy">
                        Assigned Officer: {activeRequest.assigned_staff_name}
                      </div>
                      <div className="text-slate-600 text-[11px]">
                        Authorized Campus Medical Responder
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  Pending dispatch assignment from the Campus Responder Desk.
                </div>
              )}

              {/* Progress Timeline */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-medblue" />
                  <span>Status Audit Trail & Updates</span>
                </h4>

                <div className="space-y-3 pl-2 border-l-2 border-slate-200">
                  {activeRequest.updates.map((upd) => (
                    <div key={upd.id} className="relative pl-4 space-y-1 text-xs">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-medblue ring-4 ring-white" />
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-navy">{upd.updated_by}</span>
                        <span className="text-mutedgrey font-mono">
                          {new Date(upd.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="text-slate-700">{upd.note}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cancel Action if still open */}
              {(activeRequest.status === 'submitted' || activeRequest.status === 'acknowledged') && (
                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => {
                      if (window.confirm('Cancel this assistance request?')) {
                        updateRequestStatus(
                          activeRequest.id,
                          'cancelled',
                          'Cancelled by user request.'
                        );
                      }
                    }}
                    className="text-xs text-red-600 hover:text-red-800 font-semibold"
                  >
                    Cancel This Request
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

