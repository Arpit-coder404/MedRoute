import React from 'react';
import { Compass, AlertTriangle, ShieldCheck, PhoneCall, Info } from 'lucide-react';
import { CampusMedicalMap } from '../../components/map/CampusMedicalMap';
import { Link } from 'react-router-dom';

export const MapPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Map Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-medblue uppercase tracking-wider">
              CAMPUS READINESS MAP
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-medteal-50 text-medteal font-semibold border border-medteal/20">
              Vector Campus Grid
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mt-1">
            Interactive Campus Medical Map
          </h1>
          <p className="text-xs sm:text-sm text-mutedgrey mt-0.5">
            Locate defibrillators (AEDs), first-aid wall hubs, eyewash stations, and accessible medical entrances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/emergency"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emergency text-white font-bold text-xs shadow-sm hover:bg-red-700 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency Help</span>
          </Link>
          <Link
            to="/report"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy font-bold text-xs transition-colors"
          >
            <span>Report Issue</span>
          </Link>
        </div>
      </div>

      {/* Main Map Component */}
      <CampusMedicalMap compact={false} />

      {/* Campus Map Guidance Note */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-medblue shrink-0" />
          <span>
            <strong>Simulated Vector Architecture:</strong> Campus pathways shown feature certified step-free gradients (&lt;1:12) suitable for wheelchairs and transport gurneys.
          </span>
        </div>
        <span className="text-[11px] text-mutedgrey font-mono shrink-0">
          Last Cartography Audit: Nov 2026
        </span>
      </div>
    </div>
  );
};

