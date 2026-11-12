# AgroGuard AI - REST API Specification

### Authentication
- `POST /api/auth/register` - Register a new farmer account
- `POST /api/auth/login` - Authenticate with email and password
- `POST /api/auth/demo-login` - Convenience 1-click login for hackathon evaluation
- `GET /api/auth/me` - Retrieve current user profile

### Dashboard
- `GET /api/dashboard` - Consolidated statistics, recent observations, active alerts, and field summaries

### Fields
- `GET /api/fields` - List all registered fields for the user
- `POST /api/fields` - Register a new agricultural field
- `GET /api/fields/{field_id}` - Detailed field record
- `GET /api/fields/{field_id}/history` - Full chronological digital health history timeline
- `GET /api/fields/{field_id}/risk` - Historical micro-climatic risk logs

### Observations & Diagnosis
- `POST /api/observations/analyze` - Upload leaf photo for AI diagnosis and Grad-CAM heatmap generation
- `POST /api/observations/compare` - Run longitudinal before-and-after comparison between two observations

### Environmental Risk
- `POST /api/environment/analyze` - Evaluate micro-climatic disease proliferation risk using Open-Meteo or manual sliders

### Interventions
- `POST /api/interventions` - Record treatment, biocontrol spray, or cultural practice
- `GET /api/interventions/field/{field_id}` - List interventions logged for a field

### Alerts
- `GET /api/alerts` - List active early warning alerts
- `PATCH /api/alerts/{alert_id}/read` - Mark an alert as acknowledged
