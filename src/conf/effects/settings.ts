import debug from "debug";
import RootStore from "../stores";
import {
  getUserDevices,
  getUserVideoTrack,
  getUserAudioTrack,
  getDisplayVideoTrack,
} from "../utils/webrtc";
import { joinRoom } from "./room";

const log = debug("effect:settings");

export const changeDispName = (name: string, { client }: RootStore) => {
  log("changeDispName()", `${client.displayName} => ${name}`);
  client.displayName = name;
};

export const enableUserVideo = async ({ media, ui }: RootStore) => {
  log("enableUserVideo()");

  const { videoInDevices } = await getUserDevices({ video: true }).catch(
    (err) => {
      throw ui.showError(err);
    }
  );

  // must not be happened
  if (videoInDevices === null) {
    throw ui.showError(new Error("getUserDevices() returns null"));
  }
  // must not be happened
  if (videoInDevices.length === 0) {
    throw ui.showError(new Error("At leaset one video input device needed!"));
  }

  // keep video track
  const [{ deviceId }] = videoInDevices;
  const videoTrack = await getUserVideoTrack(deviceId).catch((err) => {
    throw ui.showError(err);
  });

  media.releaseVideoDevice();
  // may trigger replaceStream()
  media.setVideoTrack(videoTrack, "camera", deviceId);

  // and get valid labels...
  const devices = await getUserDevices({ video: true }).catch((err) => {
    throw ui.showError(err);
  });
  media.setVideoDevices(devices);

  log("video devices", devices.videoInDevices);
};

export const enableDisplayVideo = async (store: RootStore) => {
  log("enableDisplayVideo()");
  const { media, ui, notification } = store;

  const videoTrack = await getDisplayVideoTrack().catch((err) => {
    if (err.name === "NotAllowedError") {
      // cancelled or not supported
    } else {
      throw ui.showError(err);
    }
  });

  if (!(videoTrack instanceof MediaStreamTrack)) {
    notification.showInfo("Display selection was cancelled");
    notification.showInfo("Or your device does not support display sharing");
    log("selection was cancelled or not supported");
    return;
  }

  videoTrack.addEventListener("ended", () => disableDisplayVideo(store), {
    once: true,
  });

  media.releaseVideoDevice();
  // may trigger replaceStream()
  media.setVideoTrack(videoTrack, "display", videoTrack.label);
};

export const disableUserVideo = ({ media }: RootStore) => {
  log("disableUserVideo()");
  media.deleteVideoTrack();
};

export const disableDisplayVideo = ({ media }: RootStore) => {
  log("disableDisplayVideo()");
  media.deleteVideoTrack();
};

export const changeAudioDeviceId = async (
  deviceId: string,
  { media, ui }: RootStore
) => {
  log("changeAudioDeviceId", deviceId);

  media.releaseAudioDevice();
  const audioTrack = await getUserAudioTrack(deviceId).catch((err) => {
    throw ui.showError(err);
  });
  media.setAudioTrack(audioTrack, deviceId);
};
export const changeVideoDeviceId = async (
  deviceId: string,
  { media, ui }: RootStore
) => {
  log("changeVideoDeviceId", deviceId);

  // release current device first
  media.releaseVideoDevice();
  // then get another device, otherwise some Android will crash
  const videoTrack = await getUserVideoTrack(deviceId).catch((err) => {
    throw ui.showError(err);
  });
  media.setVideoTrack(videoTrack, "camera", deviceId);
};

export const toggleAudioMuted = ({ media }: RootStore) => {
  log("toggleAudioMuted()");
  media.toggleMuted("audio");
};

export const toggleVideoMuted = ({ media }: RootStore) => {
  log("toggleVideoMuted()");
  media.toggleMuted("video");
};

export const closeSettings = ({ ui }: RootStore) => {
  log("closeSettings()");
  ui.isSettingsOpen = false;
};

export const joinConference = (store: RootStore) => {
  log("joinConference()");
  const { ui, room } = store;

  // must not be happened
  if (room.isJoined) {
    throw ui.showError(new Error("Already in the room!"));
  }

  joinRoom(store);
  ui.isSettingsOpen = false;
};
