"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

const TopographicMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (token) {
      setMapboxToken(token);
      mapboxgl.accessToken = token;
    } else {
      console.error("Mapbox token not found in environment variables");
    }
  }, []);

  useEffect(() => {
    if (map.current || !mapboxToken) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/cjaudgl840gn32rnrepcb9b9g",
      center: [-78.8396, 37.9996], // Coordinates for Afton, Virginia
      zoom: 12,
    });

    map.current.on("load", () => {
      if (!map.current) return;

      map.current.addLayer({
        id: "arcgis-topo",
        type: "raster",
        source: {
          type: "raster",
          tiles: [
            "https://services.arcgisonline.com/arcgis/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
        },
        paint: {
          "raster-opacity": 0.5,
        },
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken]);

  if (!mapboxToken) {
    return (
      <div>
        Error: Mapbox token not found. Please check your environment variables.
      </div>
    );
  }

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
};

export default TopographicMap;
