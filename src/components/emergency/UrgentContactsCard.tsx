import React, { useState } from 'react';
import {
  PhoneCall,
  Copy,
  Check,
  ShieldAlert,
  MapPin,
  Share2,
  AlertOctagon,
  ExternalLink,
  Info,
} from 'lucide-react';

export const UrgentContactsCard: React.FC = () => {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [locationConsentGiven, setLocationConsentGiven] = useState(false);
  const [locationCoords, setLocationCoords] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const copyToClipboard = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationCoords({
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5)),
          accuracy: Math.round(pos.coords.accuracy),
        });
        setLocationConsentGiven(true);
        setLocationError(null);
      },
      (err) => {
        setLocationError(
          err.message || 'Location permission was denied. You may manually type your building location.'
        );
      },
      { timeout: 8000 }
    );
  };

  const emergencyContacts = [
    {
      title: 'National Emergency Dispatch',
      badge: 'Immediate Life Threat',
      number: '112',
      telLink: 'tel:112',
      subtitle: 'Police, Fire, Municipal Ambulance Services (India / Universal)',
      verified: true,
      primary: true,
    },
    {
      title: 'Campus Medical Centre 24/7 Triage',
      badge: 'Campus Urgent Care',
      number: '+1 (555) 010-HELP',
      telLink: 'tel:+15550104357',
      subtitle: 'Health & Wellness Pavilion Ground Floor Triage Unit',
      verified: true,
      primary: false,
    },
    {
      title: 'Campus Safety & Rapid Patrol',
      badge: 'Security Dispatch',
      number: '+1 (555) 010-SAFE',
      telLink: 'tel:+15550107233',
      subtitle: 'First-responder escort, gate clearance & defibrillator escort',
      verified: true,
      primary: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Critical Alert Warning Header */}
      <div className="bg-red-500/10 border-2 border-emergency/40 rounded-2xl p-5 text-charcoal">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emergency text-white flex items-center justify-center shrink-0 shadow-emergency">
            <AlertOctagon className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-navy tracking-tight">
              Need Urgent Medical Assistance?
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              If someone is unresponsive, choking, having severe chest pain, or bleeding heavily,{' '}
              <strong className="text-emergency">CALL IMMEDIATELY</strong>. Do not wait for online form acknowledgements.
            </p>
          </div>
        </div>
      </div>

      {/* Official Verified Numbers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {emergencyContacts.map((contact) => (
          <div
            key={contact.number}
            className={`rounded-xl border p-4 flex flex-col justify-between transition-all ${
              contact.primary
                ? 'bg-emergency text-white border-red-600 shadow-md'
                : 'bg-white border-slate-200 text-charcoal shadow-sm'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-1">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    contact.primary
                      ? 'bg-white/20 text-white'
                      : 'bg-medblue-50 text-medblue'
                  }`}
                >
                  {contact.badge}
                </span>
                <span
                  className={`text-[10px] font-mono font-medium ${
                    contact.primary ? 'text-red-100' : 'text-medteal-600'
                  }`}
                >
                  ✓ Verified
                </span>
              </div>

              <div>
                <h3
                  className={`text-sm font-bold ${
                    contact.primary ? 'text-white' : 'text-navy'
                  }`}
                >
                  {contact.title}
                </h3>
                <p
                  className={`text-xs mt-0.5 leading-tight ${
                    contact.primary ? 'text-red-100' : 'text-mutedgrey'
                  }`}
                >
                  {contact.subtitle}
                </p>
              </div>

              <div
                className={`text-2xl font-black tracking-tight font-mono py-1 ${
                  contact.primary ? 'text-white' : 'text-navy'
                }`}
              >
                {contact.number}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100/30 mt-2">
              <a
                href={contact.telLink}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs shadow-sm transition-all ${
                  contact.primary
                    ? 'bg-white text-emergency hover:bg-slate-100'
                    : 'bg-medblue text-white hover:bg-medblue-600'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>

              <button
                onClick={() => copyToClipboard(contact.number)}
                className={`p-2 rounded-lg border text-xs transition-colors ${
                  contact.primary
                    ? 'border-white/30 text-white hover:bg-white/10'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                title="Copy number"
              >
                {copiedNumber === contact.number ? (
                  <Check className="w-4 h-4 text-emerald-300" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Explicit Location Sharing Consent Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-navy flex items-center gap-2">
              <MapPin className="w-4 h-4 text-medblue" />
              <span>Precise Emergency Location Sharing</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              Privacy by Design: MedRoute never accesses your GPS location in the background. Location coordinates are only read upon your explicit consent to help campus responders locate you faster.
            </p>
          </div>

          <button
            onClick={handleRequestLocation}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              locationConsentGiven
                ? 'bg-mint text-emerald-800 border border-emerald-300'
                : 'bg-slate-100 hover:bg-slate-200 text-navy'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{locationConsentGiven ? 'Location Acquired' : 'Share My Coordinates'}</span>
          </button>
        </div>

        {locationCoords && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-navy">
              Latitude: <strong>{locationCoords.lat}°</strong>, Longitude: <strong>{locationCoords.lng}°</strong> (±{locationCoords.accuracy}m)
            </span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Verified & ready to attach to requests
            </span>
          </div>
        )}

        {locationError && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
            {locationError}
          </div>
        )}
      </div>
    </div>
  );
};

