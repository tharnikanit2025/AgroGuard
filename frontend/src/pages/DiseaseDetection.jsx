import React, { useState } from 'react';
import { 
  Upload, 
  Search, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  FileText,
  Info,
  Clock,
  Zap,
  Camera
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import GradCamViewer from '../components/GradCamViewer';
import { api } from '../services/api';

export default function DiseaseDetection({ 
  fields = [], 
  selectedFieldId, 
  onNavigate, 
  t, 
  lang 
}) {
  const [fieldId, setFieldId] = useState(selectedFieldId || (fields[0]?.field_id || 1));
  const [imageBase64, setImageBase64] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [farmerNotes, setFarmerNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Sample leaves for quick testing
  const samplePresets = [
    {
      id: 'blast_early',
      title: 'Rice Blast (Mild)',
      tamil: 'நெல் குலை நோய்',
      url: '/uploads/sample_blast_day14.jpg'
    },
    {
      id: 'blast_adv',
      title: 'Rice Blast (Advanced)',
      tamil: 'முதிர்ந்த குலை நோய்',
      url: '/uploads/sample_blast_day24.jpg'
    },
    {
      id: 'blb',
      title: 'Bacterial Blight',
      tamil: 'பாக்டீரியா இலைக்கருகல்',
      url: '/uploads/sample_blb_leaf.jpg'
    },
    {
      id: 'healthy',
      title: 'Healthy Paddy',
      tamil: 'ஆரோக்கியமான பயிர்',
      url: '/uploads/sample_healthy_rice.jpg'
    }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
        setPreviewUrl(reader.result);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = async (preset) => {
    setError(null);
    try {
      // Fetch image from backend uploads and convert to base64
      const fullUrl = api.imageUrl(preset.url);
      const res = await fetch(fullUrl);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
        setPreviewUrl(reader.result);
        setResult(null);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      setError("Failed to load sample image: " + err.message);
    }
  };

  const handleAnalyze = async () => {
    if (!imageBase64) {
      setError("Please capture or select a leaf photo first.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const data = await api.analyzeCrop({
        field_id: parseInt(fieldId),
        image_base64: imageBase64,
        farmer_notes: farmerNotes
      });
      setResult(data);
    } catch (err) {
      setError(err.message || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {t.uploadTitle}
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
          {t.uploadSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Field selection & Image Input (5 cols) */}
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
                    {f.field_name} ({f.crop_variety || 'Paddy'} - {f.growth_stage})
                  </option>
                ))}
              </select>
            </div>

            {/* Upload Dropzone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t.captureOrUpload}
              </label>
              <label className="border-2 border-dashed border-emerald-200 hover:border-emerald-400 bg-emerald-50/40 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="h-12 w-12 rounded-xl bg-white shadow-xs text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Camera className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  Click to Browse or Drag Leaf Image
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Supports JPG, PNG, WEBP (Min 80x80px)
                </span>
              </label>
            </div>

            {/* Preloaded Sample Leaf Presets for Quick Testing */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                {t.useSampleLeaf}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {samplePresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/60 text-left transition-all group"
                  >
                    <span className="block text-xs font-bold text-slate-800 group-hover:text-emerald-900">
                      {preset.title}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium">
                      {preset.tamil}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Farmer Field Notes (Optional)
              </label>
              <textarea
                value={farmerNotes}
                onChange={(e) => setFarmerNotes(e.target.value)}
                placeholder="e.g. Symptoms observed after 2 days of rain; lower leaves drying..."
                rows="2"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              ></textarea>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {error}
              </div>
            )}

            {/* Analyze CTA */}
            <button
              onClick={handleAnalyze}
              disabled={loading || !imageBase64}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                imageBase64 && !loading
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>{loading ? t.analyzing : t.analyzeButton}</span>
            </button>
          </div>

          {/* Uploaded Preview Card */}
          {previewUrl && (
            <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Selected Image Preview
              </span>
              <img
                src={previewUrl}
                alt="Selected Leaf"
                className="max-h-56 w-full object-contain rounded-xl border border-slate-100 bg-slate-50"
              />
            </div>
          )}
        </div>

        {/* Right Column: AI Diagnosis Results & Grad-CAM (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="space-y-6">
              {/* Diagnosis Top Card */}
              <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                      Verified AI Diagnosis
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">
                      {lang === 'ta' && result.tamil_name ? result.tamil_name : result.predicted_class}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Field: <span className="font-bold text-slate-700">{result.field_name}</span>
                    </p>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                    <RiskBadge level={result.severity === 'Severe' ? 'High' : (result.severity === 'Moderate' ? 'Moderate' : 'Low')} size="lg" />
                    <span className="text-xs font-bold text-emerald-700">
                      {Math.round(result.confidence * 100)}% Confidence
                    </span>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-600">{t.confidence}</span>
                    <span className="text-emerald-700">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full"
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Uncertainty Warning if Applicable */}
                {result.is_uncertain && (
                  <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                    <span>{t.uncertaintyWarning}</span>
                  </div>
                )}

                {/* Pathological Symptoms Detected */}
                <div className="mt-5">
                  <h4 className="text-xs font-bold text-slate-800 mb-2">
                    {t.symptomsObserved}:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {result.symptoms_detected?.map((sym, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Explainable AI: Grad-CAM Saliency Map Viewer */}
              {result.explainability && (
                <GradCamViewer
                  originalImageUrl={result.image_path}
                  heatmapUrl={result.heatmap_path}
                  predictedClass={result.predicted_class}
                  explainability={result.explainability}
                  lang={lang}
                />
              )}

              {/* Recommended Cultural & Biological Practices */}
              <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-700" />
                  <span>{t.recommendedActions} (TNAU Guidelines)</span>
                </h4>
                <div className="space-y-2 text-xs text-slate-700">
                  {(lang === 'ta' && result.tamil_recommendations ? result.tamil_recommendations : result.recommendations)?.map((rec, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-2">
                      <span className="font-bold text-emerald-700 mt-0.5">•</span>
                      <span className="leading-relaxed">{rec}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                  <button
                    onClick={() => onNavigate('progression')}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>Track Progression</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('history')}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>View Field History</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] bg-white rounded-3xl border border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">
                Awaiting Crop Leaf Image
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Upload a rice leaf photo on the left or select a sample preset to view AI diagnosis and Grad-CAM visual explainability.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
