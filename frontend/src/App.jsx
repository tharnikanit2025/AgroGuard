import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import FieldManagement from './pages/FieldManagement';
import DiseaseDetection from './pages/DiseaseDetection';
import ProgressionTracking from './pages/ProgressionTracking';
import EnvironmentalRisk from './pages/EnvironmentalRisk';
import HealthHistory from './pages/HealthHistory';
import AdvisoriesPage from './pages/AdvisoriesPage';
import { translations } from './services/translations';
import { api } from './services/api';

export default function App() {
  const [lang, setLang] = useState('en');
  const [currentTab, setCurrentTab] = useState('landing');
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [fields, setFields] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);

  const t = translations[lang] || translations.en;

  // Check auth and initial data
  const refreshAppData = async () => {
    try {
      const token = localStorage.getItem('agroguard_token');
      if (token) {
        try {
          const me = await api.getMe();
          setUser(me);
          if (currentTab === 'landing' || currentTab === 'auth') {
            setCurrentTab('dashboard');
          }
        } catch {
          // Token expired or invalid
          localStorage.removeItem('agroguard_token');
          setUser(null);
        }
      }

      // Fetch dashboard, fields, and alerts
      const [dash, fList, aList] = await Promise.all([
        api.getDashboard().catch(() => null),
        api.getFields().catch(() => []),
        api.getAlerts().catch(() => [])
      ]);

      if (dash) setDashboardData(dash);
      if (fList) setFields(fList);
      if (aList) setAlerts(aList);
    } catch (err) {
      console.error("Error refreshing app data:", err);
    }
  };

  useEffect(() => {
    refreshAppData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('agroguard_token');
    setUser(null);
    setCurrentTab('landing');
  };

  const handleAuthSuccess = (authUser) => {
    setUser(authUser);
    setCurrentTab('dashboard');
    refreshAppData();
  };

  const handleSelectFieldAction = (field, actionTab) => {
    setSelectedFieldId(field.field_id);
    setCurrentTab(actionTab);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Show Navbar on all views except Landing Page when not signed in */}
      {(currentTab !== 'landing' || user) && (
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          user={user}
          onLogout={handleLogout}
          alerts={alerts}
          lang={lang}
          setLang={setLang}
          t={t}
          onOpenAlerts={() => setCurrentTab('risk')}
        />
      )}

      {/* Main Content Area */}
      <main className={currentTab === 'landing' ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6'}>
        {currentTab === 'landing' && (
          <LandingPage
            onGetStarted={() => setCurrentTab(user ? 'dashboard' : 'auth')}
            onDemoLogin={async () => {
              try {
                const res = await api.demoLogin();
                localStorage.setItem('agroguard_token', res.access_token);
                handleAuthSuccess(res.user);
              } catch (err) {
                alert("Demo login error: " + err.message);
              }
            }}
            t={t}
            lang={lang}
          />
        )}

        {currentTab === 'auth' && (
          <AuthPage
            onAuthSuccess={handleAuthSuccess}
            t={t}
            lang={lang}
          />
        )}

        {currentTab === 'dashboard' && (
          <Dashboard
            dashboardData={dashboardData}
            onNavigate={(tab) => setCurrentTab(tab)}
            t={t}
            lang={lang}
            onSelectField={(field) => handleSelectFieldAction(field, 'detection')}
          />
        )}

        {currentTab === 'fields' && (
          <FieldManagement
            fields={fields}
            onFieldCreated={refreshAppData}
            onSelectFieldAction={handleSelectFieldAction}
            t={t}
            lang={lang}
          />
        )}

        {currentTab === 'detection' && (
          <DiseaseDetection
            fields={fields}
            selectedFieldId={selectedFieldId}
            onNavigate={(tab) => setCurrentTab(tab)}
            t={t}
            lang={lang}
          />
        )}

        {currentTab === 'progression' && (
          <ProgressionTracking
            fields={fields}
            onNavigate={(tab) => setCurrentTab(tab)}
            t={t}
            lang={lang}
          />
        )}

        {currentTab === 'risk' && (
          <EnvironmentalRisk
            fields={fields}
            onNavigate={(tab) => setCurrentTab(tab)}
            t={t}
            lang={lang}
          />
        )}

        {currentTab === 'history' && (
          <HealthHistory
            fields={fields}
            selectedFieldId={selectedFieldId}
            onNavigate={(tab) => setCurrentTab(tab)}
            t={t}
            lang={lang}
          />
        )}

        {currentTab === 'advisories' && (
          <AdvisoriesPage
            t={t}
            lang={lang}
          />
        )}
      </main>
    </div>
  );
}
