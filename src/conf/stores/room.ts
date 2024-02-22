import { makeObservable, observable, computed, action } from "mobx";
import { RoomInit, RoomStat } from "../utils/types";
import {
  Room,
  RemoteAudioStream,
  RemoteVideoStream,
  LocalP2PRoomMember,
  LocalSFURoomMember,
  WebRTCStats,
} from "@skyway-sdk/room";

class RoomStore {
  peer: LocalP2PRoomMember | LocalSFURoomMember | null;
  isReady: boolean;
  room: Room | null;
  mode: RoomInit["mode"] | null;
  id: RoomInit["id"] | null;
  useH264: RoomInit["useH264"];
  streams: Map<string, MediaStream>;
  remoteAudioStreams: Map<string, RemoteAudioStream>;
  remoteVideoStreams: Map<string, RemoteVideoStream>;
  stats: Map<string, RoomStat>;
  pinnedId: string | null;
  castRequestCount: number;
  rtcStats: WebRTCStats | null;

  constructor() {
    // Peer instance
    this.peer = null;
    this.isReady = false;
    // (SFU|P2P)Room instance
    this.room = null;
    // room name = mode + id
    this.mode = null;
    this.id = null;
    this.useH264 = false;

    this.streams = new Map();
    this.remoteAudioStreams = new Map();
    this.remoteVideoStreams = new Map();
    this.stats = new Map();
    this.pinnedId = null;
    this.castRequestCount = 0;
    this.rtcStats = null;

    makeObservable(this, {
      peer: observable.ref,
      isReady: observable,
      room: observable.ref,
      mode: observable,
      id: observable,
      streams: observable.shallow,
      stats: observable.shallow,
      pinnedId: observable,
      castRequestCount: observable,
      rtcStats: observable.ref,
      name: computed,
      isJoined: computed,
      pinnedStream: computed,
      load: action,
      removeStream: action,
      cleanUp: action,
    });
  }

  get name(): string {
    return `${this.mode}/${this.id}`;
  }

  get isJoined(): boolean {
    return this.room !== null;
  }

  get pinnedStream(): MediaStream | null {
    if (this.pinnedId === null) {
      return null;
    }
    return this.streams.get(this.pinnedId) || null;
  }

  load(
    { mode, id, useH264 }: RoomInit,
    peer: LocalP2PRoomMember | LocalSFURoomMember,
  ) {
    this.mode = mode;
    this.id = id;
    this.useH264 = useH264;
    this.peer = peer;
    this.isReady = true;
  }

  removeStream(peerId: string) {
    this.streams.delete(peerId);
    this.stats.delete(peerId);
    if (this.pinnedId === peerId) {
      this.pinnedId = null;
    }
  }

  cleanUp() {
    if (this.room === null) {
      throw new Error("Room is null!");
    }

    [...this.streams.values()].forEach((stream) =>
      stream.getTracks().forEach((track) => track.stop()),
    );
    this.streams.clear();
    this.stats.clear();
    this.room = null;
  }
}

export default RoomStore;
