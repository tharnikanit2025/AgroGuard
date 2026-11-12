import React, { useEffect, useRef } from 'react';

export default function LeafletMap({ fields = [], onSelectField }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);

  useEffect(() => {
    // Check if Leaflet L is available on window
    const L = window.L;
    if (!L || !mapContainerRef.current) return;

    // Initialize map if not already created
    if (!mapInstanceRef.current) {
      // Centered on Tamil Nadu Cauvery Delta (approx 10.8° N, 79.2° E)
      const map = L.map(mapContainerRef.current, {
        center: [10.85, 79.35],
        zoom: 8,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    markersGroup.clearLayers();

    // Custom colored pin creator
    const createColorIcon = (riskLevel) => {
      const colorMap = {
        High: '#ef4444',
        Moderate: '#f59e0b',
        Low: '#10b981',
      };
      const hex = colorMap[riskLevel] || '#10b981';

      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: ${hex};
            width: 28px;
            height: 28px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          ">
            <div style="
              width: 10px;
              height: 10px;
              background-color: white;
              border-radius: 50%;
              transform: rotate(45deg);
            "></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28]
      });
    };

    // Add marker for each registered field
    fields.forEach((field) => {
      if (field.latitude && field.longitude) {
        const risk = field.latest_risk_level || 'Low';
        const marker = L.marker([field.latitude, field.longitude], {
          icon: createColorIcon(risk)
        });

        const popupContent = `
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px; min-width: 180px;">
            <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 2px;">
              ${field.field_name}
            </div>
            <div style="font-size: 11px; color: #15803d; font-weight: 600; margin-bottom: 6px;">
              ${field.crop_variety || 'Rice / Paddy'} • ${field.area || 1.0} Acres
            </div>
            <div style="font-size: 11px; color: #475569; margin-bottom: 4px;">
              <strong>Growth Stage:</strong> ${field.growth_stage || 'Tillering'}
            </div>
            <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
              <strong>Latest Diagnosis:</strong> ${field.latest_observation ? field.latest_observation.predicted_class : 'Healthy / Routine'}
            </div>
            <div style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 700; ${
              risk === 'High' ? 'background: #fee2e2; color: #b91c1c;' :
              risk === 'Moderate' ? 'background: #fef3c7; color: #b45309;' :
              'background: #dcfce7; color: #15803d;'
            }">
              Risk: ${risk}
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          if (onSelectField) onSelectField(field);
        });
        markersGroup.addLayer(marker);
      }
    });

  }, [fields, onSelectField]);

  return (
    <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-emerald-100 shadow-sm bg-emerald-50/50">
      <div ref={mapContainerRef} className="w-full h-full z-10" />
      {/* Map Legend */}
      <div className="absolute bottom-3 right-3 z-20 bg-white/90 backdrop-blur px-3 py-2 rounded-xl shadow-md border border-slate-200/80 text-[11px] flex items-center gap-3">
        <span className="font-bold text-slate-700">Epidemic Risk:</span>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          <span className="text-slate-600">Low</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
          <span className="text-slate-600">Moderate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
          <span className="text-slate-600">High</span>
        </div>
      </div>
    </div>
  );
}
