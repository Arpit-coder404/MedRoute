import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  MapPin,
  ShieldCheck,
  Zap,
  Cross,
  Pill,
  Truck,
  Accessibility,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Compass,
  FileCheck2,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const LandingPage: React.FC = () => {
  const { resources } = useAppStore();

  const totalVerified = resources.filter((r) => r.status === 'available').length;
  const aedCount = resources.filter((r) => r.resource_type === 'aed').length;
  const firstAidCount = resources.filter((r) => r.resource_type === 'first_aid').length;

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 bg-gradient-to-b from-warmwhite via-white to-warmwhite border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content (Asymmetrical Hero) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medblue-50 border border-medblue/20 text-medblue text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-medblue animate-pulse" />
                SMART CAMPUS HEALTH INFRASTRUCTURE
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-navy tracking-tight leading-[1.1]">
                When every second matters,{' '}
                <span className="text-medblue underline decoration-medteal decoration-4 underline-offset-4">
                  knowing where to go
                </span>{' '}
                matters more.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
                Find verified campus medical resources, locate first-aid facilities, and connect with
                authorized responders through one simple, accessible platform.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/resources"
                  className="px-6 py-3.5 rounded-xl bg-medblue hover:bg-medblue-600 text-white font-bold text-sm shadow-elevated transition-all flex items-center gap-2 group"
                >
                  <span>Explore Campus Resources</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/map"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-navy font-bold text-sm border border-slate-300 shadow-sm transition-all flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-medteal" />
                  <span>View Medical Map</span>
                </Link>

                <Link
                  to="/emergency"
                  className="px-4 py-3.5 rounded-xl text-emergency hover:bg-red-50 font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 border border-emergency/30"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Immediate Help</span>
                </Link>
              </div>

              {/* Verified Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-2xl font-black text-navy">{totalVerified} Active</div>
                  <div className="text-xs text-mutedgrey font-medium">Verified Facilities</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-600">{aedCount} Units</div>
                  <div className="text-xs text-mutedgrey font-medium">Monitored AEDs</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-medteal">{firstAidCount} Hubs</div>
                  <div className="text-xs text-mutedgrey font-medium">First-Aid Points</div>
                </div>
              </div>
            </div>

            {/* Right Graphic Preview (Interactive Architectural Preview) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none bg-navy rounded-2xl p-6 shadow-2xl border border-slate-700/60 overflow-hidden text-white">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-700/80 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emergency" />
                    <span className="w-3 h-3 rounded-full bg-amberwarn" />
                    <span className="w-3 h-3 rounded-full bg-medteal" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    CAMPUS_GRID_ACTIVE // v1.0
                  </span>
                </div>

                {/* Floating Mock Elements */}
                <div className="space-y-3.5">
                  {/* Floating Card 1: Medical Centre */}
                  <div className="bg-navy-light/90 border border-slate-700 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-lg transform hover:-translate-y-0.5 transition-transform">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emergency flex items-center justify-center text-white shrink-0">
                        <HeartPulse className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Campus Central Medical Centre</h4>
                        <p className="text-[11px] text-slate-300">Health Pavilion • 24/7 Triage</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-mint text-emerald-900">
                      OPEN
                    </span>
                  </div>

                  {/* Floating Card 2: AED */}
                  <div className="bg-navy-light/90 border border-slate-700 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-lg transform hover:-translate-y-0.5 transition-transform">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-white shrink-0">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Tagore Library Defibrillator (AED)</h4>
                        <p className="text-[11px] text-slate-300">2nd Floor Rotunda • Inspected Today</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono text-medteal font-bold">
                      VERIFIED
                    </span>
                  </div>

                  {/* Floating Card 3: First Aid */}
                  <div className="bg-navy-light/90 border border-slate-700 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-lg transform hover:-translate-y-0.5 transition-transform">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-medteal flex items-center justify-center text-white shrink-0">
                        <Cross className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Academic Block First-Aid Bay</h4>
                        <p className="text-[11px] text-slate-300">Aryabhata East • Floor 1</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">1.1m ADA Height</span>
                  </div>
                </div>

                {/* Map Mini Preview Banner */}
                <div className="mt-5 pt-4 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-medteal" />
                    <span>Real-time Interactive Campus Map</span>
                  </div>
                  <Link
                    to="/map"
                    className="text-medblue-200 hover:text-white font-bold flex items-center gap-1 text-[11px]"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Find Help Without Confusion */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-medblue uppercase tracking-wider">
            CAMPUS MEDICAL INFRASTRUCTURE
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-navy tracking-tight">
            Find Help Without Confusion
          </h2>
          <p className="text-sm text-slate-600">
            Campus medical resources are categorized with precision so you always know exactly what is available at each station.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Central Medical Centre',
              desc: 'Full-service campus healthcare clinic with doctor triage, minor injury observation beds, and direct medical transport.',
              icon: HeartPulse,
              link: '/resources/res_01',
              color: 'text-emergency bg-red-50 border-red-200',
            },
            {
              title: 'Public AED Stations',
              desc: 'Automated External Defibrillators in wall-mounted alarmed cabinets with clear voice instructions and CPR feedback.',
              icon: Zap,
              link: '/resources?type=aed',
              color: 'text-amber-600 bg-amber-50 border-amber-200',
            },
            {
              title: 'First-Aid Wall Hubs',
              desc: 'Stocked trauma kits, sterile eyewash flacons, burn dressings, and cold compresses for sudden cuts and sprains.',
              icon: Cross,
              link: '/resources?type=first_aid',
              color: 'text-medteal bg-medteal-50 border-medteal-200',
            },
            {
              title: 'Campus Pharmacy',
              desc: 'Dispensary for prescription meds, oral rehydration salts, fever reducers, and medical replenishment.',
              icon: Pill,
              link: '/resources/res_05',
              color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
            },
            {
              title: 'Ambulance Access Bays',
              desc: 'Designated rapid perimeter turnaround bays cleared for emergency medical vehicles without gate delays.',
              icon: Truck,
              link: '/resources/res_09',
              color: 'text-navy bg-slate-100 border-slate-300',
            },
            {
              title: 'Accessible Entrances',
              desc: 'Step-free gentle slope ramps, wide sensor doors, and power transit wheelchair depots across major blocks.',
              icon: Accessibility,
              link: '/resources/res_11',
              color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.link}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 hover:border-medblue/40 shadow-sm hover:shadow-elevated transition-all flex flex-col justify-between group text-left"
              >
                <div className="space-y-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border ${item.color} group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <h3 className="text-base font-bold text-navy group-hover:text-medblue transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
                <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-medblue">
                  <span>Explore Locations</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Section 2: How MedRoute Works */}
      <section className="bg-navy text-white py-16 sm:py-20 border-y border-navy-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold text-medteal uppercase tracking-wider">
              OPERATIONAL WORKFLOW
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">How MedRoute Works</h2>
            <p className="text-sm text-slate-300">
              Three streamlined steps to eliminate confusion when health assistance is required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Find the Appropriate Medical Resource',
                desc: 'Locate the nearest first-aid kit, AED cabinet, or the Central Medical Centre using our interactive campus vector map or filterable directory.',
                badge: 'Instant Discovery',
              },
              {
                step: '02',
                title: 'Check Verified Location & Equipment',
                desc: 'Review exact floor numbers, ADA accessibility, opening hours, verified staff contact numbers, and equipment inventory check dates.',
                badge: 'Verified Data',
              },
              {
                step: '03',
                title: 'Contact Personnel or Request Assistance',
                desc: 'Make a direct phone call, access educational first-aid instructions, or submit an assistance request coordinate with campus medical responders.',
                badge: 'Fast Coordination',
              },
            ].map((step) => (
              <div
                key={step.step}
                className="bg-navy-light/70 border border-slate-700/80 rounded-2xl p-6 sm:p-7 relative flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black font-mono text-medteal">{step.step}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-navy border border-slate-700 text-slate-300">
                      {step.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">{step.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Campus Readiness & Community Reporting */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-medblue-50/60 to-mint/40 rounded-3xl border border-slate-200 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-medteal uppercase tracking-wider">
                COMMUNITY HEALTH READINESS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy">
                Help Keep Campus Medical Infrastructure Verified
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Found an empty bandage drawer? Noticed an unsealed AED cabinet or a damaged accessibility ramp? MedRoute empowers every student and faculty member to report maintenance issues directly to the campus health operations team.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/report"
                  className="px-5 py-2.5 rounded-xl bg-navy hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors flex items-center gap-2"
                >
                  <FileCheck2 className="w-4 h-4 text-amberwarn" />
                  <span>Report Resource Issue</span>
                </Link>
                <Link
                  to="/first-aid"
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-navy font-bold text-xs sm:text-sm border border-slate-300 shadow-sm transition-colors flex items-center gap-2"
                >
                  <HeartPulse className="w-4 h-4 text-medblue" />
                  <span>Browse First-Aid Guides</span>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-navy flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-medteal" />
                <span>Our Safety Verification Principles</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-medteal shrink-0 mt-0.5" />
                  <span><strong>Zero Simulated Readiness:</strong> Resources are marked "Unverified" unless inspected by safety officers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-medteal shrink-0 mt-0.5" />
                  <span><strong>Privacy by Default:</strong> No student medical records or real-time tracking without explicit permission.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-medteal shrink-0 mt-0.5" />
                  <span><strong>Accessible First:</strong> All routes specify wheelchair ramp slopes and elevator availability.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

