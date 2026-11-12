# AgroGuard AI - System Architecture

## Overview
AgroGuard AI is designed as a modular, longitudinal crop health monitoring and early warning platform.

```
+-------------------------------------------------------------------------------+
|                             CLIENT INTERFACES                                 |
|  - React.js / Vite SPA (Port 5173)                                            |
|  - Standalone Responsive Web App (FastAPI Port 8000)                          |
|  - Mobile Viewports (PWA / Touch Responsive)                                  |
+---------------------------------------+---------------------------------------+
                                        | HTTP / JSON REST APIs
+---------------------------------------v---------------------------------------+
|                             FASTAPI APPLICATION                               |
|  +---------------------+   +---------------------+   +---------------------+  |
|  |     Auth Router     |   |    Fields Router    |   | Observations Router |  |
|  |  JWT, PBKDF2 Hashing|   |  CRUD, Geo, Soil    |   |  Grad-CAM & Pathology| |
|  +---------------------+   +---------------------+   +---------------------+  |
|  +---------------------+   +---------------------+   +---------------------+  |
|  |  Environment Router |   | Intervention Router |   |    Alerts Router    |  |
|  | Open-Meteo & Risk ML|   | Treatment Logging   |   |   Notifications     |  |
|  +---------------------+   +---------------------+   +---------------------+  |
+---------------------------------------+---------------------------------------+
                                        |
       +--------------------------------+--------------------------------+
       |                                |                                |
+------v------+                 +-------v-------+                +-------v------+
| ML ENGINES  |                 |  STORAGE / DB |                |  EXTERNAL    |
| - Grad-CAM  |                 | - SQLite      |                | - Open-Meteo |
| - RF Risk ML|                 | - SQLAlchemy  |                | - OpenStreet |
| - Pathology |                 | - Uploads/    |                |   Map Tiles  |
+-------------+                 +---------------+                +--------------+
```

## Longitudinal Workflow
Unlike single-shot crop diagnosis apps, AgroGuard AI preserves every observation in a field-specific medical history:
1. **Observation 1 (Day T):** Farmer captures leaf photo -> AI detects early disease -> Grad-CAM heatmap generated -> Alert triggered.
2. **Intervention:** Farmer records action (e.g. bio-fertilizer spray, drainage).
3. **Observation 2 (Day T+N):** Farmer captures follow-up photo -> System compares Day T vs Day T+N -> Analyzes lesion margin changes -> Adapts recommendations.
