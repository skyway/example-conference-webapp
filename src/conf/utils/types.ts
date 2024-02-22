export interface RoomInit {
  mode: "sfu" | "mesh";
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

export type RoomData = RoomDataStat | RoomDataReaction | RoomDataCast;
interface RoomDataStat {
  type: "stat";
  payload: RoomStat;
}
interface RoomDataReaction {
  type: "reaction";
  payload: RoomReaction;
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

export interface RoomReaction {
  from: string;
  reaction: string;
}

export interface RoomCast {
  from: string;
}

export type NotificationType = "info" | "person" | "insert_emoticon";
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
