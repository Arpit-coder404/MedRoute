import React, { useState } from 'react';
import {
  User,
  Shield,
  Phone,
  Mail,
  Building,
  Heart,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Check,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { UserRole } from '../../types';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateUserProfile, switchUserRole, resetDemoData } = useAppStore();

  const [fullName, setFullName] = useState(currentUser.full_name);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [department, setDepartment] = useState(currentUser.department || '');
  const [emergencyContactName, setEmergencyContactName] = useState(
    currentUser.emergency_contact?.name || 'Elena Rivera'
  );
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(
    currentUser.emergency_contact?.phone || '+1 (555) 019-9942'
  );
  const [emergencyContactRel, setEmergencyContactRel] = useState(
    currentUser.emergency_contact?.relationship || 'Mother'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      full_name: fullName.trim(),
      phone: phone.trim(),
      department: department.trim(),
      emergency_contact: {
        name: emergencyContactName.trim(),
        phone: emergencyContactPhone.trim(),
        relationship: emergencyContactRel.trim(),
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-medblue uppercase tracking-wider">
              USER IDENTITY & PRIVACY
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-medblue-50 text-medblue font-bold uppercase tracking-wider">
              {currentUser.role} Account
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mt-1">
            Account Profile & Emergency Contact
          </h1>
          <p className="text-xs sm:text-sm text-mutedgrey mt-0.5">
            Manage your campus profile, authorized role, and emergency kin contact.
          </p>
        </div>

        {/* Demo Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm('Reset all demo data back to default?')) {
                resetDemoData();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-600 hover:text-amberwarn hover:border-amberwarn transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-mint text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Profile changes saved successfully to local storage.</span>
        </div>
      )}

      {/* Role Switcher Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-medblue" />
          <span>Simulation Role Persona Switcher</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Switch roles instantly to inspect the platform from a Student, Campus Medical Staff, or Safety Administrator perspective.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {[
            {
              role: 'student' as UserRole,
              title: 'Alex Rivera (Student)',
              sub: 'Bio-Engineering Year 3',
              badge: 'Student View',
            },
            {
              role: 'staff' as UserRole,
              title: 'Dr. Priya Sharma (Staff)',
              sub: 'Chief Medical Officer',
              badge: 'Responder Desk',
            },
            {
              role: 'admin' as UserRole,
              title: 'Marcus Vance (Admin)',
              sub: 'Safety Infrastructure Dir.',
              badge: 'Admin Analytics',
            },
          ].map((persona) => (
            <button
              key={persona.role}
              onClick={() => switchUserRole(persona.role)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                currentUser.role === persona.role
                  ? 'bg-medblue-50/80 border-medblue text-navy ring-2 ring-medblue/20'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-medblue">
                  {persona.badge}
                </span>
                {currentUser.role === persona.role && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-medblue" />
                )}
              </div>
              <div className="font-bold text-xs mt-1">{persona.title}</div>
              <div className="text-[11px] text-mutedgrey">{persona.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-navy uppercase tracking-wider">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-navy uppercase tracking-wider mb-1">
              Full Legal Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-navy focus:outline-none focus:border-medblue"
            />
          </div>

          <div>
            <label className="block font-bold text-navy uppercase tracking-wider mb-1">
              Campus Email (Verified)
            </label>
            <input
              type="email"
              disabled
              value={currentUser.email}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-mono cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-bold text-navy uppercase tracking-wider mb-1">
              Contact Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-navy focus:outline-none focus:border-medblue"
            />
          </div>

          <div>
            <label className="block font-bold text-navy uppercase tracking-wider mb-1">
              Academic Department / Unit
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-navy focus:outline-none focus:border-medblue"
            />
          </div>
        </div>

        {/* Emergency Kin Contact */}
        <div className="pt-4 border-t border-slate-100 space-y-4 text-xs">
          <div>
            <h4 className="font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-emergency" />
              <span>Next of Kin Emergency Contact</span>
            </h4>
            <p className="text-[11px] text-mutedgrey mt-0.5">
              Contacted only in the event of an urgent medical hospitalization on campus.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Name</label>
              <input
                type="text"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-navy"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Relationship</label>
              <input
                type="text"
                value={emergencyContactRel}
                onChange={(e) => setEmergencyContactRel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-navy"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Emergency Phone</label>
              <input
                type="tel"
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-navy"
              />
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
          <Lock className="w-4 h-4 text-medteal shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-navy font-bold">Privacy by Design Principles:</strong>
            <p className="leading-relaxed">
              MedRoute stores no confidential health diagnoses or medical prescriptions in plaintext. Contact numbers are utilized solely by authorized campus health personnel for active assistance incidents.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-medblue hover:bg-medblue-600 text-white font-bold text-xs shadow-md transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

