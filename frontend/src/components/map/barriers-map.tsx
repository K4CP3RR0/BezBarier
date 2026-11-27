"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { BarrierNearby } from "@/lib/api";

const barrierIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);
  return null;
}

type Props = {
  lat: number;
  lng: number;
  barriers: BarrierNearby[];
  onSelect?: (id: string) => void;
};

export function BarriersMap({ lat, lng, barriers, onSelect }: Props) {
  return (
    <div className="h-[420px] w-full overflow-hidden rounded-lg border border-border/80">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter lat={lat} lng={lng} />

        <CircleMarker
          center={[lat, lng]}
          radius={8}
          pathOptions={{ color: "#0f766e", fillColor: "#14b8a6", fillOpacity: 0.8 }}
        >
          <Popup>Twoja pozycja</Popup>
        </CircleMarker>

        {barriers.map((b) => (
          <Marker
            key={b.id}
            position={[Number(b.lat), Number(b.lng)]}
            icon={barrierIcon}
            eventHandlers={{
              click: () => onSelect?.(b.id),
            }}
          >
            <Popup>
              <strong>{b.category_name}</strong>
              <br />
              {b.description}
              <br />
              <span style={{ fontSize: 12, opacity: 0.7 }}>{b.status_name}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}