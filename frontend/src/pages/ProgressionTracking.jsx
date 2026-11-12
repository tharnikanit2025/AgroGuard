import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  ArrowRight, 
  Calendar, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles,
  TrendingDown,
  TrendingUp,
  Minus
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import { api } from '../services/api';

export default function ProgressionTracking({ 
  fields = [], 
  onNavigate, 
  t, 
  lang 
}) {
  const [selectedFieldId, setSelectedFieldId] = useState(fields[0]?.field_id || 1);
  const [timeline, setTimeline] = useState([]);
  const [earlierId, setEarlierId] = useState('');
  const [recentId, setRecentId] = useState('');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load field history when selected field changes
  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await api.getFieldHistory(selectedFieldId);
        const obsList = (res.timeline || []).filter(item => item.type === 'observation');
        setTimeline(obsList);
        
        // Auto-select first two observations if available (earlier and recent)
        if (obsList.length >= 2) {
          // timeline is sorted desc (newest first)
          setRecentId(obsList[0].id);
          setEarlierId(obsList[obsList.length - 1].id);
        } else if (obsList.length === 1) {
          setRecentId(obsList[0].id);
          setEarlierId(obsList[0].id);
        }
      } catch (err) {
        console.error("Failed to load timeline for progression:", err);
      }
    }
    if (selectedFieldId) {
      loadHistory();
    }
  }, [selectedFieldId]);

  const handleCompare = async () => {
    if (!earlierId || !recentId) {
      setError("Please select both an earlier and recent observation to compare.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await api.compareObservations({
        earlier_observation_id: parseInt(earlierId),
        recent_observation_id: parseInt(recentId)
      });
      setComparison(res);
    } catch (err) {
      setError(err.message || "Comparison failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {t.progressionTitle}
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
          {t.progressionSubtitle}
        </p>
      </div>

      {/* Field & Observation Selectors */}
      <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              1. Select Rice Field
            </label>
            <select
              value={selectedFieldId}
              onChange={(e) => setSelectedFieldId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
            >
              {fields.map((f) => (
                <option key={f.field_id} value={f.field_id}>
                  {f.field_name} ({f.crop_variety || 'Paddy'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              2. {t.selectEarlier}
            </label>
            <select
              value={earlierId}
              onChange={(e) => setEarlierId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
            >
              <option value="">Choose Baseline Observation</option>
              {timeline.map((obs) => (
                <option key={obs.id} value={obs.id}>
                  {new Date(obs.date).toLocaleDateString()} - {obs.predicted_class} ({obs.severity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              3. {t.selectRecent}
            </label>
            <select
              value={recentId}
              onChange={(e) => setRecentId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
            >
              <option value="">Choose Follow-up Observation</option>
              {timeline.map((obs) => (
                <option key={obs.id} value={obs.id}>
                  {new Date(obs.date).toLocaleDateString()} - {obs.predicted_class} ({obs.severity})
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={handleCompare}
            disabled={loading || !earlierId || !recentId}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 ${
              earlierId && recentId && !loading
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>{loading ? 'Comparing Progression...' : t.compareButton}</span>
          </button>
        </div>
      </div>

      {/* Comparison Results Card */}
      {comparison && (
        <div className="space-y-6">
          {/* Side-by-Side Dual Image Card Viewer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earlier Observation */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                    Baseline Observation (Day T)
                  </span>
                  <RiskBadge level={comparison.earlier_observation.severity === 'Severe' ? 'High' : (comparison.earlier_observation.severity === 'Moderate' ? 'Moderate' : 'Low')} size="sm" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">
                  {lang === 'ta' && comparison.earlier_observation.tamil_name ? comparison.earlier_observation.tamil_name : comparison.earlier_observation.predicted_class}
                </h4>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{new Date(comparison.earlier_observation.observation_date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Severity: <strong>{comparison.earlier_observation.severity}</strong></span>
                </div>
              </div>

              <div className="my-4 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 flex items-center justify-center min-h-[260px]">
                <img
                  src={api.imageUrl(comparison.earlier_observation.heatmap_path || comparison.earlier_observation.image_path)}
                  alt="Earlier Leaf"
                  className="max-h-[260px] object-contain"
                />
              </div>

              {comparison.earlier_observation.farmer_notes && (
                <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  "{comparison.earlier_observation.farmer_notes}"
                </p>
              )}
            </div>

            {/* Recent Observation */}
            <div className="bg-white rounded-3xl border border-emerald-200 shadow-xs p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                    Follow-Up Observation (Day T+{comparison.days_elapsed})
                  </span>
                  <RiskBadge level={comparison.recent_observation.severity === 'Severe' ? 'High' : (comparison.recent_observation.severity === 'Moderate' ? 'Moderate' : 'Low')} size="sm" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">
                  {lang === 'ta' && comparison.recent_observation.tamil_name ? comparison.recent_observation.tamil_name : comparison.recent_observation.predicted_class}
                </h4>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{new Date(comparison.recent_observation.observation_date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Severity: <strong>{comparison.recent_observation.severity}</strong></span>
                </div>
              </div>

              <div className="my-4 rounded-2xl overflow-hidden bg-slate-950 border border-emerald-300 flex items-center justify-center min-h-[260px]">
                <img
                  src={api.imageUrl(comparison.recent_observation.heatmap_path || comparison.recent_observation.image_path)}
                  alt="Recent Leaf"
                  className="max-h-[260px] object-contain"
                />
              </div>

              {comparison.recent_observation.farmer_notes && (
                <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  "{comparison.recent_observation.farmer_notes}"
                </p>
              )}
            </div>
          </div>

          {/* Longitudinal Analysis Summary */}
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                  Longitudinal Progression Assessment
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {comparison.days_elapsed} Days Tracking Window
                </h3>
              </div>

              {/* Severity Transition Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Outcome:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  comparison.severity_change === 'Improved'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : comparison.severity_change === 'Deteriorated'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {comparison.severity_change === 'Improved' && <TrendingDown className="h-3.5 w-3.5" />}
                  {comparison.severity_change === 'Deteriorated' && <TrendingUp className="h-3.5 w-3.5" />}
                  {comparison.severity_change === 'Stable' && <Minus className="h-3.5 w-3.5" />}
                  <span>{comparison.severity_change}</span>
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {lang === 'ta' && comparison.tamil_progression_summary
                  ? comparison.tamil_progression_summary
                  : comparison.progression_summary}
              </p>

              {/* Visual Change Notes */}
              <div>
                <h5 className="text-xs font-bold text-slate-800 mb-2">
                  {t.visualChanges}:
                </h5>
                <ul className="space-y-1 text-xs text-slate-600">
                  {comparison.visual_change_notes.map((note, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Adaptive Agronomic Guidance */}
              <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block mb-1">
                  {t.adaptiveAdvisory}
                </span>
                <p className="text-xs text-emerald-950 font-semibold leading-relaxed">
                  {comparison.adaptive_recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
