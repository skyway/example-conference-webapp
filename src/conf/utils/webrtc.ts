import { UserDevices } from "./types";

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
): Promise<MediaStreamTrack> => {
  const constraints = {
    height: 360,
    width: 640,
    frameRate: 15,
    ...(deviceId === "" ? {} : { deviceId: { exact: deviceId } }),
  };

  const stream = await navigator.mediaDevices.getUserMedia({
    video: constraints,
  });
  return stream.getVideoTracks()[0];
};

export const getDisplayVideoTrack = async (): Promise<MediaStreamTrack> => {
  const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
  return stream.getVideoTracks()[0];
};
