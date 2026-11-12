import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Bell, 
  Globe, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X,
  Sprout,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import RiskBadge from './RiskBadge';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  user, 
  onLogout, 
  alerts = [], 
  lang, 
  setLang, 
  t,
  onOpenAlerts
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);

  const unreadAlerts = alerts.filter(a => !a.is_read);

  const navItems = [
    { id: 'dashboard', label: t.navDashboard },
    { id: 'fields', label: t.navFields },
    { id: 'detection', label: t.navDetection },
    { id: 'progression', label: t.navProgression },
    { id: 'risk', label: t.navRisk },
    { id: 'history', label: t.navHistory },
    { id: 'advisories', label: t.navAdvisories },
  ];

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'ta' : 'en');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & College Credits */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-green-500 flex items-center justify-center shadow-md shadow-emerald-700/20 text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-950 via-emerald-800 to-green-700 bg-clip-text text-transparent">
                  {t.appName}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  CIT • KAIROS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block truncate max-w-xs">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2">
            {/* Bilingual Toggle */}
            <button
              onClick={toggleLanguage}
              title="Toggle English / தமிழ்"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
            >
              <Globe className="h-4 w-4 text-emerald-600" />
              <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setAlertsOpen(!alertsOpen)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadAlerts.length > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadAlerts.length}
                  </span>
                )}
              </button>

              {/* Alerts Dropdown Drawer */}
              {alertsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      {t.navAlerts} ({unreadAlerts.length})
                    </span>
                    <button
                      onClick={() => {
                        setAlertsOpen(false);
                        setCurrentTab('dashboard');
                      }}
                      className="text-xs text-emerald-700 font-semibold hover:underline"
                    >
                      {t.viewAll}
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {alerts.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        No alerts at this moment.
                      </div>
                    ) : (
                      alerts.slice(0, 5).map((a) => (
                        <div key={a.alert_id} className={`p-3 text-xs hover:bg-slate-50 ${!a.is_read ? 'bg-amber-50/40' : ''}`}>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-semibold text-slate-900 line-clamp-1">{a.title}</span>
                            <RiskBadge level={a.risk_level} size="sm" />
                          </div>
                          <p className="text-slate-600 line-clamp-2">{a.description}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Farmer Profile / Sign out */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-bold text-slate-800">{user.name}</div>
                  <div className="text-[10px] text-emerald-700 font-medium">{user.location || 'Tamil Nadu'}</div>
                </div>
                <button
                  onClick={onLogout}
                  title={t.logout}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentTab('auth')}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition-all"
              >
                {t.login}
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-100 grid grid-cols-2 gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg text-xs font-semibold text-left transition-colors ${
                  currentTab === item.id
                    ? 'bg-emerald-700 text-white'
                    : 'text-slate-700 hover:bg-emerald-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
