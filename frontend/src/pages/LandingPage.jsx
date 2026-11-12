import React from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  Clock, 
  CloudRain, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  TrendingUp, 
  BookOpen, 
  Users, 
  Award,
  Zap
} from 'lucide-react';

export default function LandingPage({ onGetStarted, onDemoLogin, t, lang }) {
  const pillars = [
    {
      icon: Search,
      title: "AI Crop Disease Detection",
      desc: "Computer Vision classification for Rice Blast, Bacterial Leaf Blight, Brown Spot & Sheath Blight with uncertainty thresholds."
    },
    {
      icon: Clock,
      title: "Longitudinal Health History",
      desc: "Maintain a living digital record for every agricultural plot across the entire Samba / Kuruvai paddy cultivation cycle."
    },
    {
      icon: TrendingUp,
      title: "Visual Progression Tracking",
      desc: "Side-by-side comparative analysis of crop leaves across time to track symptom expansion or post-treatment recovery."
    },
    {
      icon: CloudRain,
      title: "Agro-Climatic Risk Warning",
      desc: "Micro-climatic modeling correlating temperature, relative humidity, and rainfall to detect disease-favourable epidemic windows."
    },
    {
      icon: Sparkles,
      title: "Explainable AI (Grad-CAM & SHAP)",
      desc: "Saliency heatmaps highlighting exact leaf lesion regions, paired with feature importance for micro-climatic variables."
    },
    {
      icon: BookOpen,
      title: "Adaptive Agronomic Guidance",
      desc: "Actionable, sustainable cultural and biological IPM practices aligned with Tamil Nadu Agricultural University (TNAU) protocols."
    }
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Register Rice Field",
      desc: "Log your paddy acreage, location (e.g. Thanjavur Cauvery Delta), variety (CR 1009, Ponni, ADT 45) and growth stage."
    },
    {
      step: "02",
      title: "Capture Leaf Photo",
      desc: "Snap a clear leaf blade photo from the field or upload an image to receive an immediate AI pathology diagnosis."
    },
    {
      step: "03",
      title: "Inspect Explainability & Risk",
      desc: "Review the Grad-CAM activation heatmap and check real-time meteorological disease-favourable risk scores."
    },
    {
      step: "04",
      title: "Track Progression & Interventions",
      desc: "Record treatments (biocontrol sprays, drainage) and compare subsequent observations to verify crop recovery."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Top Banner with College Accreditation */}
      <div className="bg-emerald-950 text-emerald-300 text-xs py-2 px-4 text-center font-medium border-b border-emerald-900">
        <span className="inline-flex items-center gap-2">
          <Award className="h-3.5 w-3.5 text-emerald-400" />
          <span>Chennai Institute of Technology, Chennai • Hackathon Innovation Prototype</span>
          <span className="hidden sm:inline">• Team KAIROS (Tharnika N, Karunya Priya NS, Gowtham S, Varun S, Disvan Sundar)</span>
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 text-white">
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(52,211,153,0.1),transparent_50%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-semibold mb-6 shadow-xs backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Beyond Single-Image Detection • Full Longitudinal Crop Health</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            An AI-Driven Longitudinal Crop Health Monitoring & Early Warning System
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-emerald-100/90 max-w-3xl mx-auto font-normal leading-relaxed">
            AgroGuard AI goes beyond ordinary leaf diagnosis. Track disease progression across dates, quantify micro-climatic epidemic risks, and inspect visual AI predictions with Grad-CAM explainability — tailored for Tamil Nadu paddy farmers.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onDemoLogin}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-emerald-950 font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Zap className="h-4 w-4 fill-emerald-950" />
              <span>{t.demoLogin}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 backdrop-blur transition-all"
            >
              {t.register} / {t.login}
            </button>
          </div>

          {/* Target Ecosystem Pills */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs text-emerald-200/80">
            <span className="px-3 py-1 rounded-lg bg-emerald-800/40 border border-emerald-700/50">🌾 Target: Rice / Paddy</span>
            <span className="px-3 py-1 rounded-lg bg-emerald-800/40 border border-emerald-700/50">📍 Region: Tamil Nadu Delta</span>
            <span className="px-3 py-1 rounded-lg bg-emerald-800/40 border border-emerald-700/50">🔬 Visual AI: Grad-CAM Explainability</span>
            <span className="px-3 py-1 rounded-lg bg-emerald-800/40 border border-emerald-700/50">🌐 Bilingual: English & தமிழ்</span>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            Complete Agricultural Intelligence
          </h2>
          <h3 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Why AgroGuard AI Transcends Traditional Crop Apps
          </h3>
          <p className="mt-4 text-base text-slate-600">
            Traditional apps only produce a static guess on a single photo. AgroGuard AI delivers an end-to-end longitudinal health management ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div 
                key={idx}
                className="bg-white p-8 rounded-2xl border border-emerald-100/80 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">
                  {p.title}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Workflow Section: How It Works */}
      <section className="py-16 bg-emerald-50/60 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              Farmer Workflow
            </h2>
            <h3 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
              From Early Spore Detection to Harvest Resilience
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((s, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs relative">
                <span className="text-3xl font-black text-emerald-200 block mb-3 font-mono">
                  {s.step}
                </span>
                <h4 className="text-base font-bold text-slate-900 mb-2">{s.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team KAIROS & Institutional Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-base mb-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <span>AgroGuard AI</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                An AI-driven longitudinal crop health monitoring, disease progression tracking and adaptive early warning system.
              </p>
            </div>

            <div>
              <div className="text-white font-bold mb-2 flex items-center gap-1.5">
                <Users className="h-4 w-4 text-emerald-400" />
                <span>Team KAIROS</span>
              </div>
              <p className="font-semibold text-slate-300">Team Leader: Tharnika N</p>
              <ul className="space-y-1 text-slate-400 mt-1">
                <li>1. Karunya Priya NS</li>
                <li>2. Gowtham S</li>
                <li>3. Varun S</li>
                <li>4. Disvan Sundar</li>
              </ul>
            </div>

            <div>
              <div className="text-white font-bold mb-2 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-emerald-400" />
                <span>Institution</span>
              </div>
              <p className="text-slate-300 font-semibold">Chennai Institute of Technology</p>
              <p className="text-slate-400">Sarathy Nagar, Kundrathur, Chennai, Tamil Nadu - 600069</p>
              <p className="mt-2 text-emerald-400 font-medium">Domain: Precision Agriculture & AI</p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <span>© 2026 AgroGuard AI • Team KAIROS • Built for Hackathon Evaluation</span>
            <span>Focus: Rice / Paddy in Tamil Nadu, India</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
