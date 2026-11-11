import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Send,
  Camera,
  MapPin,
  Clock,
  ShieldCheck,
  Building,
  Check,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { IssueCategory, ReportStatus } from '../../types';

export const ReportIssuePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedResourceId = searchParams.get('resource_id');

  const { resources, reports, currentUser, createResourceReport } = useAppStore();

  const [resourceId, setResourceId] = useState<string>(
    preselectedResourceId || resources[0]?.id || ''
  );
  const [category, setCategory] = useState<IssueCategory>('empty_first_aid');
  const [description, setDescription] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [simulatedImageUrl, setSimulatedImageUrl] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // User submitted reports
  const myReports = reports.filter(
    (r) => r.reporter_id === currentUser.id || currentUser.role === 'admin'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg('Please describe the issue observed.');
      return;
    }

    const targetRes = resources.find((r) => r.id === resourceId);
    const loc = locationDetails.trim() || targetRes?.location_description || targetRes?.building || 'Campus';

    const repId = createResourceReport({
      resource_id: resourceId,
      resource_name: targetRes?.name || 'Campus Medical Facility',
      issue_category: category,
      description: description.trim(),
      location: loc,
      image_url: simulatedImageUrl || undefined,
    });

    setSubmittedId(repId);
    setDescription('');
    setLocationDetails('');
    setSimulatedImageUrl(null);
    setErrorMsg(null);
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800">
            Submitted
          </span>
        );
      case 'under_review':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
            Under Review
          </span>
        );
      case 'assigned':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
            Assigned to Tech
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-mint text-emerald-800">
            Resolved
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800">
            Rejected
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              EQUIPMENT & FACILITY AUDIT
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
              Crowdsourced Campus Safety
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mt-1">
            Report a Medical Resource Issue
          </h1>
          <p className="text-xs sm:text-sm text-mutedgrey mt-0.5">
            Help campus operations quickly restock empty trauma kits, service alarmed AED boxes, and fix accessible doors.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            {submittedId && (
              <div className="mb-6 p-4 rounded-xl bg-mint/50 border border-emerald-300 text-xs text-emerald-950 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">
                    Report Logged Successfully (#{submittedId.toUpperCase()})
                  </strong>
                  <p className="text-slate-700 mt-0.5 leading-relaxed">
                    Thank you for notifying campus safety. Your report has been dispatched to the responder queue and can be tracked below.
                  </p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Target Resource */}
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                  Affected Campus Resource
                </label>
                <select
                  value={resourceId}
                  onChange={(e) => setResourceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-navy focus:outline-none focus:border-medblue bg-white"
                >
                  {resources.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.building})
                    </option>
                  ))}
                </select>
              </div>

              {/* Issue Category */}
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
                  Issue Classification
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'empty_first_aid', label: 'Empty / Depleted First-Aid Kit' },
                    { id: 'damaged_aed', label: 'Damaged / Beeping AED Cabinet' },
                    { id: 'unavailable_equipment', label: 'Broken Eyewash / Shower' },
                    { id: 'closed_facility', label: 'Facility Unexpectedly Closed' },
                    { id: 'broken_accessibility', label: 'Broken Ramp / Door Sensor' },
                    { id: 'incorrect_location', label: 'Incorrect Location / Contact' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(c.id as IssueCategory)}
                      className={`p-2.5 text-xs rounded-xl font-medium border text-left transition-all ${
                        category === c.id
                          ? 'bg-amber-50 text-amber-900 border-amberwarn font-semibold shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                  Detailed Description of Discrepancy
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="E.g., Bandage rolls and antiseptic wash completely missing; or AED cabinet glass door seal was breached..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-medblue text-charcoal placeholder:text-mutedgrey"
                />
              </div>

              {/* Specific Location Landmark */}
              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                  Specific Spot or Floor (Optional)
                </label>
                <input
                  type="text"
                  value={locationDetails}
                  onChange={(e) => setLocationDetails(e.target.value)}
                  placeholder="e.g. Near West stairwell on 2nd Floor"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-medblue text-navy"
                />
              </div>

              {/* Simulated Image Upload */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
                  Attach Photo Evidence (Simulated)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      // Toggle simulated photo attachment
                      if (simulatedImageUrl) {
                        setSimulatedImageUrl(null);
                      } else {
                        setSimulatedImageUrl(
                          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60'
                        );
                      }
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all ${
                      simulatedImageUrl
                        ? 'bg-mint text-emerald-800 border-emerald-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    <span>{simulatedImageUrl ? 'Photo Attached ✓' : 'Simulate Photo Upload'}</span>
                  </button>
                  <span className="text-[11px] text-mutedgrey">
                    JPEG, PNG supported up to 5MB
                  </span>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-navy hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Send className="w-4 h-4 text-amberwarn" />
                  <span>Submit Issue Report</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Submitted Reports Tracker */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-navy uppercase tracking-wider flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-medblue" />
                <span>Submitted Campus Reports ({myReports.length})</span>
              </h3>
              <span className="text-[11px] text-mutedgrey font-mono">Live Tracker</span>
            </div>

            {myReports.length === 0 ? (
              <p className="text-xs text-mutedgrey py-6 text-center">
                No equipment reports submitted yet.
              </p>
            ) : (
              <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                {myReports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-navy">
                        #{rep.id.toUpperCase()}
                      </span>
                      {getStatusBadge(rep.status)}
                    </div>

                    <div className="font-bold text-navy">{rep.resource_name}</div>
                    <p className="text-slate-600 line-clamp-2 leading-relaxed">{rep.description}</p>

                    <div className="flex items-center justify-between text-[10px] text-mutedgrey pt-2 border-t border-slate-200/60">
                      <span>{new Date(rep.created_at).toLocaleDateString()}</span>
                      <span>By: {rep.reporter_name}</span>
                    </div>

                    {rep.resolution_notes && (
                      <div className="bg-mint/60 p-2.5 rounded-lg border border-emerald-200 text-[11px] text-emerald-950 font-medium">
                        <strong>Resolution:</strong> {rep.resolution_notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

