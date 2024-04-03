import { makeObservable, observable, computed, action } from "mobx";
import { IObservableArray } from "mobx";
import { UserDevices, VideoType, VideoEffectId } from "../utils/types";

class MediaStore {
  audioInDevices: IObservableArray<MediaDeviceInfo>;
  videoInDevices: IObservableArray<MediaDeviceInfo>;
  audioDeviceId: string | null;
  videoDeviceId: string | null;
  videoEffectId: VideoEffectId | null;
  isAudioTrackMuted: boolean;
  isVideoTrackMuted: boolean;
  videoType: VideoType;
  private audioTrack: MediaStreamTrack | null;
  private videoTrack: MediaStreamTrack | null;

  constructor() {
    this.audioInDevices = observable<MediaDeviceInfo>([]);
    this.videoInDevices = observable<MediaDeviceInfo>([]);
    this.audioDeviceId = null;
    this.videoDeviceId = null;
    this.videoEffectId = null;
    this.isVideoTrackMuted = false;
    this.isAudioTrackMuted = false;
    this.videoType = null;
    this.audioTrack = null;
    this.videoTrack = null;

    makeObservable<MediaStore, "audioTrack" | "videoTrack">(this, {
      audioInDevices: observable.shallow,
      videoInDevices: observable.shallow,
      audioDeviceId: observable,
      videoDeviceId: observable,
      videoEffectId: observable,
      isAudioTrackMuted: observable,
      isVideoTrackMuted: observable,
      videoType: observable,
      audioTrack: observable.ref,
      videoTrack: observable.ref,
      stat: computed,
      isAudioEnabled: computed,
      stream: computed,
      setAudioTrack: action,
      setVideoTrack: action,
      releaseAudioDevice: action,
      releaseVideoDevice: action,
      deleteVideoTrack: action,
      setAudioDevices: action,
      setVideoDevices: action,
      toggleMuted: action,
    });
  }

  get isAudioEnabled(): boolean {
    return this.audioInDevices.length !== 0;
  }

  get stream(): MediaStream {
    const stream = new MediaStream();

    if (this.audioTrack instanceof MediaStreamTrack) {
      stream.addTrack(this.audioTrack);
      this.audioTrack.enabled = !this.isAudioTrackMuted;
    }

    if (this.videoTrack instanceof MediaStreamTrack) {
      stream.addTrack(this.videoTrack);
      this.videoTrack.enabled = !this.isVideoTrackMuted;
    }

    return stream;
  }

  get stat() {
    return {
      isVideoDisabled: this.videoType === null,
      isAudioMuted: this.isAudioTrackMuted,
      isVideoMuted: this.isVideoTrackMuted,
    };
  }

  setAudioTrack(track: MediaStreamTrack, deviceId: string) {
    this.audioTrack = track;
    this.audioDeviceId = deviceId;
  }

  setVideoTrack(
    track: MediaStreamTrack,
    type: VideoType,
    deviceId: string,
    effectId: VideoEffectId,
  ) {
    this.videoTrack = track;
    this.videoType = type;
    this.videoDeviceId = deviceId;
    this.videoEffectId = effectId;
  }

  releaseAudioDevice() {
    if (this.audioTrack instanceof MediaStreamTrack) {
      this.audioTrack.stop();
    }
  }

  releaseVideoDevice() {
    if (this.videoTrack instanceof MediaStreamTrack) {
      this.videoTrack.stop();
    }
  }

  deleteVideoTrack() {
    if (this.videoTrack instanceof MediaStreamTrack) {
      this.videoTrack.stop();
    }
    this.videoTrack = null;
    this.videoType = null;
    this.videoDeviceId = null;
    this.videoEffectId = null;
  }

  setAudioDevices({ audioInDevices }: UserDevices) {
    if (audioInDevices !== null) {
      this.audioInDevices.replace(audioInDevices);
    }
  }

  setVideoDevices({ videoInDevices }: UserDevices) {
    if (videoInDevices !== null) {
      this.videoInDevices.replace(videoInDevices);
    }
  }

  toggleMuted(kind: MediaStreamTrack["kind"]) {
    if (kind === "video") {
      this.isVideoTrackMuted = !this.isVideoTrackMuted;
    }
    if (kind === "audio") {
      this.isAudioTrackMuted = !this.isAudioTrackMuted;
    }
  }
}

export default MediaStore;
