"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const TopographicMap = dynamic(() => import("../components/TopographicMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function Home() {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN);
  }, []);

  if (!hasToken) {
    return (
      <main className="h-screen w-screen flex items-center justify-center">
        <p>
          Error: Mapbox token not found. Please check your environment
          variables.
        </p>
      </main>
    );
  }

  return (
    <main className="h-screen w-screen">
      <TopographicMap />
    </main>
  );
}
