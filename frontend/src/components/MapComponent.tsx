"use client";

import React, { useEffect, useRef, useState } from "react";
import { GrievanceData, IssueReportData } from "../lib/api";

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  grievances?: GrievanceData[];
  issues?: IssueReportData[];
  selectedLocation?: [number, number] | null;
  onSelectLocation?: (lat: number, lng: number) => void;
  height?: string;
  className?: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  center = [22.5937, 78.9629], // Center of India
  zoom = 5,
  grievances = [],
  issues = [],
  selectedLocation = null,
  onSelectLocation,
  height = "500px",
  className = ""
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const activePinRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainerRef.current) return;

    let L: any;
    let map: any;

    const initMap = async () => {
      L = await import("leaflet");

      // Check if map is already initialized
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: true,
      });

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Create layer group for pins
      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Handle click to set location
      if (onSelectLocation) {
        map.on("click", (e: any) => {
          const { lat, lng } = e.latlng;
          onSelectLocation(lat, lng);
        });
      }

      renderMarkers(L, map, markersGroup);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient]);

  // Update markers when data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    import("leaflet").then((L) => {
      markersGroupRef.current.clearLayers();
      renderMarkers(L, mapInstanceRef.current, markersGroupRef.current);
    });
  }, [grievances, issues, selectedLocation]);

  const renderMarkers = (L: any, map: any, group: any) => {
    // Helper to create colored SVG markers
    const createPinIcon = (color: string, label: string) => {
      return L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div style="
            background-color: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.35);
            border: 2px solid #ffffff;
            cursor: pointer;
          ">
            <span style="
              transform: rotate(45deg);
              color: white;
              font-weight: 800;
              font-size: 13px;
              text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            ">${label}</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
    };

    // Category colors
    const categoryColors: Record<string, string> = {
      water: "#0284c7",       // Blue
      roads: "#ea580c",       // Saffron / Orange
      electricity: "#ca8a04", // Gold / Yellow
      sanitation: "#16a34a",  // Green
      health: "#dc2626",      // Red
      other: "#7c3aed"        // Purple
    };

    // 1. Render Grievances
    grievances.forEach((g) => {
      if (g.latitude && g.longitude) {
        const color = categoryColors[g.category?.toLowerCase()] || "#475569";
        const icon = createPinIcon(color, "G");
        const marker = L.marker([g.latitude, g.longitude], { icon });

        const statusBadge = g.status === "Resolved"
          ? '<span style="background:#dcfce7;color:#15803d;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:bold;">Resolved</span>'
          : g.status === "In Progress"
          ? '<span style="background:#fef3c7;color:#b45309;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:bold;">In Progress</span>'
          : '<span style="background:#fee2e2;color:#b91c1c;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:bold;">Open</span>';

        marker.bindPopup(`
          <div style="font-family: sans-serif; min-width: 200px; padding: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 11px; font-weight: bold; color: #64748b;">${g.id}</span>
              ${statusBadge}
            </div>
            <h4 style="font-weight: bold; font-size: 14px; margin: 0 0 4px 0; color: #0f172a;">${g.title}</h4>
            <p style="font-size: 12px; color: #475569; margin: 0 0 6px 0;">${g.description ? g.description.slice(0, 90) + '...' : ''}</p>
            <div style="font-size: 11px; color: #0369a1; font-weight: 600;">${g.department || ''}</div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">📍 ${g.city || 'India'}</div>
          </div>
        `);
        group.addLayer(marker);
      }
    });

    // 2. Render Infrastructure Issues
    issues.forEach((i) => {
      if (i.latitude && i.longitude) {
        const color = categoryColors[i.category?.toLowerCase()] || "#e11d48";
        const icon = createPinIcon(color, "⚡");
        const marker = L.marker([i.latitude, i.longitude], { icon });

        const severityBadge = i.severity === "Critical"
          ? '<span style="background:#fee2e2;color:#991b1b;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:bold;">Critical</span>'
          : '<span style="background:#ffedd5;color:#c2410c;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:bold;">' + i.severity + '</span>';

        marker.bindPopup(`
          <div style="font-family: sans-serif; min-width: 220px; padding: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 11px; font-weight: bold; color: #64748b;">${i.id}</span>
              ${severityBadge}
            </div>
            <h4 style="font-weight: bold; font-size: 14px; margin: 0 0 4px 0; color: #0f172a;">${i.detected_issue}</h4>
            ${i.image_url ? `<img src="http://localhost:8000${i.image_url}" onerror="this.style.display='none'" style="width: 100%; height: 90px; object-fit: cover; border-radius: 6px; margin: 6px 0;" />` : ''}
            <p style="font-size: 11px; color: #dc2626; margin: 4px 0; font-weight: 500;">⚠️ ${i.safety_notes || ''}</p>
            <div style="font-size: 11px; color: #64748b;">📍 ${i.address || i.city || ''}</div>
          </div>
        `);
        group.addLayer(marker);
      }
    });

    // 3. Render Selected Location Pin
    if (selectedLocation) {
      const activeIcon = L.divIcon({
        className: "active-pin-marker",
        html: `
          <div style="
            background-color: #f59e0b;
            width: 36px;
            height: 36px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.9);
            border: 3px solid #ffffff;
            animation: bounce 1s infinite alternate;
          ">
            <span style="transform: rotate(45deg); font-size: 16px;">📍</span>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });
      const selectedMarker = L.marker(selectedLocation, { icon: activeIcon });
      selectedMarker.bindPopup("<b>Selected Incident Coordinates</b><br/>Ready for submission.");
      group.addLayer(selectedMarker);
      selectedMarker.openPopup();
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-slate-200 shadow-inner ${className}`}
      style={{ height }}
    >
      {!isClient ? (
        <div className="flex items-center justify-center h-full bg-slate-100 text-slate-500 font-medium">
          Loading OpenStreetMap...
        </div>
      ) : (
        <div ref={mapContainerRef} className="w-full h-full" />
      )}
    </div>
  );
};
