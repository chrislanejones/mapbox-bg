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
      style: "mapbox://styles/mapbox/outdoors-v12", // Topographic/terrain style
      center: [-78.8396, 37.9996], // Coordinates for Afton, Virginia
      zoom: 12,
      // Enable terrain if your Mapbox version supports it
      terrain: {
        source: "mapbox-dem",
        exaggeration: 1.5, // Slightly exaggerate terrain height
      },
    });

    // Add terrain source for elevation data
    map.current.on("load", () => {
      if (!map.current) return;

      // Add a source for terrain data
      map.current.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.terrain-rgb",
      });

      // Remove road layers
      const roadLayers = [
        "road-simple",
        "road-motorway-simple",
        "road-trunk-simple",
        "road-primary-simple",
        "road-secondary-simple",
        "road-street-simple",
        "road-street-case",
        "road-construction",
        "road-label",
      ];

      roadLayers.forEach((layerId) => {
        if (map.current?.getLayer(layerId)) {
          map.current.removeLayer(layerId);
        }
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken]);

  if (!mapboxToken) {
    return (
      <div className="text-red-500 p-4">
        Error: Mapbox token not found. Please check your environment variables.
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className="w-full h-full"
      style={{ minHeight: "500px" }}
    />
  );
};

export default TopographicMap;
