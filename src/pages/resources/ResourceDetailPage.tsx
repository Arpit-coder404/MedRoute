import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  Cross,
  Zap,
  Pill,
  Truck,
  Flag,
  Accessibility,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  HelpCircle,
  ArrowLeft,
  Compass,
  AlertCircle,
  FileCheck2,
  Calendar,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const ResourceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { resources, setSelectedResourceId } = useAppStore();

  const resource = resources.find((r) => r.id === id);

  if (!resource) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-mutedgrey mx-auto" />
        <h2 className="text-xl font-bold text-navy">Medical Resource Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested campus resource ID does not exist in the active directory.
        </p>
        <Link
          to="/resources"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-medblue text-white rounded-lg text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Directory</span>
        </Link>
      </div>
    );
  }

  const handleShowOnMap = () => {
    setSelectedResourceId(resource.id);
    navigate('/map');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/resources"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShowOnMap}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-navy hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-medteal" />
            <span>Locate on Map</span>
          </button>

          <Link
            to={`/report?resource_id=${resource.id}`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy font-bold text-xs transition-colors"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-amberwarn" />
            <span>Report Shortage</span>
          </Link>
        </div>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header Block */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                resource.status === 'available'
                  ? 'bg-mint text-emerald-800'
                  : resource.status === 'under_maintenance'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {resource.status.replace('_', ' ')}
            </span>
            <span className="text-xs text-mutedgrey font-medium">
              Zone: {resource.map_coords.zone} Campus
            </span>
            <span className="text-xs text-mutedgrey">•</span>
            <span className="text-xs text-mutedgrey font-mono">
              ID: {resource.id.toUpperCase()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-navy tracking-tight">
            {resource.name}
          </h1>

          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            {resource.description}
          </p>
        </div>

        {/* Location & Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Location Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-mutedgrey flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-medblue" />
              <span>Exact Location</span>
            </div>
            <div className="text-sm font-bold text-navy">{resource.building}</div>
            <div className="text-xs text-slate-600 font-medium">{resource.floor}</div>
            <p className="text-xs text-slate-500 pt-1 leading-relaxed border-t border-slate-200/60">
              {resource.location_description}
            </p>
          </div>

          {/* Opening Hours Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-mutedgrey flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-medteal" />
              <span>Operational Hours</span>
            </div>
            <div className="text-sm font-bold text-navy">{resource.opening_hours}</div>
            <p className="text-xs text-slate-500 pt-1 leading-relaxed border-t border-slate-200/60">
              Access rules: Open to students and staff. Out-of-hours badge access supported where configured.
            </p>
          </div>

          {/* Verified Contact Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-mutedgrey flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emergency" />
              <span>Verified Desk Contact</span>
            </div>
            {resource.contact_number ? (
              <>
                <div className="text-base font-black text-navy font-mono">
                  {resource.contact_number}
                </div>
                <a
                  href={`tel:${resource.contact_number.replace(/[^\d+]/g, '')}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-medblue text-white text-xs font-bold hover:bg-medblue-600 transition-colors mt-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Station Now</span>
                </a>
              </>
            ) : (
              <p className="text-xs text-mutedgrey italic py-2">
                Campus emergency contact not configured. Contact your local emergency services.
              </p>
            )}
          </div>
        </div>

        {/* Accessibility & Physical Features */}
        <div className="p-5 rounded-2xl bg-medteal-50/40 border border-medteal/20 space-y-2.5">
          <h3 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-2">
            <Accessibility className="w-4 h-4 text-medteal" />
            <span>Accessibility & Physical Clearance</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {resource.accessibility_details}
          </p>
          <div className="flex flex-wrap gap-2 pt-1 text-xs font-medium">
            {resource.has_wheelchair_ramp && (
              <span className="px-2.5 py-1 rounded-md bg-white border border-medteal/30 text-emerald-800">
                ✓ ADA Wheelchair Ramp
              </span>
            )}
            {resource.has_elevator_access && (
              <span className="px-2.5 py-1 rounded-md bg-white border border-medteal/30 text-emerald-800">
                ✓ Elevator Direct Access
              </span>
            )}
          </div>
        </div>

        {/* Equipment Inventory Checklist */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-navy uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-medteal" />
              <span>Certified Equipment Inventory</span>
            </h3>
            <span className="text-xs text-mutedgrey">
              Last safety check: {new Date(resource.last_verified_at).toLocaleDateString()}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-navy font-bold uppercase tracking-wider text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Equipment Item</th>
                  <th className="py-2.5 px-3">Quantity</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Last Inspected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resource.equipment.map((eq) => (
                  <tr key={eq.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-semibold text-navy flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-medteal shrink-0" />
                      <span>{eq.equipment_name}</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{eq.quantity}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          eq.status === 'operational'
                            ? 'bg-mint text-emerald-800'
                            : eq.status === 'maintenance'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {eq.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {new Date(eq.last_checked_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification Footer Note */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-medteal" />
            <span>
              Verified by: <strong>{resource.verified_by}</strong> on{' '}
              {new Date(resource.last_verified_at).toLocaleString()}
            </span>
          </div>

          <Link
            to={`/report?resource_id=${resource.id}`}
            className="text-xs text-amber-700 hover:underline font-semibold"
          >
            Report discrepancy with this listing
          </Link>
        </div>
      </div>
    </div>
  );
};

