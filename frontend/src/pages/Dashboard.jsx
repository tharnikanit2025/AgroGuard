import React from 'react';
import { 
  Sprout, 
  Activity, 
  AlertTriangle, 
  CloudRain, 
  ArrowUpRight, 
  Plus, 
  Search, 
  Clock, 
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Thermometer,
  Droplets
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar 
} from 'recharts';
import RiskBadge from '../components/RiskBadge';
import LeafletMap from '../components/LeafletMap';
import { api } from '../services/api';

export default function Dashboard({ 
  dashboardData, 
  onNavigate, 
  t, 
  lang,
  onSelectField 
}) {
  if (!dashboardData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
      </div>
    );
  }

  const { stats, recent_observations = [], recent_alerts = [], field_summaries = [] } = dashboardData;

  // Realistic sample environmental risk trend data for Recharts
  const riskTrendData = [
    { day: 'Mon', riskScore: 32, humidity: 72, temp: 28 },
    { day: 'Tue', riskScore: 45, humidity: 79, temp: 27 },
    { day: 'Wed', riskScore: 78, humidity: 88, temp: 25 }, // High humidity trigger
    { day: 'Thu', riskScore: 74, humidity: 85, temp: 26 },
    { day: 'Fri', riskScore: 58, humidity: 78, temp: 29 },
    { day: 'Sat', riskScore: 42, humidity: 74, temp: 30 },
    { day: 'Sun', riskScore: 38, humidity: 70, temp: 31 }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.15),transparent_70%)] pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/50 border border-emerald-500/30 text-emerald-200 text-xs font-semibold mb-3">
            <Sprout className="h-3.5 w-3.5" />
            <span>Paddy Health Overview • Tamil Nadu Cauvery Delta</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Digital Crop Health & Early Warning Command
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Monitor real-time leaf pathology, inspect micro-climatic blast & blight risk curves, and track disease progression across all registered paddy blocks.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('detection')}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs shadow-md hover:bg-emerald-50 flex items-center gap-2 transition-all"
            >
              <Search className="h-4 w-4 text-emerald-700" />
              <span>{t.quickAnalyze}</span>
            </button>
            <button
              onClick={() => onNavigate('progression')}
              className="px-4 py-2.5 rounded-xl bg-emerald-700/60 hover:bg-emerald-700 text-white font-semibold text-xs border border-emerald-500/30 flex items-center gap-2 transition-all"
            >
              <Layers className="h-4 w-4" />
              <span>{t.navProgression}</span>
            </button>
            <button
              onClick={() => onNavigate('fields')}
              className="px-4 py-2.5 rounded-xl bg-emerald-700/60 hover:bg-emerald-700 text-white font-semibold text-xs border border-emerald-500/30 flex items-center gap-2 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add Field</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-emerald-100/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t.statsTotalFields}</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sprout className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">{stats.total_fields}</div>
          <div className="mt-1 text-[11px] text-emerald-700 font-medium">Tamil Nadu Paddy Ecosystem</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t.statsObservations}</span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">{stats.total_observations}</div>
          <div className="mt-1 text-[11px] text-blue-700 font-medium">With Grad-CAM AI Maps</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t.statsActiveAlerts}</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">{stats.active_disease_alerts}</div>
          <div className="mt-1 text-[11px] text-amber-700 font-medium">Requires Farmer Action</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t.statsElevatedRisk}</span>
            <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <CloudRain className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">{stats.elevated_risk_fields}</div>
          <div className="mt-1 text-[11px] text-rose-700 font-medium">Weather Epidemic Threat</div>
        </div>
      </div>

      {/* Main Grid: Interactive Map & Environmental Risk Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Geographical Field Risk Map (Left 2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {t.fieldRiskOverview}
              </h3>
              <p className="text-xs text-slate-500">
                Geospatial distribution of registered paddy fields in Tamil Nadu with risk pins
              </p>
            </div>
            <button
              onClick={() => onNavigate('fields')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Manage Fields</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <LeafletMap fields={field_summaries} onSelectField={onSelectField} />
        </div>

        {/* Environmental Micro-Climatic Risk Chart (Right 1 col) */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-base text-slate-900">
                Epidemic Risk Trend
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                7-Day Window
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Micro-climatic composite disease pressure curve (% Risk Score)
            </p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riskTrendData}>
                  <defs>
                    <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="riskScore" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#riskGrad)" name="Risk Score %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <div>
                <span className="text-[10px] text-slate-400 block">Peak Humidity</span>
                <span className="font-bold text-slate-800">88% (Wed)</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-amber-500" />
              <div>
                <span className="text-[10px] text-slate-400 block">Avg Temp</span>
                <span className="font-bold text-slate-800">28.4 °C</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Disease Reports & Early Warning Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Disease Observations with Grad-CAM preview */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {t.recentObservations}
              </h3>
              <p className="text-xs text-slate-500">
                Latest leaf diagnostics with explainable Grad-CAM heatmaps
              </p>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>{t.navHistory}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3.5">
            {recent_observations.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No observation records uploaded yet.</p>
            ) : (
              recent_observations.slice(0, 4).map((obs) => (
                <div 
                  key={obs.observation_id}
                  className="flex items-center gap-3.5 p-3 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all cursor-pointer"
                  onClick={() => onNavigate('progression')}
                >
                  <img
                    src={api.imageUrl(obs.heatmap_path || obs.image_path)}
                    alt={obs.predicted_class}
                    className="h-14 w-14 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-slate-900 truncate">
                        {lang === 'ta' && obs.tamil_name ? obs.tamil_name : obs.predicted_class}
                      </h4>
                      <RiskBadge level={obs.severity === 'Severe' ? 'High' : (obs.severity === 'Moderate' ? 'Moderate' : 'Low')} size="sm" />
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      Field: <span className="font-semibold text-slate-700">{obs.field_name}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                      <span>Confidence: {Math.round(obs.confidence * 100)}%</span>
                      <span>•</span>
                      <span>{new Date(obs.observation_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Early Warning Alerts List */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {t.activeWarnings}
              </h3>
              <p className="text-xs text-slate-500">
                Adaptive notifications based on pathogen thresholds & weather
              </p>
            </div>
            <button
              onClick={() => onNavigate('risk')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>{t.navRisk}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {recent_alerts.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No active alerts. All fields within normal thresholds.</p>
            ) : (
              recent_alerts.slice(0, 4).map((alert) => (
                <div 
                  key={alert.alert_id} 
                  className={`p-3.5 rounded-2xl border ${
                    alert.risk_level === 'High' 
                      ? 'border-rose-200 bg-rose-50/40' 
                      : 'border-amber-200 bg-amber-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-xs text-slate-900 line-clamp-1">{alert.title}</span>
                    <RiskBadge level={alert.risk_level} size="sm" />
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{alert.description}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Field: {alert.field_name || 'All Paddy Plots'}</span>
                    <span>{new Date(alert.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
