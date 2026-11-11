import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  AlertCircle,
  Send,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { RequestCategory } from '../../types';

export const AssistanceRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, createAssistanceRequest } = useAppStore();

  const [category, setCategory] = useState<RequestCategory>('first_aid');
  const [description, setDescription] = useState('');
  const [campusLocation, setCampusLocation] = useState('');
  const [building, setBuilding] = useState('Tagore Central Library');
  const [floor, setFloor] = useState('1st Floor');
  const [contactPreference, setContactPreference] = useState<'phone' | 'email' | 'in_person'>('phone');
  const [contactNumber, setContactNumber] = useState(currentUser.phone || '');
  const [shareConsent, setShareConsent] = useState(true);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg('Please describe what medical assistance is needed.');
      return;
    }
    if (!campusLocation.trim()) {
      setErrorMsg('Please specify the exact spot or room on campus.');
      return;
    }

    const newId = createAssistanceRequest({
      request_category: category,
      description: description.trim(),
      campus_location: campusLocation.trim(),
      building,
      floor,
      contact_preference: contactPreference,
      contact_number: contactNumber.trim(),
      share_location_consent: shareConsent,
    });

    setSubmittedId(newId);
    setErrorMsg(null);
  };

  const campusBuildings = [
    'Tagore Central Library',
    'Health & Wellness Pavilion (Medical Centre)',
    'Aryabhata Academic Hall',
    'C.V. Raman Science Complex',
    'Alan Turing Engineering Hub',
    'Olympic Sports Arena & Courts',
    'Student Services Center / Union',
    'Nelson Mandela Residence Hall',
    'Kalam Residence Block C',
    'North Perimeter Gatehouse',
    'Great Lawn Central Pavilion',
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-6">
        <div className="w-10 h-10 rounded-xl bg-medblue-50 text-medblue flex items-center justify-center font-bold">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-navy">Non-Emergency Campus Assistance Request</h3>
          <p className="text-xs text-mutedgrey">
            For medical coordination, wheelchair escorts, first-aid station checkups, or general assistance
          </p>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amberwarn/40 text-xs text-amber-900 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amberwarn shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold">CRITICAL NOTICE:</strong>
          <p className="leading-relaxed">
            Submitting this form <strong>does not guarantee immediate assistance</strong> and is not actively monitored like a 911 dispatch. For genuine emergencies or severe injuries, call <strong>112</strong> or the Campus Triage directly at <strong>+1 (555) 010-HELP</strong>.
          </p>
        </div>
      </div>

      {submittedId ? (
        <div className="p-6 rounded-xl bg-mint/40 border border-emerald-300 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-medteal text-white flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base font-bold text-navy">
              Assistance Request Logged: #{submittedId.toUpperCase()}
            </h4>
            <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
              Your request has been filed in the campus queue. Authorized campus medical personnel can review and update its triage status.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/requests')}
              className="px-4 py-2 rounded-lg bg-medblue text-white text-xs font-semibold hover:bg-medblue-600"
            >
              Track Request Status
            </button>
            <button
              onClick={() => {
                setSubmittedId(null);
                setDescription('');
                setCampusLocation('');
              }}
              className="px-4 py-2 rounded-lg bg-slate-100 text-navy text-xs font-semibold hover:bg-slate-200"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
              {errorMsg}
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
              Assistance Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'first_aid', label: 'First-Aid Support' },
                { id: 'directions', label: 'Mobility / Escort' },
                { id: 'facility_info', label: 'Facility Inquiries' },
                { id: 'equipment_issue', label: 'Kit Refill Inquiry' },
                { id: 'other', label: 'Other Support' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id as RequestCategory)}
                  className={`px-3 py-2 text-xs rounded-lg font-medium border text-left transition-all ${
                    category === c.id
                      ? 'bg-medblue text-white border-medblue font-semibold shadow-sm'
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
              Description of Need
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., Mild allergic reaction to pollen, need eye drops and assessment; or sprained wrist in common room..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-medblue text-charcoal placeholder:text-mutedgrey"
            />
          </div>

          {/* Campus Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                Campus Building
              </label>
              <select
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-medblue bg-white text-navy"
              >
                {campusBuildings.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                Floor / Wing
              </label>
              <input
                type="text"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder="e.g. 2nd Floor, Room 204"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-medblue text-navy"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                Specific Landmark / Spot
              </label>
              <input
                type="text"
                value={campusLocation}
                onChange={(e) => setCampusLocation(e.target.value)}
                placeholder="e.g. Near West elevators"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-medblue text-navy"
              />
            </div>
          </div>

          {/* Contact Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
                Preferred Contact Method
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'phone', label: 'Phone Call', icon: Phone },
                  { id: 'email', label: 'Email', icon: Mail },
                  { id: 'in_person', label: 'In Person', icon: UserCheck },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setContactPreference(m.id as any)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs rounded-lg border transition-all ${
                        contactPreference === m.id
                          ? 'bg-medblue text-white border-medblue font-semibold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                Your Contact Phone
              </label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-medblue text-navy"
              />
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start gap-2.5 pt-2">
            <input
              type="checkbox"
              id="consent"
              checked={shareConsent}
              onChange={(e) => setShareConsent(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-medblue focus:ring-medblue border-slate-300"
            />
            <label htmlFor="consent" className="text-xs text-slate-600 leading-normal">
              I consent to sharing my specified campus location and contact number with authorized campus health officers for the sole purpose of coordinating this assistance request.
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-medblue hover:bg-medblue-600 text-white font-bold text-sm shadow-md shadow-medblue/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Submit Assistance Request</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

