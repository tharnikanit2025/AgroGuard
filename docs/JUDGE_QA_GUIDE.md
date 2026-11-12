# Team KAIROS - Hackathon Judge Q&A Defense Guide

**Project:** AgroGuard AI  
**College:** Chennai Institute of Technology, Chennai  

---

### Q1: "How is your project technically different from Plantix or existing leaf disease classifiers?"
**Team Answer:**
> *"Existing solutions operate under the **'Independent and Identically Distributed (I.I.D.) snapshot assumption'** — every image is treated as an isolated event with no memory of prior state.
>
> AgroGuard AI introduces three architectural advancements:
> 1. **Temporal State Tracking:** We model crop health longitudinally as a time-series state transition: $S_{t+1} = f(S_t, \text{Weather}_{[t, t+1]}, \text{Intervention}_t)$.
> 2. **Dual-Modality Disease Risk:** Visual leaf symptoms are combined with micro-climatic environmental modeling (temperature, relative humidity dew point, rainfall splash potential).
> 3. **Explainability Pipeline:** We don't output black-box labels. Grad-CAM visualizes convolutional feature activations directly on lesion contours, and SHAP-style factor importance explains weather risk drivers."*

---

### Q2: "Can you actually predict a disease before symptoms appear, or is that scientifically inaccurate?"
**Team Answer:**
> *"We maintain strict scientific rigor on this point: **Environmental risk is NOT proof of active infection.**
>
> Pathogen spores (such as *Magnaporthe oryzae* or *Xanthomonas oryzae*) are ubiquitous in delta agro-ecosystems. However, they only germinate and cause epidemic outbreaks when micro-climatic conditions satisfy specific physiological thresholds (e.g., continuous leaf wetness $\ge 10\text{ hours}$ and night temperatures between $20\text{--}26^\circ\text{C}$).
>
> AgroGuard AI does not claim psychic prediction. Rather, it quantifies **'Disease-Favourable Micro-Climatic Windows'**, alerting farmers to inspect their lower canopies and withhold excessive urea before spores proliferate."*

---

### Q3: "How does your model handle bad photos, motion blur, or poor lighting?"
**Team Answer:**
> *"In our backend [`disease_classifier.py`](../backend/app/ml/disease_classifier.py), every image passes through an automated pre-inference quality gateway:
> 1. **Laplacian Variance Sharpness Check:** Detects motion blur ($\text{Var} < 25.0$).
> 2. **Mean Luminance Exposure Check:** Detects underexposure ($< 30.0$) or flashlight glare ($> 235.0$).
> 3. **Uncertainty Threshold:** If maximum softmax prediction confidence is below $0.55$, the system explicitly flags the result as 'Inconclusive / Low Confidence Notice' and advises the farmer to inspect the field physically rather than generating a false positive."*

---

### Q4: "Why focus on Rice / Paddy in Tamil Nadu specifically?"
**Team Answer:**
> *"Tamil Nadu produces over 7 million tonnes of paddy annually across the Cauvery Delta (Thanjavur, Tiruvarur, Nagapattinam, Mayiladuthurai).
>
> Rice Blast and Bacterial Leaf Blight are endemic to this region due to coastal moisture and delta canal irrigation. Furthermore, delta farmers have high smartphone penetration and benefit immensely from localized advice in **Tamil (தமிழ்)** aligned with Tamil Nadu Agricultural University (TNAU) extension recommendations."*

---

### Q5: "How does your system prevent improper chemical pesticide overuse?"
**Team Answer:**
> *"Our advisory engine adheres strictly to **Integrated Pest Management (IPM)** principles:
> 1. **Cultural practices first:** Split urea application, optimal seedling spacing, field drainage.
> 2. **Biological controls:** *Pseudomonas fluorescens* foliar spray and *Trichoderma viride* seed treatment.
> 3. **Ethical Disclaimer:** We explicitly refrain from recommending unverified chemical concentrations without local Assistant Agricultural Officer (AAO) or TNAU Krishi Vigyan Kendra (KVK) consultation."*
