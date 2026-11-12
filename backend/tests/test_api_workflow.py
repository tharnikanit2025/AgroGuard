"""
AgroGuard AI - End-to-End API Workflow Verification Test Suite
Tests authentication, field management, AI leaf disease diagnosis with Grad-CAM,
environmental risk prediction, longitudinal progression comparison, and interventions.
"""
import os
import sys
import base64
from fastapi.testclient import TestClient

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app

client = TestClient(app)

def test_full_farmer_workflow():
    print("=" * 60)
    print("RUNNING AGROGUARD AI END-TO-END VERIFICATION SUITE")
    print("=" * 60)

    # 1. Test Root and Health Check
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print("[✓] Step 1: Backend Health Check OK")

    # 2. Test Demo Login
    res = client.post("/api/auth/demo-login")
    assert res.status_code == 200, f"Demo login failed: {res.text}"
    auth_data = res.json()
    token = auth_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"[✓] Step 2: Farmer Demo Login OK (User: {auth_data['user']['name']})")

    # 3. Test Dashboard Aggregation
    res = client.get("/api/dashboard", headers=headers)
    assert res.status_code == 200, f"Dashboard failed: {res.text}"
    dash_data = res.json()
    print(f"[✓] Step 3: Dashboard Stats OK (Fields: {dash_data['stats']['total_fields']}, Obs: {dash_data['stats']['total_observations']})")

    # 4. Test Field Management
    res = client.get("/api/fields", headers=headers)
    assert res.status_code == 200
    fields = res.json()
    assert len(fields) > 0, "No fields found in database."
    field_id = fields[0]["field_id"]
    print(f"[✓] Step 4: Registered Fields Retrieved OK (Count: {len(fields)}, First Field ID: {field_id})")

    # Register a New Field
    new_field_payload = {
        "field_name": "Kallanai Reach North Block - Test",
        "crop_type": "Rice / Paddy",
        "crop_variety": "ADT 45",
        "area": 3.0,
        "planting_date": "2026-10-01",
        "growth_stage": "Tillering",
        "latitude": 10.7870,
        "longitude": 79.1378
    }
    res = client.post("/api/fields", json=new_field_payload, headers=headers)
    assert res.status_code == 200, f"Create field failed: {res.text}"
    created_field = res.json()
    print(f"[✓] Step 5: Create Field OK (ID: {created_field['field_id']}, Name: {created_field['field_name']})")

    # 5. Test AI Crop Leaf Analysis with Grad-CAM
    # Read sample blast image from uploads
    sample_img_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uploads", "sample_blast_day14.jpg"))
    assert os.path.exists(sample_img_path), f"Sample image missing at {sample_img_path}"
    with open(sample_img_path, "rb") as f:
        b64_img = base64.b64encode(f.read()).decode("utf-8")

    obs_payload = {
        "field_id": field_id,
        "image_base64": f"data:image/jpeg;base64,{b64_img}",
        "farmer_notes": "Automated workflow test observation - slight spindle spots noticed."
    }
    res = client.post("/api/observations/analyze", json=obs_payload, headers=headers)
    assert res.status_code == 200, f"Observation analyze failed: {res.text}"
    obs_res = res.json()
    assert "Rice Blast" in obs_res["predicted_class"] or "Crop" in obs_res["predicted_class"]
    assert obs_res["heatmap_path"] is not None
    print(f"[✓] Step 6: AI Leaf Pathology & Grad-CAM Analysis OK (Diagnosis: {obs_res['predicted_class']}, Confidence: {obs_res['confidence']*100:.1f}%)")
    print(f"    Grad-CAM Heatmap Path: {obs_res['heatmap_path']}")

    # 6. Test Environmental Disease Risk Assessment
    risk_payload = {
        "field_id": field_id,
        "temperature": 25.0,
        "humidity": 88.0,
        "rainfall": 12.0,
        "soil_moisture": 75.0,
        "growth_stage": "Tillering"
    }
    res = client.post("/api/environment/analyze", json=risk_payload, headers=headers)
    assert res.status_code == 200, f"Environmental risk failed: {res.text}"
    risk_res = res.json()
    assert risk_res["risk_level"] in ["Moderate", "High"]
    print(f"[✓] Step 7: Environmental Risk Analysis OK (Risk: {risk_res['risk_level']}, Score: {risk_res['risk_score']}/100)")
    print(f"    Forecast Period: {risk_res['forecast_period']}")

    # 7. Test Longitudinal Disease Progression Comparison
    hist_res = client.get(f"/api/fields/{field_id}/history", headers=headers)
    assert hist_res.status_code == 200
    timeline = hist_res.json()["timeline"]
    obs_items = [item for item in timeline if item["type"] == "observation"]

    if len(obs_items) >= 2:
        compare_payload = {
            "earlier_observation_id": obs_items[-1]["id"],
            "recent_observation_id": obs_items[0]["id"]
        }
        res = client.post("/api/observations/compare", json=compare_payload, headers=headers)
        assert res.status_code == 200, f"Compare failed: {res.text}"
        comp_res = res.json()
        print(f"[✓] Step 8: Longitudinal Progression Tracking OK")
        print(f"    Days Elapsed: {comp_res['days_elapsed']} | Outcome: {comp_res['severity_change']}")
        print(f"    Summary: {comp_res['progression_summary']}")
    else:
        print("[!] Step 8: Skipped progression (needs >= 2 observations)")

    # 8. Test Farmer Intervention Logging
    itv_payload = {
        "field_id": field_id,
        "action_taken": "Applied Trichoderma viride biocontrol foliar spray (2 kg/acre); drained standing floodwater.",
        "follow_up_notes": "Leaves dry within 2 hours of drainage.",
        "outcome_status": "Condition Stabilized"
    }
    res = client.post("/api/interventions", json=itv_payload, headers=headers)
    assert res.status_code == 200, f"Intervention failed: {res.text}"
    itv_res = res.json()
    print(f"[✓] Step 9: Farmer Intervention Recorded OK (ID: {itv_res['intervention_id']}, Status: {itv_res['outcome_status']})")

    # 9. Test Early Warning Alerts
    res = client.get("/api/alerts", headers=headers)
    assert res.status_code == 200
    alerts = res.json()
    assert len(alerts) > 0
    alert_id = alerts[0]["alert_id"]
    patch_res = client.patch(f"/api/alerts/{alert_id}/read", headers=headers)
    assert patch_res.status_code == 200
    print(f"[✓] Step 10: Early Warning Alerts OK (Total: {len(alerts)}, Alert #{alert_id} marked as read)")

    print("=" * 60)
    print("ALL 10 WORKFLOW VERIFICATION TESTS PASSED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    test_full_farmer_workflow()
