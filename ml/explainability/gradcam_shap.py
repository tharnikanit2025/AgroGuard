"""
Explainability Module: Grad-CAM for Leaf Images & SHAP for Environmental Models
"""
import numpy as np

def explain_gradcam_theory():
    return """
================================================================================
GRAD-CAM (Gradient-Weighted Class Activation Mapping) FOR CROP PATHOLOGY
================================================================================
Mathematical Formulation:
  L_{Grad-CAM}^c = ReLU( \\sum_k \\alpha_k^c A^k )
  where:
  \\alpha_k^c = \\frac{1}{Z} \\sum_i \\sum_j \\frac{\\partial y^c}{\\partial A_{i,j}^k}

Clinical / Agronomic Significance:
  - Validates that the neural network is attending to actual fungal/bacterial lesion morphology
    (e.g., spindle blast centers, wavy bacterial margins, brown spots) rather than spurious background
    artifacts (dirt, farmer fingers, soil).
  - Provides visual trust and actionable confirmation for farmers and agronomists.
================================================================================
"""

def explain_shap_theory():
    return """
================================================================================
SHAP (SHapley Additive exPlanations) FOR ENVIRONMENTAL RISK ASSESSMENT
================================================================================
Mathematical Formulation:
  \\phi_i = \\sum_{S \\subseteq F \\setminus \\{i\\}} \\frac{|S|!(|F|-|S|-1)!}{|F|!} (f(S \\cup \\{i\\}) - f(S))

Agronomic Interpretation:
  - Quantifies the marginal contribution of each agro-climatic feature (e.g., Relative Humidity +32%,
    Cooler Night Temperature +28%, Heavy Rainfall +18%) to the overall epidemic potential.
  - Informs the farmer precisely WHY the field was flagged as High Risk and which variable to mitigate.
================================================================================
"""

if __name__ == "__main__":
    print(explain_gradcam_theory())
    print(explain_shap_theory())
