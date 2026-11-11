import React from 'react';
import { Link } from 'react-router-dom';
import {
  PhoneCall,
  AlertOctagon,
  ShieldAlert,
  MapPin,
  HeartPulse,
  Compass,
  FileText,
  AlertTriangle,
  ArrowRight,
  Info,
} from 'lucide-react';
import { UrgentContactsCard } from '../../components/emergency/UrgentContactsCard';
import { AssistanceRequestForm } from '../../components/emergency/AssistanceRequestForm';

export const EmergencyPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Title & Emergency Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emergency uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emergency animate-ping" />
              EMERGENCY READINESS DISPATCH
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-emergency font-bold font-mono">
              PRIORITY ZERO
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-navy tracking-tight mt-1">
            Campus Emergency Response Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            "Know where to go. Know who to contact. Get connected to the right campus medical resources."
          </p>
        </div>

        <Link
          to="/map"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors"
        >
          <Compass className="w-4 h-4 text-medteal" />
          <span>Interactive Campus Map</span>
        </Link>
      </div>

      {/* 1. Urgent Contacts & Verified Helplines (Top Priority) */}
      <section className="space-y-4">
        <UrgentContactsCard />
      </section>

      {/* 2. Immediate Action Campus Procedures */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-navy uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emergency" />
          <span>Campus Immediate Emergency Protocol</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-navy text-sm flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-navy text-white text-[11px] flex items-center justify-center font-mono">
                1
              </span>
              <span>Assess & Call</span>
            </div>
            <p className="leading-relaxed">
              Verify if the scene is safe. Check for responsiveness and breathing. If the victim is unresponsive or bleeding heavily, <strong>dial 112</strong> immediately.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-navy text-sm flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-navy text-white text-[11px] flex items-center justify-center font-mono">
                2
              </span>
              <span>Shout for Nearby AED</span>
            </div>
            <p className="leading-relaxed">
              Loudly call for someone to fetch the nearest <strong>Automated External Defibrillator (AED)</strong> and notify the Building Proctor. Start hands-only CPR if trained.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-navy text-sm flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-navy text-white text-[11px] flex items-center justify-center font-mono">
                3
              </span>
              <span>Clear Ambulance Route</span>
            </div>
            <p className="leading-relaxed">
              Dispatch a bystander to the building entrance to wave down arriving emergency personnel and hold elevators.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Non-Emergency Assistance Request Workflow */}
      <section className="space-y-4 pt-2">
        <AssistanceRequestForm />
      </section>
    </div>
  );
};

