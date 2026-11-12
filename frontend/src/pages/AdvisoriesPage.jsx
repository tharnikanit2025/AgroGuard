import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Sprout, Droplets, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function AdvisoriesPage({ t, lang }) {
  const [activeTab, setActiveTab] = useState('blast');

  const diseases = [
    {
      id: 'blast',
      name: 'Rice Blast',
      tamilName: 'நெல் குலை நோய்',
      scientific: 'Magnaporthe oryzae',
      symptoms: [
        'Spindle-shaped elliptical lesions with gray or whitish centers and brown borders.',
        'Lesions coalesce rapidly causing leaves to wither and appear scorched.',
        'Neck rot infection during panicle emergence causing blank/chaffy grains.'
      ],
      tamilSymptoms: [
        'நீள்வட்ட சாம்பல் நிற மையமும் பழுப்பு நிற விளிம்பும் கொண்ட புள்ளிகள்.',
        'புள்ளிகள் ஒன்றிணைந்து இலைகள் காய்ந்து கருகிய தோற்றமளிக்கும்.',
        'கதிர் தோன்றும் பருவத்தில் கழுத்துப் பகுதி கருமை அடைந்து கதிர் மணியின்றி பதராகும்.'
      ],
      cultural: [
        'Split nitrogen / urea fertilizer into 3 to 4 smaller doses rather than heavy single doses.',
        'Maintain proper planting spacing (20x15 cm) to promote air circulation inside the canopy.',
        'Avoid prolonged standing floodwater during cold, foggy mornings.'
      ],
      tamilCultural: [
        'தழைச்சத்தை (யுரியா) ஒரே நேரத்தில் இடாமல் 3 முதல் 4 முறை பிரித்து இடவும்.',
        'பயிர்களுக்கிடையே சரியான இடைவெளி (20x15 செ.மீ) விட்டு நடவு செய்து காற்றோட்டம் அதிகரிக்கவும்.',
        'பனிமூட்டமான நாட்களில் வயலில் அதிக நீர் தேங்காமல் வடித்து பராமரிக்கவும்.'
      ],
      biological: [
        'Foliar spray of Pseudomonas fluorescens (talc formulation @ 1 kg/acre) at early tillering.',
        'Seed treatment with Trichoderma viride @ 4 g/kg seed before nursery sowing.',
        'Incorporate green manures (Dhaincha) during soil tilth to enhance microbial antagonism.'
      ],
      tamilBiological: [
        'தூர்கட்டும் பருவத்தில் சூடோமோனாஸ் புளோரசன்ஸ் உயிர் உரத்தை (ஏக்கருக்கு 1 கிலோ) தெளிக்கவும்.',
        'விதைப்பதற்கு முன் ஒரு கிலோ விதைக்கு 4 கிராம் டிரைக்கோடெர்மா விரிடி கொண்டு விதை நேர்த்தி செய்க.',
        'தக்கைப்பூண்டு பசுந்தாள் உரங்களை மடக்கி உழுது மண்ணின் நுண்ணுயிர் பெருக்கத்தை அதிகரிக்கவும்.'
      ]
    },
    {
      id: 'blb',
      name: 'Bacterial Leaf Blight',
      tamilName: 'பாக்டீரியா இலைக்கருகல்',
      scientific: 'Xanthomonas oryzae pv. oryzae',
      symptoms: [
        'Water-soaked marginal stripes with wavy edges along upper leaf blades.',
        'Stripes turn straw yellow and bleach white as bacteria advance down veins.',
        'Kresek seedling wilt phase leading to whole plant lodging.'
      ],
      tamilSymptoms: [
        'இலை விளிம்புகளில் அலை போன்ற நெளிந்த மஞ்சள் நிற கோடுகள்.',
        'கோடுகள் வெளிறி வைக்கோல் நிறமாக மாறி இலைகள் காய்ந்து போதல்.',
        'நாற்று பருவத்தில் முழு பயிரும் வாடி மடியும் கிரெசெக் நிலை.'
      ],
      cultural: [
        'Immediately drain standing water from infected plots to prevent bacterial spread via water flow.',
        'Completely suspend nitrogen top-dressing until new healthy leaves emerge.',
        'Avoid trimming or clipping seedling leaf tips during transplantation in monsoon season.'
      ],
      tamilCultural: [
        'பாசன நீர் மூலம் பாக்டீரியா பரவுவதைத் தடுக்க உடனடியாக வயலிலிருந்து தண்ணீரை வடிக்கவும்.',
        'புதிய ஆரோக்கியமான இலைகள் வரும் வரை தழைச்சத்து உரம் இடுவதை முற்றிலும் நிறுத்தவும்.',
        'மழைக்காலங்களில் நாற்றின் நுனிகளை கிள்ளி நடவு செய்வதைத் தவிர்க்கவும்.'
      ],
      biological: [
        'Spray 20% fresh cow dung extract supernatant after filtering through fine muslin cloth.',
        'Foliar spray of Bacillus subtilis biocontrol formulations.',
        'Adopt resistant cultivars such as CR 1009 Sub-1 or ADT 45 in high-risk delta blocks.'
      ],
      tamilBiological: [
        '20% தெளிந்த சாணக் கரைசலை வடிகட்டி பயிர்களில் தெளிக்கவும்.',
        'பேசில்லஸ் சப்டிலிஸ் (Bacillus subtilis) உயிர் தெளிப்பானைப் பயன்படுத்தவும்.',
        'நோய் தீவிரமாக தாக்கும் பகுதிகளில் CR 1009 அல்லது ADT 45 போன்ற எதிர்ப்பு ரகங்களைப் பயிரிடவும்.'
      ]
    },
    {
      id: 'brown_spot',
      name: 'Brown Spot',
      tamilName: 'பழுப்பு புள்ளி நோய்',
      scientific: 'Bipolaris oryzae',
      symptoms: [
        'Numerous small circular to oval dark brown spots with a distinct yellow halo.',
        'Severe infection leads to dark speckled grains (chaffy paddy).',
        'Strongly correlated with potassium, silicon or zinc deficiency in the soil.'
      ],
      tamilSymptoms: [
        'மஞ்சள் வளையத்துடன் கூடிய பல சிறிய வட்ட வடிவ பழுப்பு நிற புள்ளிகள்.',
        'நெல்மணிகளில் பழுப்பு நிற புள்ளிகள் தோன்றி பதராவதால் விளைச்சல் குறையும்.',
        'மண்ணில் சாம்பல் சத்து (பொட்டாஷ்), துத்தநாகம் அல்லது சிலிக்கான் பற்றாக்குறையால் அதிகம் தோன்றும்.'
      ],
      cultural: [
        'Correct potassium deficiency by applying Muriate of Potash (MOP @ 25-30 kg/acre).',
        'Prevent soil dryness and moisture stress; maintain consistent irrigation.',
        'Soil application of Zinc Sulphate @ 10 kg/acre before final puddling.'
      ],
      tamilCultural: [
        'ஏக்கருக்கு 25-30 கிலோ பொட்டாஷ் உரத்தை சரியான தருணத்தில் இட்டு சாம்பல் சத்து குறையை போக்கவும்.',
        'மண் வறண்டு வெடிப்பு ஏற்படுவதைத் தவிர்த்து சீரான பாசனம் அளிக்கவும்.',
        'கடைசி உழவின் போது ஏக்கருக்கு 10 கிலோ ஜிங்க் சல்பேட் (துத்தநாகம்) இடவும்.'
      ],
      biological: [
        'Seed treatment with Pseudomonas fluorescens @ 10 g/kg seed.',
        'Apply enriched compost / vermicompost to augment beneficial soil humic fractions.'
      ],
      tamilBiological: [
        'ஒரு கிலோ விதைக்கு 10 கிராம் சூடோமோனாஸ் கொண்டு விதை நேர்த்தி செய்யவும்.',
        'மண்ணின் வளத்தை பெருக்க மண்புழு உரம் அல்லது நன்கு மக்கிய தொழு உரம் இடவும்.'
      ]
    },
    {
      id: 'sheath_blight',
      name: 'Sheath Blight',
      tamilName: 'இலை உறை அழுகல் நோய்',
      scientific: 'Rhizoctonia solani',
      symptoms: [
        'Oval to irregular greenish-gray spots with brown margins on leaf sheaths near water line.',
        'Lesions expand rapidly upwards into upper leaves in dense canopies.'
      ],
      tamilSymptoms: [
        'நீர்மட்டத்திற்கு மேல் உள்ள தண்டுப் பகுதியில் பழுப்பு நிற விளிம்புகளுடன் கூடிய சாம்பல் புள்ளிகள்.',
        'அடர்ந்த பயிர்களில் புள்ளிகள் மேல்நோக்கி இலைகளுக்கு விரைவாகப் பரவுதல்.'
      ],
      cultural: [
        'Practice Alternate Wetting and Drying (AWD) irrigation; allow soil surface to dry slightly between irrigations.',
        'Eliminate host weeds from field bunds and drainage canals.',
        'Apply neem cake @ 100 kg/acre during baseline land preparation.'
      ],
      tamilCultural: [
        'காய்ச்சலும் பாய்ச்சலுமான பாசன முறையைக் கடைப்பிடிக்கவும்; நீர் தேங்க விடாதீர்கள்.',
        'வரப்புகளில் உள்ள களைகளை அகற்றி பூஞ்சான் பரவுவதைத் தடுக்கவும்.',
        'நில தயாரிப்பின் போது ஏக்கருக்கு 100 கிலோ வேப்பம்பிண்ணாக்கு இடவும்.'
      ],
      biological: [
        'Spray Trichoderma viride (2 kg/acre mixed with 50 kg FYM) applied near the base of the hill.'
      ],
      tamilBiological: [
        'ஏக்கருக்கு 2 கிலோ டிரைக்கோடெர்மா விரிடியை 50 கிலோ தொழு உரத்துடன் கலந்து பயிரின் தூர்களில் இடவும்.'
      ]
    }
  ];

  const currentDisease = diseases.find(d => d.id === activeTab) || diseases[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t.navAdvisories}
            </h2>
            <p className="text-xs text-slate-500">
              Integrated Pest & Disease Management (IPM) Knowledge Base • Aligned with TNAU Extension Standards
            </p>
          </div>
        </div>
      </div>

      {/* Disease Tabs */}
      <div className="flex flex-wrap gap-2">
        {diseases.map((d) => (
          <button
            key={d.id}
            onClick={() => setActiveTab(d.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === d.id
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            <span>{d.name}</span>
            <span className="block text-[10px] font-normal opacity-80">{d.tamilName}</span>
          </button>
        ))}
      </div>

      {/* Disease Detail Card */}
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              Pathogen Profile
            </span>
            <span className="text-xs italic text-slate-400">({currentDisease.scientific})</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            {currentDisease.name} • {currentDisease.tamilName}
          </h3>
        </div>

        {/* Symptoms Section */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <span>Characteristic Diagnostic Symptoms</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-600">
            {(lang === 'ta' ? currentDisease.tamilSymptoms : currentDisease.symptoms).map((s, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cultural Practices */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Sprout className="h-4 w-4 text-emerald-700" />
            <span>Cultural & Agronomic Field Practices</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {(lang === 'ta' ? currentDisease.tamilCultural : currentDisease.cultural).map((c, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Biological / Organic Management */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
          <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <span>Biological Control & Extension Measures</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-emerald-950">
            {(lang === 'ta' ? currentDisease.tamilBiological : currentDisease.biological).map((b, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Extension Officer Contact Reminder */}
        <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            <strong>Advisory Protocol:</strong> AgroGuard AI adheres to sustainable integrated pest management. Specific chemical pesticide active ingredients and dosage rates should always be verified with your nearest Tamil Nadu Department of Agriculture Assistant Agricultural Officer (AAO) or TNAU Krishi Vigyan Kendra (KVK).
          </span>
        </div>
      </div>
    </div>
  );
}
