import React from 'react';
import { AlertTriangle, RotateCcw, Shield, User, Stethoscope } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { DEMO_DISCLAIMER } from '../../data/demoData';
import { UserRole } from '../../types';

export const DemoBanner: React.FC = () => {
  const { currentUser, switchUserRole, resetDemoData } = useAppStore();

  return (
    <div className="bg-navy text-warmwhite text-xs border-b border-navy-light px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono font-bold bg-amberwarn/20 text-amberwarn border border-amberwarn/40 uppercase tracking-wider text-[10px]">
            <AlertTriangle className="w-3 h-3 text-amberwarn" />
            Simulation Mode
          </span>
          <span className="text-slate-300 font-medium">
            {DEMO_DISCLAIMER}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-navy-light rounded-md p-0.5 border border-slate-700">
            <span className="text-[11px] text-mutedgrey px-2 hidden sm:inline">Role:</span>
            <button
              onClick={() => switchUserRole('student')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                currentUser.role === 'student'
                  ? 'bg-medblue text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-3 h-3" />
              Student
            </button>
            <button
              onClick={() => switchUserRole('staff')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                currentUser.role === 'staff'
                  ? 'bg-medteal text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Stethoscope className="w-3 h-3" />
              Medical Staff
            </button>
            <button
              onClick={() => switchUserRole('admin')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                currentUser.role === 'admin'
                  ? 'bg-slate-200 text-navy font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Shield className="w-3 h-3" />
              Admin
            </button>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset all demo data back to default initial state?')) {
                resetDemoData();
              }
            }}
            title="Reset demonstration data"
            className="flex items-center gap-1 text-slate-400 hover:text-amberwarn px-2 py-1 rounded transition-colors text-[11px]"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

