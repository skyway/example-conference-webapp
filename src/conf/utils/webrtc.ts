import { UserDevices, VideoEffectId, VideoEffects } from "./types";
import { BlurBackground, VirtualBackground } from "skyway-video-processors";

export const getUserDevices = async (
  options: MediaStreamConstraints,
): Promise<UserDevices> => {
  const devices = (await navigator.mediaDevices.enumerateDevices()) || [];

  const videoInDevices = [];
  const audioInDevices = [];

  for (const device of devices) {
    if (device.kind === "videoinput") {
      videoInDevices.push(device);
    }
    if (device.kind === "audioinput") {
      audioInDevices.push(device);
    }
  }

  const ret: UserDevices = {
    videoInDevices: null,
    audioInDevices: null,
  };

  if (options.video) {
    ret.videoInDevices = videoInDevices;
  }
  if (options.audio) {
    ret.audioInDevices = audioInDevices;
  }

  return ret;
};

export const getUserAudioTrack = async (
  deviceId: string,
): Promise<MediaStreamTrack> => {
  const constraints =
    deviceId === "" ? true : { deviceId: { exact: deviceId } };

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: constraints,
  });
  return stream.getAudioTracks()[0];
};

export const getUserVideoTrack = async (
  deviceId: string,
  effect: VideoEffectId,
): Promise<MediaStreamTrack> => {
  const constraints = {
    height: 360,
    width: 640,
    frameRate: 15,
    ...(deviceId === "" ? {} : { deviceId: { exact: deviceId } }),
  };

  if (VideoEffects[effect].kind === "blur") {
    return getUserVideoTrackWithBlurBackground(
      constraints,
      VideoEffects[effect].blurOption,
    );
  } else if (VideoEffects[effect].kind === "image") {
    return getUserVideoTrackWithVirtualBackground(
      constraints,
      VideoEffects[effect].virtualBackgroundOption ?? { image: "" },
    );
  }

  return getUserVideoTrackWithoutBlurBackground(constraints);
};

const getUserVideoTrackWithoutBlurBackground = async (
  constraints: MediaTrackConstraints,
): Promise<MediaStreamTrack> => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: constraints,
  });
  return stream.getVideoTracks()[0];
};

export const canUseBlurOrVirtualBackground = (): boolean => {
  return (
    "MediaStreamTrackProcessor" in window &&
    "MediaStreamTrackGenerator" in window
  );
};

const getUserVideoTrackWithBlurBackground = async (
  constraints: MediaTrackConstraints,
  options?: { blur: number },
): Promise<MediaStreamTrack> => {
  const blurBackground = new BlurBackground(options);
  await blurBackground.initialize();

  const processedStream = await blurBackground.createProcessedStream({
    constraints,
  });
  return processedStream.track ?? new MediaStreamTrack();
};

const getUserVideoTrackWithVirtualBackground = async (
  constraints: MediaTrackConstraints,
  options: { image: string | HTMLImageElement },
): Promise<MediaStreamTrack> => {
  const virtualBackground = new VirtualBackground(options);
  await virtualBackground.initialize();

  const processedStream = await virtualBackground.createProcessedStream({
    constraints,
  });
  return processedStream.track ?? new MediaStreamTrack();
};

export const getDisplayVideoTrack = async (): Promise<MediaStreamTrack> => {
  const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
  return stream.getVideoTracks()[0];
};
