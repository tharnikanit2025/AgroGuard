import React, { useState } from 'react';
import { 
  Sprout, 
  Plus, 
  MapPin, 
  Calendar, 
  Layers, 
  Activity, 
  ArrowRight, 
  Check, 
  X,
  FileText
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import { api } from '../services/api';

export default function FieldManagement({ 
  fields = [], 
  onFieldCreated, 
  onSelectFieldAction, 
  t, 
  lang 
}) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [fieldName, setFieldName] = useState('');
  const [cropVariety, setCropVariety] = useState('CR 1009 Sub-1');
  const [area, setArea] = useState(2.0);
  const [plantingDate, setPlantingDate] = useState(new Date().toISOString().split('T')[0]);
  const [growthStage, setGrowthStage] = useState('Tillering');
  const [soilType, setSoilType] = useState('Alluvial Clay Loam');
  const [latitude, setLatitude] = useState(10.7870);
  const [longitude, setLongitude] = useState(79.1378);

  const presets = [
    { name: "Thanjavur Delta Reach", lat: 10.7870, lng: 79.1378 },
    { name: "Tiruvarur Vennar Basin", lat: 10.7725, lng: 79.6365 },
    { name: "Kanchipuram Palar Basin", lat: 12.8342, lng: 79.7036 },
    { name: "Cuddalore Coastal Reach", lat: 11.7564, lng: 79.7634 },
    { name: "Madurai Vaigai Plains", lat: 9.9252, lng: 78.1198 }
  ];

  const handleCreateField = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const created = await api.createField({
        field_name: fieldName,
        crop_type: "Rice / Paddy",
        crop_variety: cropVariety,
        area: parseFloat(area),
        planting_date: plantingDate,
        growth_stage: growthStage,
        soil_type: soilType,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      });
      setShowModal(false);
      // Reset form
      setFieldName('');
      if (onFieldCreated) onFieldCreated();
    } catch (err) {
      setError(err.message || "Failed to register field.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.navFields}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Register and manage individual paddy plots for longitudinal health tracking.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Register New Rice Field</span>
        </button>
      </div>

      {/* Fields Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map((field) => (
          <div 
            key={field.field_id}
            className="bg-white rounded-3xl border border-emerald-100 shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                    {field.crop_variety || "Paddy"}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1.5">
                    {field.field_name}
                  </h3>
                </div>
                <RiskBadge level={field.latest_risk_level || "Low"} size="sm" />
              </div>

              <div className="space-y-2 text-xs text-slate-600 my-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{field.latitude?.toFixed(4)}°N, {field.longitude?.toFixed(4)}°E</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Sown: {field.planting_date || "Not recorded"} • {field.area} Acres</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Growth Stage: <strong className="text-slate-800">{field.growth_stage}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Sprout className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Soil: {field.soil_type || "Alluvial Loam"}</span>
                </div>
              </div>

              {/* Latest Observation Status Box */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 mb-4 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Latest Diagnosis
                </span>
                {field.latest_observation ? (
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      {field.latest_observation.predicted_class}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      {Math.round(field.latest_observation.confidence * 100)}% Conf.
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-400 italic">No observation recorded yet</span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => onSelectFieldAction(field, 'detection')}
                className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <span>Analyse Crop</span>
              </button>
              <button
                onClick={() => onSelectFieldAction(field, 'history')}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <span>Timeline</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Register Field Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 sm:p-8 my-8 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Sprout className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Register Agricultural Field</h3>
                <p className="text-xs text-slate-500">Add a new paddy plot to your AgroGuard AI portfolio</p>
              </div>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateField} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Field Name / Plot Identifier</label>
                <input
                  type="text"
                  required
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  placeholder="e.g. Cauvery South Block (Kuruvai)"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rice Variety</label>
                  <select
                    value={cropVariety}
                    onChange={(e) => setCropVariety(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="CR 1009 Sub-1">CR 1009 Sub-1 (Ponmani)</option>
                    <option value="BPT 5204 (Samba Mahsuri)">BPT 5204 (Samba Mahsuri)</option>
                    <option value="Ponni">Ponni</option>
                    <option value="ADT 37">ADT 37</option>
                    <option value="ADT 45">ADT 45</option>
                    <option value="IR 64">IR 64</option>
                    <option value="CO 51">CO 51</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Plot Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Planting Date</label>
                  <input
                    type="date"
                    value={plantingDate}
                    onChange={(e) => setPlantingDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Growth Stage</label>
                  <select
                    value={growthStage}
                    onChange={(e) => setGrowthStage(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Vegetative">Vegetative</option>
                    <option value="Tillering">Tillering</option>
                    <option value="Panicle Initiation">Panicle Initiation</option>
                    <option value="Flowering / Heading">Flowering / Heading</option>
                    <option value="Ripening / Milking">Ripening / Milking</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Soil Type</label>
                <input
                  type="text"
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  placeholder="e.g. Alluvial Clay Loam"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Coordinates & Presets */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Geographic Coordinates</label>
                  <span className="text-[10px] text-slate-400">Tamil Nadu Delta</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="Latitude"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="Longitude"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 mt-1">
                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setLatitude(p.lat);
                        setLongitude(p.lng);
                      }}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-50 text-[10px] text-slate-600 hover:text-emerald-800"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
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
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>Register Field</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
