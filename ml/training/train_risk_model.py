"""
ML Training Pipeline: Environmental Disease Risk Assessment Model
Trains a Random Forest classifier with 5-fold cross-validation on agro-climatic parameters.
Saves model weights and evaluation metrics.
"""
import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, confusion_matrix

MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
os.makedirs(MODELS_DIR, exist_ok=True)

def generate_synthetic_epidemiological_data(n_samples: int = 1500) -> tuple:
    """
    Generate agro-climatic dataset based on peer-reviewed IRRI & TNAU disease thresholds:
    Features: [Temperature (°C), Relative Humidity (%), Rainfall (mm), Soil Moisture (%), Canopy Density Index (1-5)]
    Targets: 0 (Low Risk), 1 (Moderate Risk), 2 (High Risk)
    """
    np.random.seed(42)
    # Temperature: 18 - 38 °C
    temp = np.random.uniform(18.0, 38.0, n_samples)
    # Humidity: 45 - 98 %
    humidity = np.random.uniform(45.0, 98.0, n_samples)
    # Rainfall: 0 - 65 mm
    rainfall = np.random.exponential(scale=6.0, size=n_samples)
    rainfall = np.clip(rainfall, 0.0, 70.0)
    # Soil Moisture: 40 - 95 %
    soil_moist = np.random.uniform(40.0, 95.0, n_samples)
    # Canopy Density (1: Seedling, 2: Early Tillering, 3: Late Tillering, 4: Panicle, 5: Dense Heading)
    canopy = np.random.randint(1, 6, n_samples)

    X = np.column_stack([temp, humidity, rainfall, soil_moist, canopy])
    y = np.zeros(n_samples, dtype=int)

    for i in range(n_samples):
        t, h, r, sm, c = X[i]
        score = 0
        # High humidity trigger
        if h > 85: score += 4
        elif h > 75: score += 2
        # Favourable temperature (Blast or BLB)
        if 20 <= t <= 27: score += 3
        elif 28 <= t <= 34: score += 2
        # Rainfall / Splash dispersal
        if r > 10: score += 3
        elif r > 2: score += 1
        # Canopy density
        if c >= 4: score += 2
        elif c >= 3: score += 1

        if score >= 8:
            y[i] = 2 # High Risk
        elif score >= 4:
            y[i] = 1 # Moderate Risk
        else:
            y[i] = 0 # Low Risk

    return X, y

def train_and_evaluate():
    X, y = generate_synthetic_epidemiological_data(2000)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    clf = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
    clf.fit(X_train, y_train)

    cv_scores = cross_val_score(clf, X_train, y_train, cv=5)
    test_score = clf.score(X_test, y_test)
    y_pred = clf.predict(X_test)

    print("=" * 60)
    print("Environmental Risk Prediction Model Training")
    print(f"5-Fold CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
    print(f"Test Accuracy: {test_score:.4f}")
    print("\nClassification Report (0=Low, 1=Moderate, 2=High):")
    print(classification_report(y_test, y_pred, target_names=["Low Risk", "Moderate Risk", "High Risk"]))

    model_path = os.path.join(MODELS_DIR, "environmental_risk_rf.joblib")
    joblib.dump(clf, model_path)
    print(f"[+] Model saved to: {model_path}")

    # Feature Importance
    feature_names = ["Temperature", "Relative Humidity", "Rainfall", "Soil Moisture", "Canopy Density"]
    print("\nFeature Importances (Tree MDI):")
    for name, imp in zip(feature_names, clf.feature_importances_):
        print(f"  {name:20s}: {imp:.4f}")
    print("=" * 60)

if __name__ == "__main__":
    train_and_evaluate()
