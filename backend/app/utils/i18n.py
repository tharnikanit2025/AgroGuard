"""
Internationalization (i18n) - Tamil and English Advisory Knowledge Base
Aligned with TNAU (Tamil Nadu Agricultural University) agronomic extension practices.
"""
from typing import Dict, List, Any

DISEASE_TRANSLATIONS: Dict[str, Dict[str, Any]] = {
    "Rice Blast": {
        "tamil_name": "நெல் குலை நோய் (Rice Blast)",
        "pathogen": "Magnaporthe oryzae (Pyricularia oryzae)",
        "symptoms": [
            "Spindle-shaped lesions with gray or whitish centers and brown borders",
            "Lesions coalesce to cause leaf drying (blast appearance)",
            "Neck rot or node infection during heading stage"
        ],
        "tamil_symptoms": [
            "நீள்வட்ட அல்லது கதிர் வடிவ சாம்பல் நிற புள்ளிகள் மற்றும் பழுப்பு நிற விளிம்புகள்",
            "புள்ளிகள் இணைந்து இலைகள் காய்ந்து குலைந்து போகும்",
            "கதிர் தோன்றும் பருவத்தில் கழுத்துப் பகுதி கருமை அடைதல்"
        ],
        "recommendations": [
            "Avoid excessive nitrogen top-dressing; apply urea in 3-4 split doses.",
            "Maintain optimal field drainage; avoid stagnant standing water in cool, foggy weather.",
            "Apply biocontrol agent Pseudomonas fluorescens (talc formulation @ 1 kg/acre foliar spray).",
            "Inspect field borders and nursery beds weekly during tillering and panicle emergence.",
            "Consult local Village Agricultural Extension Officer (VAO/AEO) for regional approved bio-formulations."
        ],
        "tamil_recommendations": [
            "அளவுக்கு அதிகமான தழைச்சத்து (யுரியா) இடுவதைத் தவிர்க்கவும்; 3-4 தவணைகளாகப் பிரித்து இடவும்.",
            "பனிமூட்டம் மற்றும் குளிர்ந்த காலங்களில் வயலில் அதிக நீர் தேங்காமல் வடித்து பராமரிக்கவும்.",
            "சூடோமோனாஸ் புளோரசன்ஸ் உயிர் உரத்தை (ஏக்கருக்கு 1 கிலோ) இலைகளில் தெளிக்கவும்.",
            "தூர்கட்டும் மற்றும் கதிர் தோன்றும் தருணங்களில் வரப்பு ஓரங்களை வாரம் ஒருமுறை கவனமாக கண்காணிக்கவும்.",
            "உள்ளூர் வேளாண் உதவி அலுவலரை (AEO) அணுகி உரிய அங்கீகரிக்கப்பட்ட உயிரியல் முறைகளை ஆலோசிக்கவும்."
        ]
    },
    "Bacterial Leaf Blight": {
        "tamil_name": "பாக்டீரியா இலைக்கருகல் நோய் (Bacterial Blight)",
        "pathogen": "Xanthomonas oryzae pv. oryzae",
        "symptoms": [
            "Water-soaked yellowish to whitish stripes along leaf margins with wavy edges",
            "Milky bacterial exudate droplets on young lesions early morning",
            "Kresek phase causing entire seedling wilting and death"
        ],
        "tamil_symptoms": [
            "இலைகளின் ஓரங்களில் அலை அலையான மஞ்சள் அல்லது வெளிறிய கோடுகள்",
            "அதிகாலை வேளையில் இளம் புள்ளிகளில் பால் போன்ற பாக்டீரியா திரவத் துளிகள்",
            "நாற்றுப் பருவத்தில் இலைகள் முழுவதும் வாடி மடிந்து போதல் (கிரெசெக் நிலை)"
        ],
        "recommendations": [
            "Drain excess water from the field immediately to prevent bacterial spread through canal water.",
            "Temporarily suspend nitrogen application until new healthy leaves emerge.",
            "Avoid field operations or clipping seedling tips during rainy and windy mornings.",
            "Spray 20% fresh cow dung extract suspension (settled supernatant) or certified copper formulation.",
            "Promote resistant rice cultivars like CR 1009 Sub-1 or ADT 45 in endemic delta blocks."
        ],
        "tamil_recommendations": [
            "நோய்க்கிருமி பாசன நீர் மூலம் பரவுவதைத் தடுக்க உடனடியாக வயலிலிருந்து தண்ணீரை வடிக்கவும்.",
            "புதிய ஆரோக்கியமான இலைகள் தோன்றும் வரை தற்காலிகமாக தழைச்சத்து இடுவதை நிறுத்தவும்.",
            "மழை மற்றும் காற்று வீசும் காலை நேரங்களில் வயலில் வேலை செய்வதையோ நாற்றின் நுனியை கிள்ளுவதையோ தவிர்க்கவும்.",
            "20% தெளிந்த சாணக் கரைசலை வடிகட்டி பயிர்களில் தெளிக்கவும்.",
            "அடிக்கடி இந்நோய் தாக்கும் டெல்டா பகுதிகளில் CR 1009 அல்லது ADT 45 போன்ற எதிர்ப்புத்திறன் ரகங்களைப் பயிரிடவும்."
        ]
    },
    "Brown Spot": {
        "tamil_name": "பழுப்பு புள்ளி நோய் (Brown Spot)",
        "pathogen": "Bipolaris oryzae (Cochliobolus miyabeanus)",
        "symptoms": [
            "Small circular to oval dark brown spots with yellowish halo across leaves",
            "Discoloration and dark spots on paddy grains (chaffy grains)",
            "Frequent occurrence in soils deficient in potassium, silicon, or zinc"
        ],
        "tamil_symptoms": [
            "இலைகளில் வட்டமான அல்லது நீள்வட்ட பழுப்பு நிற புள்ளிகள் மற்றும் மஞ்சள் வளையம்",
            "நெல்மணிகளில் பழுப்பு நிற திட்டுக்கள் மற்றும் பதர் ஆகுதல்",
            "சாம்பல் சத்து (பொட்டாஷ்), துத்தநாகம் அல்லது சிலிக்கான் பற்றாக்குறை உள்ள நிலங்களில் அதிகம் தோன்றும்"
        ],
        "recommendations": [
            "Apply balanced fertilizer with adequate Potassium (Muriate of Potash @ 25-30 kg/acre).",
            "Ensure regular irrigation; avoid drought stress or prolonged soil cracking.",
            "Foliar spray of micronutrient zinc sulfate (0.5%) if soil test shows deficiency.",
            "Treat seeds with Trichoderma harzianum prior to future sowings.",
            "Maintain organic matter in soil by incorporating green manure crops like Dhaincha or Sunnhemp."
        ],
        "tamil_recommendations": [
            "சாம்பல் சத்து (பொட்டாஷ் உரம் ஏக்கருக்கு 25-30 கிலோ) பரிந்துரைக்கப்பட்ட அளவில் சரியாக இடவும்.",
            "வறட்சி அல்லது நிலத்தில் வெடிப்பு ஏற்படுவதைத் தவிர்த்து முறையான பாசனம் அளிக்கவும்.",
            "நுண்ணூட்டச் சத்து பற்றாக்குறை இருந்தால் துத்தநாக சல்பேட் (0.5%) இலைவழி தெளிக்கவும்.",
            "அடுத்த விதைப்புக்கு முன் டிரைக்கோடெர்மா விரிடி கொண்டு விதை நேர்த்தி செய்யவும்.",
            "தக்கைப்பூண்டு அல்லது சணப்பை போன்ற பசுந்தாள் உரங்களை மடக்கி உழுது மண்ணின் வளத்தை அதிகரிக்கவும்."
        ]
    },
    "Sheath Blight": {
        "tamil_name": "இலை உறை அழுகல் நோய் (Sheath Blight)",
        "pathogen": "Rhizoctonia solani",
        "symptoms": [
            "Greenish-gray oval lesions with irregular dark brown margins on leaf sheaths near water line",
            "Lesions expand and coalesce moving upwards to upper leaf blades",
            "Severe lodging and poor grain filling under dense canopies"
        ],
        "tamil_symptoms": [
            "நீர்மட்டத்திற்கு மேல் உள்ள இலை உறைகளில் ஒழுங்கற்ற பழுப்பு நிற ஓரங்களுடன் கூடிய சாம்பல் புள்ளிகள்",
            "புள்ளிகள் ஒன்றிணைந்து மேல்நோக்கி இலைகளுக்குப் பரவுதல்",
            "அடர்ந்த பயிர்களில் தண்டு சாய்ந்து பதர் மணிகள் உருவாதல்"
        ],
        "recommendations": [
            "Practice alternate wetting and drying (AWD) irrigation; allow soil surface to dry slightly between watering.",
            "Avoid overly dense planting (maintain 20x15 cm spacing for medium duration varieties).",
            "Remove weeds and clean field bunds which host fungal sclerotia.",
            "Apply neem cake @ 100 kg/acre to soil during land preparation.",
            "Spray Trichoderma viride or Bacillus subtilis bioformulations focused towards the plant base."
        ],
        "tamil_recommendations": [
            "காய்ச்சலும் பாய்ச்சலுமான பாசன முறையை (AWD) பின்பற்றவும்; நீர் தேங்குவதைத் தவிர்க்கவும்.",
            "அதிக நெருக்கமாக நடவு செய்வதைத் தவிர்க்கவும் (சரியான இடைவெளி 20x15 செ.மீ பராமரிக்கவும்).",
            "வரப்புகளில் உள்ள களைகளை அகற்றி பூஞ்சான் தங்குவதைத் தடுக்கவும்.",
            "நில தயாரிப்பின் போது ஏக்கருக்கு 100 கிலோ வேப்பம்பிண்ணாக்கு இடவும்.",
            "பயிரின் அடிப்பகுதியில் படும்படி டிரைக்கோடெர்மா விரிடி உயிர் பூஞ்சாணத்தை தெளிக்கவும்."
        ]
    },
    "Healthy Crop": {
        "tamil_name": "ஆரோக்கியமான நெற்பயிர் (Healthy Rice Crop)",
        "pathogen": "None (No Active Pathogen Detected)",
        "symptoms": [
            "Vibrant green leaf blades without necrotic lesions or chlorotic streaks",
            "Sturdy erect tillers with vigorous vegetative growth",
            "Normal photosynthetic leaf area"
        ],
        "tamil_symptoms": [
            "புள்ளிகள் அல்லது கருகல் ஏதுமின்றி பசுமையான இலைகள்",
            "ஆரோக்கியமான தூர்கள் மற்றும் செழிப்பான வளர்ச்சி",
            "சரியான ஒளிச்சேர்க்கை பரப்பளவு கொண்ட பயிர்"
        ],
        "recommendations": [
            "Continue routine weekly visual inspections and maintain clean bunds.",
            "Maintain optimal intermittent water management (alternate wetting and drying).",
            "Preserve beneficial natural enemies (spiders, dragonflies, ladybird beetles) by avoiding unwarranted chemical sprays.",
            "Record next scheduled inspection in the AgroGuard digital timeline."
        ],
        "tamil_recommendations": [
            "வழக்கமான வாராந்திர ஆய்வைத் தொடரவும் மற்றும் வரப்புகளை சுத்தமாக வைத்திருக்கவும்.",
            "காய்ச்சலும் பாய்ச்சலுமான சீரான நீர்ப்பாசன முறையைத் தொடரவும்.",
            "தேவையற்ற ரசாயனத் தெளிப்பைத் தவிர்த்து நன்மை செய்யும் பூச்சிகளை (சிலந்திகள், தும்பிகள்) பாதுகாக்கவும்.",
            "அடுத்த திட்டமிட்ட கள ஆய்வை அக்ரோகார்ட் டிஜிட்டல் காலவரிசையில் பதிவு செய்யவும்."
        ]
    }
}

def get_disease_info(disease_name: str) -> Dict[str, Any]:
    return DISEASE_TRANSLATIONS.get(disease_name, DISEASE_TRANSLATIONS["Healthy Crop"])
