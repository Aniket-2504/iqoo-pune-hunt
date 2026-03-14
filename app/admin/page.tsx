"use client";
import { useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [qrList, setQrList] = useState<{ id: string; url: string }[]>([]);
  
  // STEP 1: CHANGE THIS TO YOUR ACTUAL DEPLOYED URL
  const baseUrl = "https://iqoo-pune-hunt.vercel.app/hunt/"; 

  const generateAllQRs = async () => {
    const tempLinks = [];
    for (let i = 1; i <= 10; i++) {
      // STEP 2: Generate the Data URL for the QR image
      const dataUrl = await QRCode.toDataURL(`${baseUrl}${i}`, {
        width: 600,
        margin: 2,
        color: {
          dark: "#EAB308", // iQOO Yellow
          light: "#000000", // Black Background
        },
      });
      tempLinks.push({ id: i.toString(), url: dataUrl });
    }
    setQrList(tempLinks);
  };

  return (
    <div className="p-10 bg-black min-h-screen text-white font-sans">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black italic uppercase">iQOO QR Control Center</h1>
        <Button onClick={generateAllQRs} className="bg-yellow-500 text-black font-bold">
          GENERATE EVENT QRs
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {qrList.map((qr) => (
          <div key={qr.id} className="bg-zinc-900 p-4 rounded-2xl border border-white/10 flex flex-col items-center">
            <p className="text-yellow-500 font-bold mb-3 uppercase text-xs">QR Code #{qr.id}</p>
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