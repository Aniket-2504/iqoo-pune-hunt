export interface IqooFeature {
  id: string;
  title: string;
  feature: string;
  detail: string;
  token: string;
  type?: never;
  message?: never;
}
export interface IqooState {
  id: string;
  type: "empty" | "special";
  token: string;
  message?: string;
  feature?: string;
  detail?: string;
  title?: string;
}
export type IqooDataItem = IqooFeature | IqooState;

export const iqooData: Record<string, IqooDataItem> = {
  // ── 8 FEATURE QRs ──
  "1":  { id: "1",  token: "aX9kPm2q", title: "Processor", feature: "Snapdragon® 8 Gen 5",        detail: "3nm TSMC Architecture | 3.5M+ AnTuTu Score. 36% higher CPU & 46% better NPU than before." },
  "2":  { id: "2",  token: "bR7mKw3n", title: "Battery",   feature: "7600mAh Silicon Anode",       detail: "India's slimmest in its class at 7.9mm. 100W FlashCharge — from 0 to full, faster than ever." },
  "3":  { id: "3",  token: "cZ5pLv6j", title: "Display",   feature: "1.5K 144Hz AMOLED",           detail: "5000 Nits Local Peak Brightness | EyeCare certified. Sunlight algorithm keeps it crystal clear outdoors." },
  "4":  { id: "4",  token: "dY2nMx9f", title: "Gaming",    feature: "SuperComputing Chip Q2",      detail: "Stable 144FPS Gaming | 1.5K Game Super Resolution. Low-latency network chip built in." },
  "5":  { id: "5",  token: "eW4qNu1h", title: "Thermals",  feature: "6.5K IceCore VC",             detail: "6500mm² Vapour Chamber + Dual-Layer Graphite. Stays cool under the heaviest gaming loads." },
  "6":  { id: "6",  token: "fV8rOt5g", title: "Camera",    feature: "50MP Sony LYT-700V",          detail: "OIS + 4K@60FPS | AI Super Night Mode | NICE 2.0 imaging. 32MP selfie camera up front." },
  "7":  { id: "7",  token: "gU3sPy7d", title: "Design",    feature: "Perfect Fit | IP68 + IP69",   detail: "6.59\" screen, 94.57% body ratio, 7.9mm slim. Metal unibody built to survive rain, dust & drops." },
  "8":  { id: "8",  token: "hT6wQz4k", title: "Software",  feature: "OriginOS 6 + Android 16",     detail: "4 years OS updates | 6 years security patches. AI Captions, AI Erase, AI Magic Move & more." },

  // ── SPECIAL GOLDEN QR ──
  "9":  { id: "9",  token: "iS1vRb8m", type: "special", feature: "GOLDEN QR FOUND 🏆", detail: "You are the iQOO Pune Clan's Top Hunter! Screenshot this & find a Clan Member to claim your prize!" },

  // ── 3 EMPTY QRs (print each multiple times) ──
  "10": { id: "10", token: "jR9uSc2p", type: "empty", message: "Loot Crate Empty! The real treasure is elsewhere. Keep hunting!" },
  "11": { id: "11", token: "kQ8tRd3m", type: "empty", message: "404: Feature Not Found. Try a different corner, Quester!" },
  "12": { id: "12", token: "lP7sUe4n", type: "empty", message: "So close! But this one's empty. The Golden QR is still out there!" },
};