import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, PhoneCall, ShieldCheck, MapPin, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy text-slate-300 border-t border-navy-light pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-navy-light">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-medblue flex items-center justify-center text-white">
                <HeartPulse className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Med<span className="text-medblue">Route</span>
              </span>
            </div>
            <p className="text-sm text-slate-300 font-medium italic">
              "Help should never be hard to find."
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Smart campus medical assistance and emergency readiness platform. Designed to ensure
              every student, faculty member, and visitor can find verified first-aid stations,
              life-saving AEDs, and campus responders without delay.
            </p>
            <div className="flex items-center gap-2 text-xs text-medteal font-medium">
              <span className="w-2 h-2 rounded-full bg-medteal animate-ping" />
              <span>Campus Medical Registry Active (Demo Edition)</span>
            </div>
          </div>

          {/* Emergency & Quick Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Immediate Help
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/emergency"
                  className="text-emergency font-semibold hover:underline flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Emergency Protocols
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-white transition-colors flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-medblue" />
                  Campus Medical Map
                </Link>
              </li>
              <li>
                <Link to="/first-aid" className="hover:text-white transition-colors">
                  First-Aid Educational Hub
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-white transition-colors">
                  All Medical Facilities
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-white transition-colors text-amberwarn">
                  Report Resource Shortage
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Governance & Policies
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">
                  Privacy by Design
                </a>
              </li>
              <li>
                <a href="#accessibility" className="hover:text-white transition-colors">
                  Accessibility Standards (WCAG 2.1)
                </a>
              </li>
              <li>
                <a href="#verification" className="hover:text-white transition-colors">
                  Resource Verification Protocol
                </a>
              </li>
              <li>
                <a href="#community" className="hover:text-white transition-colors">
                  Community Health Guidelines
                </a>
              </li>
              <li>
                <a href="#compliance" className="hover:text-white transition-colors">
                  Campus Safety Compliance
                </a>
              </li>
            </ul>
          </div>

          {/* Emergency Helpline Box */}
          <div className="space-y-3 bg-navy-light/60 p-4 rounded-xl border border-navy-light">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-medteal" />
              Emergency Helpline
            </h4>
            <p className="text-[11px] text-slate-300">
              National Emergency (India): <strong className="text-white text-sm">112</strong>
            </p>
            <p className="text-[11px] text-slate-300">
              Campus Health Emergency: <strong className="text-white text-xs">+1 (555) 010-HELP</strong>
            </p>
            <div className="pt-1 border-t border-slate-700/60">
              <span className="text-[10px] text-amberwarn block leading-tight font-mono">
                Submitting online forms does not replace calling emergency services in life-threatening scenarios.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} MedRoute Platform. Built for the Smart Campus & Student Life Challenge.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Calm & Authoritative Health-Tech Architecture</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Zero False Emergency Guarantees</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

