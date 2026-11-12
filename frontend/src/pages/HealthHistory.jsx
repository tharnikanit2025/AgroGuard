import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  Sprout, 
  CheckCircle2, 
  Layers, 
  Plus, 
  AlertTriangle, 
  ArrowRight, 
  FileText,
  X,
  Check
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import { api } from '../services/api';

export default function HealthHistory({ 
  fields = [], 
  selectedFieldId, 
  onNavigate, 
  t, 
  lang 
}) {
  const [fieldId, setFieldId] = useState(selectedFieldId || (fields[0]?.field_id || 1));
  const [fieldData, setFieldData] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Intervention Modal
  const [showModal, setShowModal] = useState(false);
  const [actionTaken, setActionTaken] = useState('');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [outcomeStatus, setOutcomeStatus] = useState('Pending Review');
  const [targetObsId, setTargetObsId] = useState(null);

  const loadHistory = async (id) => {
    setLoading(true);
    try {
      const res = await api.getFieldHistory(id);
      setFieldData(res);
      setTimeline(res.timeline || []);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fieldId) {
      loadHistory(fieldId);
    }
  }, [fieldId]);

  const handleRecordIntervention = async (e) => {
    e.preventDefault();
    try {
      await api.recordIntervention({
        field_id: parseInt(fieldId),
        observation_id: targetObsId ? parseInt(targetObsId) : null,
        action_taken: actionTaken,
        follow_up_notes: followUpNotes,
        outcome_status: outcomeStatus
      });
      setShowModal(false);
      setActionTaken('');
      setFollowUpNotes('');
      setTargetObsId(null);
      // Reload history
      loadHistory(fieldId);
    } catch (err) {
      alert("Failed to save intervention: " + err.message);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.navHistory}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Maintain a longitudinal chronological medical chart for your rice crop from seedling to harvest.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={fieldId}
            onChange={(e) => setFieldId(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-semibold"
          >
            {fields.map((f) => (
              <option key={f.field_id} value={f.field_id}>
                {f.field_name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setTargetObsId(null);
              setShowModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 flex items-center gap-1.5 transition-all shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>{t.logIntervention}</span>
          </button>
        </div>
      </div>

      {/* Field Overview Summary Bar */}
      {fieldData && (
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-emerald-950 text-sm">{fieldData.field_name}</span>
            <span className="text-emerald-700 font-medium ml-2">({fieldData.crop_variety})</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-800">
            <span>Planted: <strong>{fieldData.planting_date || 'N/A'}</strong></span>
            <span>Current Stage: <strong>{fieldData.growth_stage}</strong></span>
            <span>Timeline Entries: <strong>{timeline.length}</strong></span>
          </div>
        </div>
      )}

      {/* Chronological Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-200">
        {timeline.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
            No history recorded for this field yet. Capture a leaf image to begin your field timeline!
          </div>
        ) : (
          timeline.map((item, idx) => (
            <div key={idx} className="relative">
              {/* Timeline marker icon */}
              <div className={`absolute -left-6 sm:-left-8 top-1.5 h-6 w-6 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white ${
                item.type === 'observation' 
                  ? (item.predicted_class === 'Healthy Crop' ? 'bg-emerald-500' : 'bg-rose-500') 
                  : 'bg-blue-600'
              }`}>
                {item.type === 'observation' ? <Sprout className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
              </div>

              {/* Event Card */}
              <div className={`bg-white rounded-3xl border shadow-xs p-6 ${
                item.type === 'intervention' ? 'border-blue-200 bg-blue-50/20' : 'border-slate-200'
              }`}>
                {item.type === 'observation' ? (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                          AI Observation
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900">
                          {lang === 'ta' && item.tamil_name ? item.tamil_name : item.predicted_class}
                        </h4>
                        <RiskBadge level={item.severity === 'Severe' ? 'High' : (item.severity === 'Moderate' ? 'Moderate' : 'Low')} size="sm" />
                      </div>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(item.date).toLocaleDateString()} ({Math.round(item.confidence * 100)}% Conf.)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 my-4">
                      {/* Leaf Photo Preview */}
                      <div className="sm:col-span-4 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center max-h-48">
                        <img 
                          src={api.imageUrl(item.heatmap_path || item.image_path)} 
                          alt="Leaf Diagnosis" 
                          className="max-h-48 object-contain"
                        />
                      </div>

                      {/* Observations & Notes */}
                      <div className="sm:col-span-8 space-y-2 text-xs">
                        {item.farmer_notes && (
                          <p className="text-slate-700 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            Farmer Note: "{item.farmer_notes}"
                          </p>
                        )}

                        <div>
                          <span className="font-bold text-slate-700 block mb-1">Pathological Symptoms:</span>
                          <ul className="space-y-1 text-slate-600">
                            {item.symptoms_detected?.map((sym, sIdx) => (
                              <li key={sIdx} className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                <span>{sym}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {item.recommendations?.length > 0 && (
                          <div className="pt-2 text-emerald-900 font-medium">
                            <span className="font-bold block text-[11px] uppercase tracking-wider text-emerald-700">Recommended IPM Action:</span>
                            <span>{lang === 'ta' && item.tamil_recommendations ? item.tamil_recommendations[0] : item.recommendations[0]}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Button to Record Intervention against this observation */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                      <button
                        onClick={() => {
                          setTargetObsId(item.id);
                          setShowModal(true);
                        }}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Log Treatment Taken For This Diagnosis</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Intervention Record */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                          Farmer Intervention Recorded
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">
                          {item.action_taken}
                        </h4>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>

                    {item.follow_up_notes && (
                      <p className="text-xs text-slate-600 mt-1">
                        Follow-Up Note: {item.follow_up_notes}
                      </p>
                    )}

                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <span className="text-slate-500 font-semibold">Outcome Status:</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                        {item.outcome_status}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Record Intervention Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{t.logIntervention}</h3>
                <p className="text-xs text-slate-500">Log management action or bio-pesticide applied</p>
              </div>
            </div>

            <form onSubmit={handleRecordIntervention} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.actionTaken}
                </label>
                <textarea
                  required
                  rows="3"
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  placeholder="e.g. Drained excess water from the plot; applied Pseudomonas fluorescens foliar spray (1 kg/acre)..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Follow-Up Monitoring Notes
                </label>
                <input
                  type="text"
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  placeholder="e.g. Leaf dew cleared within 2 hours; sunny forecast"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.outcomeStatus}
                </label>
                <select
                  value={outcomeStatus}
                  onChange={(e) => setOutcomeStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="Pending Review">Pending Review</option>
                  <option value="Condition Stabilized">Condition Stabilized</option>
                  <option value="Noticeable Improvement">Noticeable Improvement</option>
                  <option value="Further Action Required">Further Action Required</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>{t.saveIntervention}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
