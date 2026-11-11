import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  HeartPulse,
  User,
  Stethoscope,
  Shield,
  ArrowRight,
  Lock,
  Mail,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { UserRole } from '../../types';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const { switchUserRole, currentUser } = useAppStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handlePersonaLogin = (role: UserRole) => {
    switchUserRole(role);
    if (role === 'staff') {
      navigate('/staff');
    } else if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate(redirectPath);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In demo environment, switch to student role and direct to dashboard
    switchUserRole('student');
    navigate(redirectPath);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-medblue flex items-center justify-center text-white mx-auto shadow-md shadow-medblue/20">
          <HeartPulse className="w-7 h-7 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl font-black text-navy tracking-tight">
          Welcome to Med<span className="text-medblue">Route</span>
        </h1>
        <p className="text-xs text-mutedgrey">
          Campus Single Sign-On (SSO) & Demo Personas
        </p>
      </div>

      {/* 1-Click Fast Demo Login Personas */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-xs font-bold text-navy uppercase tracking-wider">
            Quick Demo Persona Access
          </h2>
          <span className="text-[10px] text-medteal font-mono font-bold">1-Click</span>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => handlePersonaLogin('student')}
            className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-medblue/60 hover:bg-medblue-50/40 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-medblue-50 text-medblue flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-navy group-hover:text-medblue">
                  Alex Rivera (Student)
                </div>
                <div className="text-[11px] text-mutedgrey">Bio-Engineering • MED-2024-8841</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => handlePersonaLogin('staff')}
            className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-medteal/60 hover:bg-medteal-50/40 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-medteal-50 text-medteal flex items-center justify-center font-bold">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-navy group-hover:text-medteal">
                  Dr. Priya Sharma (Medical Staff)
                </div>
                <div className="text-[11px] text-mutedgrey">Chief Medical Officer • Triage Desk</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => handlePersonaLogin('admin')}
            className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-navy hover:bg-slate-50 text-left transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-navy flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-navy">
                  Marcus Vance (Administrator)
                </div>
                <div className="text-[11px] text-mutedgrey">Safety Infrastructure Director</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Simulated Form Login */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex border-b border-slate-100 pb-3 text-xs font-bold">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 pb-2 text-center transition-colors ${
              !isSignUp ? 'border-b-2 border-medblue text-medblue' : 'text-slate-400'
            }`}
          >
            Campus SSO Login
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 pb-2 text-center transition-colors ${
              isSignUp ? 'border-b-2 border-medblue text-medblue' : 'text-slate-400'
            }`}
          >
            Register Student Card
          </button>
        </div>

        <form onSubmit={handleCustomSubmit} className="space-y-3.5 text-xs">
          {isSignUp && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-navy focus:outline-none focus:border-medblue"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Campus Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-mutedgrey" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="username@campus.edu"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-navy focus:outline-none focus:border-medblue"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-mutedgrey" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-navy focus:outline-none focus:border-medblue"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-medblue hover:bg-medblue-600 text-white font-bold transition-colors shadow-sm"
          >
            {isSignUp ? 'Register Campus Account' : 'Sign In with SSO'}
          </button>
        </form>
      </div>
    </div>
  );
};

