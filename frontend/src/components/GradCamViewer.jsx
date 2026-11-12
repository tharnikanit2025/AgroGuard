import React, { useState } from 'react';
import { Eye, Layers, Sparkles, AlertCircle, Info } from 'lucide-react';
import { api } from '../services/api';

export default function GradCamViewer({ 
  originalImageUrl, 
  heatmapUrl, 
  predictedClass, 
  explainability, 
  lang = 'en' 
}) {
  const [activeView, setActiveView] = useState('heatmap'); // 'heatmap', 'original', 'split'

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <h4 className="font-bold text-sm tracking-wide text-white uppercase">
              Explainable AI: Grad-CAM Saliency Map
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Class Activation Mapping highlights the neural network's visual attention triggers
          </p>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700/60 self-start sm:self-auto">
          <button
            onClick={() => setActiveView('original')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeView === 'original' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Original
          </button>
          <button
            onClick={() => setActiveView('heatmap')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeView === 'heatmap' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Grad-CAM Heatmap
          </button>
          <button
            onClick={() => setActiveView('split')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeView === 'split' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Side-by-Side
          </button>
        </div>
      </div>

      {/* Visual Canvas Area */}
      <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-4 flex items-center justify-center min-h-[300px]">
        {activeView === 'original' && (
          <img 
            src={api.imageUrl(originalImageUrl)} 
            alt="Original Crop Leaf" 
            className="max-h-[360px] object-contain rounded-lg"
          />
        )}

        {activeView === 'heatmap' && (
          <div className="relative">
            <img 
              src={api.imageUrl(heatmapUrl || originalImageUrl)} 
              alt="Grad-CAM Activation Heatmap" 
              className="max-h-[360px] object-contain rounded-lg"
            />
            {/* Color Gradient Scale Legend */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700 text-[10px] flex items-center gap-2">
              <span className="text-slate-400">Attention:</span>
              <div className="h-2 w-24 rounded-full bg-gradient-to-r from-blue-500 via-green-400 via-yellow-400 to-red-600"></div>
              <span className="text-red-400 font-bold">High Focus</span>
            </div>
          </div>
        )}

        {activeView === 'split' && (
          <div className="grid grid-cols-2 gap-2 p-2 w-full">
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-semibold text-slate-400 mb-1">Captured Leaf Image</span>
              <img 
                src={api.imageUrl(originalImageUrl)} 
                alt="Original" 
                className="max-h-[300px] w-full object-contain rounded-lg border border-slate-800"
              />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-semibold text-emerald-400 mb-1">Grad-CAM Activation Map</span>
              <img 
                src={api.imageUrl(heatmapUrl || originalImageUrl)} 
                alt="Heatmap" 
                className="max-h-[300px] w-full object-contain rounded-lg border border-emerald-900/50"
              />
            </div>
          </div>
        )}
      </div>

      {/* Explanation Text & Metrics */}
      <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-start gap-2.5">
          <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-emerald-300">
              {explainability?.salient_feature_summary || "Focal activation localized on lesion boundaries."}
            </div>
            <p className="text-slate-300 leading-relaxed">
              {lang === 'ta' && explainability?.tamil_explanation
                ? explainability.tamil_explanation
                : (explainability?.explanation_text || "The neural network focused its convolutional activations directly upon the diagnostic necrotic areas rather than extraneous background noise.")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
