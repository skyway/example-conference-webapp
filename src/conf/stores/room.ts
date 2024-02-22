import { makeObservable, observable, computed, action } from "mobx";
import { RoomInit, RoomStat } from "../utils/types";
import {
  P2PRoom,
  SfuRoom,
  RemoteAudioStream,
  RemoteVideoStream,
  LocalP2PRoomMember,
  LocalSFURoomMember,
  WebRTCStats,
} from "@skyway-sdk/room";

class RoomStore {
  memberName: string | null;
  member: LocalP2PRoomMember | LocalSFURoomMember | null;
  isReady: boolean;
  room: P2PRoom | SfuRoom | null;
  mode: RoomInit["mode"] | null;
  id: RoomInit["id"] | null;
  useH264: RoomInit["useH264"];
  streams: Map<string, MediaStream>;
  remoteAudioStreams: Map<string, RemoteAudioStream>;
  remoteVideoStreams: Map<string, RemoteVideoStream>;
  stats: Map<string, RoomStat>;
  pinnedMemberId: string | null;
  castRequestCount: number;
  rtcStats: WebRTCStats | null;

  constructor() {
    // Member instance
    this.memberName = null;
    this.member = null;
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
    this.pinnedMemberId = null;
    this.castRequestCount = 0;
    this.rtcStats = null;

    makeObservable(this, {
      member: observable.ref,
      isReady: observable,
      room: observable.ref,
      mode: observable,
      id: observable,
      streams: observable.shallow,
      stats: observable.shallow,
      pinnedMemberId: observable,
      castRequestCount: observable,
      rtcStats: observable.ref,
      name: computed,
      isJoined: computed,
      pinnedStream: computed,
      load: action,
      loadMember: action,
      removeStream: action,
      cleanUp: action,
    });
  }

  get name(): string {
    return `${this.mode}/${this.id}`;
  }

  get isJoined(): boolean {
    return this.member !== null;
  }

  get pinnedStream(): MediaStream | null {
    if (this.pinnedMemberId === null) {
      return null;
    }
    return this.streams.get(this.pinnedMemberId) || null;
  }

  load(
    { mode, id, useH264 }: RoomInit,
    skywayRoom: P2PRoom | SfuRoom,
    memberName: string,
  ) {
    this.mode = mode;
    this.id = id;
    this.useH264 = useH264;
    this.room = skywayRoom;
    this.memberName = memberName;
    this.isReady = true;
  }

  loadMember(member: LocalP2PRoomMember | LocalSFURoomMember) {
    this.member = member;
  }

  removeStream(memberId: string) {
    this.streams.delete(memberId);
    this.stats.delete(memberId);
    if (this.pinnedMemberId === memberId) {
      this.pinnedMemberId = null;
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
