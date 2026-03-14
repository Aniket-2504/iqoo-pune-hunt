export interface IqooFeature {
  id: string;
  title: string;
  feature: string;
  detail: string;
  type?: never; // Ensures 'type' isn't accidentally used here
  message?: never;
}

export interface IqooState {
  id: string;
  type: "empty" | "special";
  message?: string;
  feature?: string;
  detail?: string;
  title?: string;
}

export type IqooDataItem = IqooFeature | IqooState;

export const iqooData: Record<string, IqooDataItem> = {
  "1": { id: "1", title: "Processor", feature: "Snapdragon® 8 Gen 5", detail: "3nm Flagship Architecture | 3.5M+ AnTuTu Score." },
  "2": { id: "2", title: "Battery", feature: "7600mAh Silicon Carbon", detail: "India's slimmest in its class (7.9mm). 10.5 hours of non-stop BGMI." },
  "3": { id: "3", title: "Display", feature: "1.5K 144Hz AMOLED", detail: "5000 Nits Peak Brightness | 4320Hz PWM Dimming." },
  "4": { id: "4", title: "Gaming", feature: "Supercomputing Chip Q2", detail: "Concurrent 144FPS Gaming + 1.5K Super Resolution." },
  "5": { id: "5", title: "Thermals", feature: "6.5K IceCore VC", detail: "6500mm² Vapour Chamber. CPU core temp reduced by 15°C." },
  "6": { id: "6", type: "empty", message: "Loot Crate Empty! Check the next corner." },
  "7": { id: "7", type: "empty", message: "404: Feature Not Found. Keep hunting!" },
  "8": { id: "8", type: "empty", message: "So Close! Try a different QR." },
  "9": { id: "9", type: "special", feature: "GOLDEN QR FOUND", detail: "You unlocked the iQOO Goodies!" },
  "10": { id: "10", title: "Testing Zone", feature: "Sony LYT-700V OIS", detail: "Scan complete. Now head to the Live Zone to test the Camera!" }
};