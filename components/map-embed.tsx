"use client";

interface MapEmbedProps {
  lat: number;
  lng: number;
  zoom?: number;
  height?: number;
}

export default function MapEmbed({ lat, lng, zoom = 16, height = 240 }: MapEmbedProps) {
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
  return (
    <div style={{ width: "100%", height }} className="rounded-lg overflow-hidden border">
      <iframe
        title="Map"
        width="100%"
        height={height}
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={src}
      />
    </div>
  );
}
