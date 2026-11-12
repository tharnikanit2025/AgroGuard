import React, { useState } from 'react';
import { 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Layers, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Info,
  RefreshCw,
  Sliders,
  ShieldAlert
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import RiskBadge from '../components/RiskBadge';
import { api } from '../services/api';

export default function EnvironmentalRisk({ 
  fields = [], 
  onNavigate, 
  t, 
  lang 
}) {
  const [fieldId, setFieldId] = useState(fields[0]?.field_id || 1);
  const [temperature, setTemperature] = useState(28.5);
  const [humidity, setHumidity] = useState(84.0);
  const [rainfall, setRainfall] = useState(3.5);
  const [soilMoisture, setSoilMoisture] = useState(72.0);
  const [growthStage, setGrowthStage] = useState('Tillering');
  const [loading, setLoading] = useState(false);
  const [riskData, setRiskData] = useState(null);
  const [error, setError] = useState(null);

  const handleAssessRisk = async (useLive = false) => {
    setError(null);
    setLoading(true);

    try {
      const payload = {
        field_id: parseInt(fieldId),
        growth_stage: growthStage
      };

      if (!useLive) {
        payload.temperature = parseFloat(temperature);
        payload.humidity = parseFloat(humidity);
        payload.rainfall = parseFloat(rainfall);
        payload.soil_moisture = parseFloat(soilMoisture);
      }

      const res = await api.analyzeEnvironmentalRisk(payload);
      setRiskData(res);
      // Sync sliders with fetched live data if live mode was clicked
      if (useLive) {
        setTemperature(res.temperature);
        setHumidity(res.humidity);
        setRainfall(res.rainfall);
        setSoilMoisture(res.soil_moisture);
      }
    } catch (err) {
      setError(err.message || "Failed to calculate risk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {t.envTitle}
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
          {t.envSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Environmental Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.selectField}
              </label>
              <select
                value={fieldId}
                onChange={(e) => setFieldId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
              >
                {fields.map((f) => (
                  <option key={f.field_id} value={f.field_id}>
                    {f.field_name} ({f.latitude?.toFixed(2)}°N, {f.longitude?.toFixed(2)}°E)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-emerald-700" />
                <span>Micro-Climatic Parameters</span>
              </span>
              <button
                type="button"
                onClick={() => handleAssessRisk(true)}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Fetch Live Weather</span>
              </button>
            </div>

            {/* Slider 1: Temperature */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">{t.temperature}</span>
                <span className="font-bold text-emerald-800">{temperature} °C</span>
              </div>
              <input
                type="range"
                min="16"
                max="40"
                step="0.5"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>16°C (Cool Dew)</span>
                <span>40°C (Hot Dry)</span>
              </div>
            </div>

            {/* Slider 2: Relative Humidity */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">{t.humidity}</span>
                <span className="font-bold text-blue-700">{humidity} %</span>
              </div>
              <input
                type="range"
                min="40"
                max="98"
                step="1"
                value={humidity}
                onChange={(e) => setHumidity(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>40% (Dry)</span>
                <span>98% (Saturated Dew)</span>
              </div>
            </div>

            {/* Slider 3: Rainfall */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">{t.rainfall}</span>
                <span className="font-bold text-slate-800">{rainfall} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="0.5"
                value={rainfall}
                onChange={(e) => setRainfall(parseFloat(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            {/* Slider 4: Soil Moisture */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">{t.soilMoisture}</span>
                <span className="font-bold text-slate-800">{soilMoisture} %</span>
              </div>
              <input
                type="range"
                min="35"
                max="95"
                step="1"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(parseFloat(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            {/* Growth stage */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.growthStage}
              </label>
              <select
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Vegetative">Vegetative (Open canopy)</option>
                <option value="Tillering">Tillering (Dense microclimate)</option>
                <option value="Panicle Initiation">Panicle Initiation</option>
                <option value="Flowering / Heading">Flowering / Heading (High susceptibility)</option>
                <option value="Ripening / Milking">Ripening / Milking</option>
              </select>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}

            <button
              onClick={() => handleAssessRisk(false)}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all"
            >
              <ShieldAlert className="h-4 w-4" />
              <span>{loading ? 'Evaluating Model...' : t.calculateRisk}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Risk Output & SHAP Feature Importance (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {riskData ? (
            <div className="space-y-6">
              {/* Overall Risk Score Card */}
              <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                      Agro-Climatic Epidemic Estimate
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">
                      {riskData.risk_level} Environmental Risk
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Forecast Horizon: <strong>{riskData.forecast_period}</strong> • Source: {riskData.weather_source}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-black text-slate-900">{riskData.risk_score} / 100</div>
                      <div className="text-[10px] text-slate-400 font-semibold">Epidemic Potential Index</div>
                    </div>
                    <RiskBadge level={riskData.risk_level} size="lg" />
                  </div>
                </div>

                {/* Important Distinction Note */}
                <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                  <Info className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    <strong>Scientific Note:</strong> Environmental disease risk measures weather-conducive spore proliferation potential. It is not conclusive proof that crops are currently infected without visual leaf symptoms.
                  </span>
                </div>

                {/* Risk Factors */}
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-slate-800 mb-2">Conducive Weather Drivers:</h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {riskData.risk_factors.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pathogen-Specific Susceptibility Cards */}
              <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
                <h4 className="text-sm font-bold text-slate-900 mb-4">
                  {t.pathogenRiskScores}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {riskData.favourable_diseases?.map((dis, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-slate-900">{dis.disease_name}</span>
                        <RiskBadge level={dis.status === 'High Risk' ? 'High' : (dis.status === 'Moderate' ? 'Moderate' : 'Low')} size="sm" />
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                          <span>{dis.tamil_name}</span>
                          <span className="font-bold text-slate-800">{dis.risk_percentage}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              dis.risk_percentage > 70 ? 'bg-rose-500' : (dis.risk_percentage > 45 ? 'bg-amber-500' : 'bg-emerald-500')
                            }`}
                            style={{ width: `${dis.risk_percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SHAP-Style Micro-Climatic Factor Attribution */}
              <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    {t.shapHeading}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                    Feature Contribution
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Quantifies which parameters exert the greatest pressure on disease emergence
                </p>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={riskData.feature_importance || []} 
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                      <XAxis type="number" domain={[0, 0.5]} fontSize={11} stroke="#94a3b8" />
                      <YAxis type="category" dataKey="feature" fontSize={11} stroke="#94a3b8" width={110} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }} />
                      <Bar dataKey="importance" fill="#059669" radius={[0, 6, 6, 0]}>
                        {(riskData.feature_importance || []).map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.effect === 'Increases Risk' ? '#ef4444' : (entry.effect === 'Decreases Risk' ? '#10b981' : '#f59e0b')} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Agronomic Recommendations */}
                <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block mb-1">
                    Precautionary Field Advisory
                  </span>
                  <p className="text-xs text-emerald-950 font-semibold leading-relaxed">
                    {lang === 'ta' && riskData.tamil_recommended_action
                      ? riskData.tamil_recommended_action
                      : riskData.recommended_action}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] bg-white rounded-3xl border border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <CloudRain className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">
                Ready for Risk Modeling
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Adjust weather sliders or click 'Fetch Live Weather' to calculate micro-climatic disease proliferation risks.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
