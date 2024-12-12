import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

export const metadata = {
  title: "Topographic Map Background",
  description:
    "A page with a topographic map background using Mapbox GL and ArcGIS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
