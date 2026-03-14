"use client";
import { useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { iqooData } from "@/lib/data";

export default function AdminPage() {
  const [qrList, setQrList] = useState<{ id: string; label: string; url: string; type: string }[]>([]);

  const baseUrl = "https://iqoo-pune-hunt.vercel.app/hunt/";


  const handleReset = async () => {
  const res = await fetch("/api/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: "pune-clan-reset-2026" }),
  });
  const data = await res.json();
  alert(data.reset ? "✅ Golden QR Reset!" : "❌ Failed: " + data.error);
};

  const generateAllQRs = async () => {
    const tempLinks = [];

    for (const [id, item] of Object.entries(iqooData)) {
      // Build URL with token baked in
      const fullUrl = `${baseUrl}${id}?t=${item.token}`;

      const dataUrl = await QRCode.toDataURL(fullUrl, {
        width: 600,
        margin: 2,
        color: {
          dark: "#EAB308",   // iQOO Yellow
          light: "#000000",  // Black Background
        },
      });

      const label =
        item.type === "special"
          ? "🏆 GOLDEN QR"
          : item.type === "empty"
          ? `Empty #${id}`
          : `${(item as any).title} #${id}`;

      tempLinks.push({ id, label, url: dataUrl, type: item.type ?? "feature" });
    }

    // Sort by numeric id
    tempLinks.sort((a, b) => Number(a.id) - Number(b.id));
    setQrList(tempLinks);
  };

  const getBorderColor = (type: string) => {
    if (type === "special") return "border-yellow-400/60";
    if (type === "empty") return "border-zinc-700/40";
    return "border-white/10";
  };

  const getLabelColor = (type: string) => {
    if (type === "special") return "text-yellow-400";
    if (type === "empty") return "text-zinc-500";
    return "text-yellow-500";
  };

  return (
    <div className="p-10 bg-black min-h-screen text-white font-sans">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-black italic uppercase">iQOO QR Control Center</h1>
        <Button onClick={generateAllQRs} className="bg-yellow-500 text-black font-bold">
          GENERATE EVENT QRs
        </Button>
        <Button onClick={handleReset} className="bg-red-500 text-white font-bold">
          RESET GOLDEN QR
        </Button>
      </div>

      <p className="text-zinc-600 text-xs font-mono mb-10">
        Tokens are baked into each QR URL — scanning without token = blocked page.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {qrList.map((qr) => (
          <div
            key={qr.id}
            className={`bg-zinc-900 p-4 rounded-2xl border ${getBorderColor(qr.type)} flex flex-col items-center`}
          >
            <p className={`font-bold mb-3 uppercase text-xs ${getLabelColor(qr.type)}`}>
              {qr.label}
            </p>
            <img src={qr.url} alt={`QR ${qr.id}`} className="rounded-lg mb-4 w-full" />
            <a
              href={qr.url}
              download={`iqoo-hunt-qr-${qr.id}.png`}
              className="w-full text-center py-2 bg-white text-black text-xs font-black rounded-lg uppercase"
            >
              Download PNG
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}