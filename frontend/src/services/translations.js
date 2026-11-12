/**
 * Bilingual Translation Dictionary (English and Tamil)
 * Provides seamless localization across all AgroGuard AI modules.
 */

export const translations = {
  en: {
    // App Branding
    appName: "AgroGuard AI",
    tagline: "Adaptive Longitudinal Crop Health & Early Warning System",
    institution: "Chennai Institute of Technology, Chennai",
    teamName: "Team KAIROS",
    teamLeader: "Tharnika N",
    teamMembers: "Karunya Priya NS, Gowtham S, Varun S, Disvan Sundar",

    // Navigation
    navDashboard: "Dashboard",
    navFields: "Field Management",
    navDetection: "AI Disease Detection",
    navProgression: "Disease Progression",
    navRisk: "Environmental Risk",
    navHistory: "Digital Health History",
    navAdvisories: "Agronomic Advisories",
    navAlerts: "Early Warnings",
    login: "Sign In",
    register: "Register",
    logout: "Sign Out",
    demoLogin: "Instant Demo Login",

    // Dashboard
    statsTotalFields: "Registered Rice Fields",
    statsObservations: "Longitudinal Observations",
    statsActiveAlerts: "Active Disease Alerts",
    statsElevatedRisk: "Fields with Elevated Risk",
    recentObservations: "Recent AI Observations",
    activeWarnings: "Early Warning Alerts",
    quickAnalyze: "Quick Crop Analysis",
    fieldRiskOverview: "Geographical Field Risk Map",
    viewAll: "View All",

    // Detection
    uploadTitle: "AI Leaf Pathology Analysis",
    uploadSubtitle: "Upload a high-resolution leaf photo to diagnose fungal/bacterial pathogens with Grad-CAM visual explainability.",
    selectField: "Select Agricultural Field",
    dropzoneText: "Drag & drop leaf photo here, or click to browse",
    captureOrUpload: "Take Photo or Upload Image",
    useSampleLeaf: "Or test with preloaded Tamil Nadu rice samples:",
    analyzing: "Analyzing Leaf Pathology...",
    analyzeButton: "Analyse Crop Health",
    gradcamHeading: "Grad-CAM Model Explainability",
    gradcamDescription: "Red & yellow highlights represent the exact pathological lesion regions the AI model used to diagnose this disease.",
    confidence: "Model Confidence",
    severity: "Estimated Severity",
    symptomsObserved: "Detected Pathological Symptoms",
    recommendedActions: "Preventive Cultural Practices",
    uncertaintyWarning: "Low Confidence Notice: Symptoms are inconclusive. Please inspect in field or retake with clear natural lighting.",

    // Progression
    progressionTitle: "Longitudinal Disease Progression Tracker",
    progressionSubtitle: "Compare crop leaf observations taken on different dates to track visual disease progression and evaluate intervention efficacy.",
    selectEarlier: "Select Baseline / Earlier Observation",
    selectRecent: "Select Recent / Follow-up Observation",
    compareButton: "Run Longitudinal Comparison",
    daysElapsed: "Days Between Observations",
    severityTransition: "Severity Transition",
    visualChanges: "Visual Symptom Variations",
    adaptiveAdvisory: "Adaptive Agronomic Guidance",

    // Environmental Risk
    envTitle: "Agro-Climatic Disease Risk Engine",
    envSubtitle: "Predict disease-favourable micro-climatic windows before epidemics emerge using real-time weather and crop growth stages.",
    weatherSource: "Weather Data Source",
    temperature: "Temperature",
    humidity: "Relative Humidity",
    rainfall: "Precipitation",
    soilMoisture: "Soil Moisture",
    growthStage: "Current Growth Stage",
    calculateRisk: "Assess Disease Risk",
    shapHeading: "SHAP-Style Micro-Climatic Factor Attribution",
    pathogenRiskScores: "Pathogen-Specific Proliferation Risk",

    // Interventions
    logIntervention: "Record Field Intervention",
    actionTaken: "Action Taken / Bio-Control Applied",
    outcomeStatus: "Observed Outcome",
    saveIntervention: "Save Intervention Record"
  },

  ta: {
    // App Branding
    appName: "அக்ரோகார்ட் AI",
    tagline: "தொடர் பயிர் நல கண்காணிப்பு மற்றும் தகவமைப்பு முன்னெச்சரிக்கை அமைப்பு",
    institution: "சென்னை இன்ஸ்டிடியூட் ஆஃப் டெக்னாலஜி, சென்னை",
    teamName: "கைரோஸ் (KAIROS) குழு",
    teamLeader: "தர்ணிகா N (தலைவர்)",
    teamMembers: "காருண்யா பிரியா NS, கௌதம் S, வருண் S, திஸ்வன் சுந்தர்",

    // Navigation
    navDashboard: "முகப்பு பலகை",
    navFields: "நில மேலாண்மை",
    navDetection: "AI நோய் கண்டறிதல்",
    navProgression: "நோய் தீவிர வளர்ச்சி",
    navRisk: "வானிலை நோய் அபாயம்",
    navHistory: "பயிர் நல காலவரிசை",
    navAdvisories: "வேளாண் ஆலோசனைகள்",
    navAlerts: "முன்னெச்சரிக்கைகள்",
    login: "உள்நுழைக",
    register: "பதிவு செய்க",
    logout: "வெளியேறு",
    demoLogin: "நேரடி மாதிரி உள்நுழைவு",

    // Dashboard
    statsTotalFields: "பதிவுசெய்த நெல் வயல்கள்",
    statsObservations: "கள ஆய்வுக் குறிப்புகள்",
    statsActiveAlerts: "செயலில் உள்ள எச்சரிக்கைகள்",
    statsElevatedRisk: "அபாயத்திலுள்ள வயல்கள்",
    recentObservations: "சமீபத்திய AI ஆய்வுகள்",
    activeWarnings: "முன்னெச்சரிக்கை அறிவிப்புகள்",
    quickAnalyze: "விரைவு பயிர் பரிசோதனை",
    fieldRiskOverview: "புவியியல் வயல் அபாய வரைபடம்",
    viewAll: "அனைத்தும் காண்க",

    // Detection
    uploadTitle: "AI இலை நோய் பரிசோதனை",
    uploadSubtitle: "இலை புகைப்படத்தைப் பதிவேற்றி பூஞ்சாண்/பாக்டீரியா நோய்களை Grad-CAM விளக்கத்துடன் கண்டறியவும்.",
    selectField: "நெல் வயலைத் தேர்ந்தெடுக்கவும்",
    dropzoneText: "இலை புகைப்படத்தை இங்கே பதிவேற்றவும்",
    captureOrUpload: "புகைப்படம் எடுக்கவும் / பதிவேற்றவும்",
    useSampleLeaf: "அல்லது மாதிரி தமிழக நெல் இலைகளைத் தேர்வு செய்க:",
    analyzing: "பயிர் ஆய்வு செய்யப்படுகிறது...",
    analyzeButton: "பயிர் நலம் சோதிக்க",
    gradcamHeading: "Grad-CAM AI மாதிரி விளக்கம்",
    gradcamDescription: "சிவப்பு மற்றும் மஞ்சள் நிறப் பகுதிகள் AI மாதிரி இந்நோயை உறுதிப்படுத்த கவனம் செலுத்திய நோய் புள்ளிகளாகும்.",
    confidence: "துல்லிய நம்பிக்கை",
    severity: "நோய் தீவிரம்",
    symptomsObserved: "கண்டறியப்பட்ட அறிகுறிகள்",
    recommendedActions: "பரிந்துரைக்கப்படும் தடுப்பு முறைகள்",
    uncertaintyWarning: "குறைந்த நம்பிக்கை அறிவிப்பு: அறிகுறிகள் தெளிவாக இல்லை. வயலில் நேரடியாக ஆய்வு செய்யவும் அல்லது தெளிவான வெளிச்சத்தில் படம் எடுக்கவும்.",

    // Progression
    progressionTitle: "தொடர் நோய் வளர்ச்சி கண்காணிப்பு",
    progressionSubtitle: "முந்தைய மற்றும் தற்போதைய இலை படங்களை ஒப்பிட்டு நோய் தீவிர மாற்றத்தை கண்காணிக்கவும்.",
    selectEarlier: "முந்தைய ஆய்வைத் தேர்ந்தெடுக்கவும்",
    selectRecent: "சமீபத்திய ஆய்வைத் தேர்ந்தெடுக்கவும்",
    compareButton: "ஒப்பீட்டு ஆய்வு செய்க",
    daysElapsed: "ஆய்வுகளுக்கிடையேயான நாட்கள்",
    severityTransition: "தீவிர நிலை மாற்றம்",
    visualChanges: "காணக்கூடிய மாற்றங்கள்",
    adaptiveAdvisory: "பரிந்துரைக்கப்படும் தொடர் மேலாண்மை",

    // Environmental Risk
    envTitle: "வானிலை நோய் அபாய முன்னறிவிப்பு",
    envSubtitle: "வானிலை மற்றும் பயிர் பருவத்தைக் கொண்டு நோய் பரவும் அபாயத்தை முன்கூட்டியே கணிக்கவும்.",
    weatherSource: "வானிலை தகவல் மூலம்",
    temperature: "வெப்பநிலை",
    humidity: "காற்றின் ஈரப்பதம்",
    rainfall: "மழைப்பொழிவு",
    soilMoisture: "மண் ஈரப்பதம்",
    growthStage: "பயிர் வளர்ச்சிப் பருவம்",
    calculateRisk: "அபாயத்தைக் கணக்கிடு",
    shapHeading: "SHAP வானிலைக் காரணி முக்கியத்துவம்",
    pathogenRiskScores: "நோய்களுக்கான சாதகமான வானிலை அபாயம்",

    // Interventions
    logIntervention: "வயல் பராமரிப்பு நடவடிக்கை பதிவு",
    actionTaken: "எடுக்கப்பட்ட சிகிச்சை / தெளித்த உயிர் உரம்",
    outcomeStatus: "கவனித்த முன்னேற்றம்",
    saveIntervention: "பதிவைச் சேமிக்கவும்"
  }
};
