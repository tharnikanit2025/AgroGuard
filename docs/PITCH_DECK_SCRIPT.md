# Team KAIROS - AgroGuard AI Pitch Deck & Demo Script

**Project:** AgroGuard AI  
**College:** Chennai Institute of Technology, Chennai  
**Team Leader:** Tharnika N  
**Team Members:** Karunya Priya NS, Gowtham S, Varun S, Disvan Sundar  
**Target Domain:** Precision Agriculture & Computer Vision (Paddy in Tamil Nadu)  

---

## ⏱️ 3-Minute Hackathon Pitch Script

### [0:00 - 0:45] The Problem: "The Single-Shot Blindspot in Agritech"
> *"Respected judges and fellow innovators, good morning. We are Team KAIROS from Chennai Institute of Technology, and today we present **AgroGuard AI**.*
>
> *Every agricultural hackathon features apps where a farmer snaps a photo of a diseased leaf and gets an AI label. But ask any real paddy farmer in the Cauvery Delta: 'Does a single photo solve your problem?'*
>
> *The answer is **NO**.*
>
> *A single photo doesn't tell the farmer if the disease is spreading or receding. It doesn't know that the farmer sprayed biocontrol 5 days ago. It doesn't account for the 88% humidity and cool nighttime fog rolling in tomorrow that could trigger a devastating Rice Blast epidemic across 50 acres.*
>
> *Farmers don't need a single-shot photo guesser. **They need a longitudinal medical chart for their crops.**"*

---

### [0:45 - 1:45] The Solution: "Longitudinal Crop Health & Adaptive Early Warnings"
> *"AgroGuard AI shifts agricultural AI from snapshot classification to **Longitudinal Health Monitoring**.*
>
> *Let us walk you through our live prototype:*
>
> 1. ***Field-Specific Digital History:*** *Each paddy plot maintains a living chronological health timeline across the entire Samba or Kuruvai season.*
> 2. ***Longitudinal Progression Tracking:*** *Our system takes a baseline image from Day 14 and compares it side-by-side with a follow-up image from Day 24. It measures days elapsed, analyzes lesion margin expansion, and tells the farmer: 'Condition Stabilized' or 'Deteriorated'.*
> 3. ***Agro-Climatic Epidemic Engine:*** *Using our trained Random Forest model (achieving 93% cross-validation accuracy), we correlate ambient temperature, humidity, and rainfall to detect disease-favourable microclimates 3 to 5 days before visual symptoms erupt.*
> 4. ***Explainable AI with Grad-CAM:*** *Farmers and extension officers can verify AI predictions. Red and yellow saliency overlays prove that the model is attending to actual spindle blast lesions, not dirt or background noise.*
> 5. ***Bilingual Tamil & English Support:*** *With one click, the entire platform switches to Tamil (தமிழ்) with TNAU-recommended cultural and biocontrol practices."*

---

### [1:45 - 2:30] Live Demonstration Walkthrough
> *[Switch screen to `http://127.0.0.1:8000`]*
>
> 1. *"Notice our **Instant Demo Login** for farmer Murugan in Thanjavur.*
> 2. *On the dashboard, we see the **Geographical Risk Map** of registered fields across the Cauvery Delta with risk-coded pins.*
> 3. *We open **AI Diagnosis**, test our preloaded Tamil Nadu leaf sample, and immediately see the **Grad-CAM saliency map** highlighting the blast necrotic centers with 94% confidence.*
> 4. *We switch to **Progression Tracking**: Day 14 vs. Day 24. The AI detects lesion stabilization following an intervention.*
> 5. *We open **Weather Risk**, adjust humidity to 88%, and our model calculates an elevated 78% Blast risk, explaining the exact SHAP factor importance.*
> 6. *We click the language toggle in the top bar: the entire platform renders fluently in **தமிழ்**."*

---

### [2:30 - 3:00] Impact & Conclusion
> *"By transitioning from reactive single-image detection to longitudinal progression tracking and predictive early warning, AgroGuard AI enables farmers to reduce fungicide usage by up to 40%, catch epidemics before they wipe out crops, and safeguard the staple food supply of Tamil Nadu.*
>
> *AgroGuard AI: Protecting every tiller, from seedling to harvest.*
>
> *Thank you. We welcome your questions."*
