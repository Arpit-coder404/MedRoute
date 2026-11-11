import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HeartPulse,
  MapPin,
  BookOpen,
  AlertCircle,
  FileText,
  Bell,
  Menu,
  X,
  User,
  Shield,
  Stethoscope,
  ExternalLink,
  CheckCircle2,
  PhoneCall,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const { currentUser, notifications, markNotificationAsRead, markAllNotificationsAsRead } =
    useAppStore();

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: User },
    { label: 'Campus Map', path: '/map', icon: MapPin },
    { label: 'Resources', path: '/resources', icon: BookOpen },
    { label: 'First-Aid Hub', path: '/first-aid', icon: HeartPulse },
    { label: 'Requests', path: '/requests', icon: FileText },
    { label: 'Report Issue', path: '/report', icon: AlertCircle },
  ];

  if (currentUser.role === 'staff' || currentUser.role === 'admin') {
    navLinks.push({ label: 'Responder Desk', path: '/staff', icon: Stethoscope });
  }

  if (currentUser.role === 'admin') {
    navLinks.push({ label: 'Admin Ops', path: '/admin', icon: Shield });
  }

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-medblue flex items-center justify-center text-white shadow-md shadow-medblue/20 group-hover:bg-medblue-600 transition-colors">
                <HeartPulse className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-navy">
                    Med<span className="text-medblue">Route</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-medteal-50 text-medteal-600 border border-medteal/20">
                    Campus
                  </span>
                </div>
                <span className="text-[11px] text-mutedgrey -mt-0.5 hidden sm:block">
                  Help should never be hard to find
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-medblue-50 text-medblue font-semibold'
                        : 'text-charcoal/80 hover:text-navy hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-medblue' : 'text-mutedgrey'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons & Emergency Callout */}
          <div className="flex items-center gap-3">
            {/* Prominent Emergency Action */}
            <Link
              to="/emergency"
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emergency hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emergency/25 transition-all transform active:scale-95 animate-emergency-beacon"
              title="Urgent Campus Emergency Protocols & Assistance"
            >
              <PhoneCall className="w-4 h-4 stroke-[2.5]" />
              <span>EMERGENCY</span>
            </Link>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-navy hover:bg-slate-100 transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emergency text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-elevated border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-navy">Notifications</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                        Simulated
                      </span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-medblue hover:underline font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-mutedgrey">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.slice(0, 6).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            setNotifOpen(false);
                          }}
                          className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                            !n.read_at ? 'bg-medblue-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              {!n.read_at && (
                                <span className="w-2 h-2 rounded-full bg-medblue shrink-0" />
                              )}
                              <h4 className="text-xs font-semibold text-navy">{n.title}</h4>
                            </div>
                            <span className="text-[10px] text-mutedgrey shrink-0">
                              {new Date(n.created_at).toLocaleDateString([], {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                          {n.link && (
                            <Link
                              to={n.link}
                              className="inline-flex items-center gap-1 text-[11px] text-medblue font-medium mt-1.5 hover:underline"
                            >
                              <span>View details</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar / Link */}
            <Link
              to="/profile"
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-navy"
              title={`Logged in as ${currentUser.full_name} (${currentUser.role})`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-xs text-navy">
                {currentUser.full_name.charAt(0)}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-semibold text-navy leading-none">
                  {currentUser.full_name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-mutedgrey capitalize">
                  {currentUser.role}
                </span>
              </div>
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          <div className="py-2 border-b border-slate-100 mb-2">
            <div className="text-xs font-medium text-mutedgrey">Signed in as</div>
            <div className="text-sm font-bold text-navy">{currentUser.full_name}</div>
            <div className="text-xs text-medteal font-semibold capitalize">{currentUser.role} Role</div>
          </div>

          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? 'bg-medblue-50 text-medblue font-semibold'
                    : 'text-charcoal hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-medblue' : 'text-mutedgrey'}`} />
                {item.label}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-100">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-charcoal hover:bg-slate-100"
            >
              <User className="w-5 h-5 text-mutedgrey" />
              User Profile & Consent
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

