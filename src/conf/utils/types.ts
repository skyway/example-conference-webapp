export interface RoomInit {
  mode: "SFU" | "P2P";
  id: string;
  useH264: boolean;
}

export interface ClientInit {
  name: string;
  ua: string;
  hasGetDisplayMedia: boolean;
  hasUserVideoDevice: boolean;
}

export interface ClientBrowser {
  name: string;
  version: string;
}

export interface UserDevices {
  videoInDevices: MediaDeviceInfo[] | null;
  audioInDevices: MediaDeviceInfo[] | null;
}

export type VideoType = "camera" | "display" | null;

export type VideoEffectKind = "none" | "blur" | "image";
export const VideoEffects: Record<
  string,
  {
    kind: VideoEffectKind;
    label: string;
    blurOption?: { blur: number };
    virtualBackgroundOption?: { image: string | HTMLImageElement };
  }
> = {
  none: { kind: "none", label: "None" },
  blur1: { kind: "blur", label: "Blur (small)", blurOption: { blur: 10 } },
  blur2: { kind: "blur", label: "Blur (large)", blurOption: { blur: 90 } },
  image1: {
    kind: "image",
    label: "Virtual Background (white)",
    virtualBackgroundOption: { image: "/images/white_background.png" },
  },
  image2: {
    kind: "image",
    label: "Virtual Background (black)",
    virtualBackgroundOption: { image: "/images/black_background.png" },
  },
};
export type VideoEffectId = keyof typeof VideoEffects;

export type RoomData = RoomDataStat | RoomDataCast;
interface RoomDataStat {
  type: "stat";
  payload: RoomStat;
}
interface RoomDataCast {
  type: "cast";
  payload: RoomCast;
}

export interface RoomStat {
  displayName: string;
  browser: ClientBrowser;
  isVideoDisabled: boolean;
  isVideoMuted: boolean;
  isAudioMuted: boolean;
}

export interface RoomCast {
  from: string;
}

export type NotificationType = "info" | "person" | "warning";
export interface NotificationItem {
  id: number;
  type: NotificationType;
  text: string;
}

/* Types for hark */
export type Hark = (stream: MediaStream, options?: HarkOptions) => Harker;
interface HarkOptions {
  interval?: number;
  threshold?: number;
  play?: boolean;
  audioContext?: AudioContext;
}
interface Harker {
  stop(): void;
  setInterval(interval: number): void;
  setThreshold(db: number): void;
  on(ev: "speaking", cb: () => void): this;
  on(ev: "stopped_speaking", cb: () => void): this;
  on(ev: "volume_change", cb: (db: number) => void): this;
}

/* Types for global */
declare global {
  interface MediaDevices {
    getDisplayMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;
  }
}
