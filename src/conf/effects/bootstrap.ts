import { toJS, reaction, observe } from "mobx";
import debug from "debug";
import {
  isValidRoomId,
  isValidRoomType,
  roomIdRe,
} from "../../shared/validate";
import { getUserDevices, getUserAudioTrack } from "../utils/webrtc";
import {
  generateMemberNameInRtcRoom,
  initRtcContext,
  initRtcRoom,
} from "../utils/skyway";
import { getToken } from "../utils/skyway-auth-token";
import { RoomInit } from "../utils/types";
import RootStore from "../stores";
import { SkyWayError } from "@skyway-sdk/room";

const log = debug("effect:bootstrap");

export const checkRoomSetting = ({ ui, room, notification }: RootStore) => {
  log("checkRoomSetting()");
  const [, roomType, roomId] = location.hash.split("/");
  const params = new URLSearchParams(location.search);

  if (!isValidRoomType(roomType)) {
    throw ui.showError(
      new Error("Invalid room type! it should be `SFU` or `P2P`."),
    );
  }
  if (!isValidRoomId(roomId)) {
    throw ui.showError(
      new Error(
        `Invalid room name! it should be match \`${roomIdRe.toString()}\`.`,
      ),
    );
  }

  const handleGetTokenError = (err: Error) => {
    if (err.message === "Failed to fetch") {
      notification.showError("認証トークンの取得に失敗しました。");
      return null;
    }

    notification.showError("想定外のエラーが発生しました。");
    throw err;
  };

  const handleSetTokenError = (err: Error) => {
    if (err instanceof SkyWayError) {
      switch (err.info.name) {
        case "invalidParameter": // from SkyWayContext.Create, context.updateAuthToken
          notification.showError(err.info.detail);
          return;
      }
    }

    notification.showError("想定外のエラーが発生しました。");
    throw err;
  };

  (async () => {
    const roomName = `${roomType}_${roomId}`;
    const memberName = generateMemberNameInRtcRoom();

    const rtcContext = await initRtcContext(
      roomType,
      roomName,
      memberName,
      getToken,
      handleGetTokenError,
      handleSetTokenError,
    ).catch((err) => {
      throw ui.showError(err);
    });
    if (rtcContext === null) return;

    const rtcRoom = await initRtcRoom(rtcContext, roomType, roomName).catch(
      (err) => {
        throw ui.showError(err);
      },
    );
    if (rtcRoom === null) return;

    // just log it, do not trust them
    room.load(
      {
        mode: roomType as RoomInit["mode"],
        id: roomId,
        useH264: params.has("h264"),
      },
      rtcRoom,
      memberName,
    );

    log(`room: ${roomType}/${roomId}`);
  })();
};

export const initAudioDeviceAndClient = ({ ui, client, media }: RootStore) => {
  log("ensureAudioDevice()");

  (async () => {
    // check at least audio input exists
    const { videoInDevices, audioInDevices } = await getUserDevices({
      video: true,
      audio: true,
    }).catch((err) => {
      throw ui.showError(err);
    });

    // must not be happened
    if (videoInDevices === null) {
      throw ui.showError(new Error("getUserDevices() returns null"));
    }
    if (audioInDevices === null) {
      throw ui.showError(new Error("getUserDevices() returns null"));
    }
    if (audioInDevices.length === 0) {
      throw ui.showError(new Error("At least one audio input device needed!"));
    }

    log(
      "%s audio + %s video builtin devices are found",
      audioInDevices.length,
      videoInDevices.length,
    );

    // keep audio track
    const [{ deviceId }] = audioInDevices;
    const audioTrack = await getUserAudioTrack(deviceId).catch((err) => {
      throw ui.showError(err);
    });
    media.setAudioTrack(audioTrack, deviceId);

    // and get valid labels...
    const devices = await getUserDevices({ audio: true }).catch((err) => {
      throw ui.showError(err);
    });
    media.setAudioDevices(devices);
    log("audio devices", devices.audioInDevices);

    // load client
    client.load({
      ua: navigator.userAgent,
      hasUserVideoDevice: videoInDevices.length !== 0,
      hasGetDisplayMedia:
        typeof navigator.mediaDevices.getDisplayMedia === "function",
      name: (localStorage.getItem("SkyWayConf.displayName") || "").trim(),
    });
    log("client loaded", toJS(client));
  })();
};

export const listenStoreChanges = ({
  client,
  media,
  room,
  notification,
}: RootStore) => {
  log("listenStoreChanges()");

  const disposers = [
    reaction(
      () => room.isJoined,
      (isJoined) =>
        isJoined && notification.showInfo(`You joined the room ${room.name}`),
    ),
    reaction(
      () => media.isAudioTrackMuted,
      (muted) =>
        notification.showInfo(`Mic input was ${muted ? "muted" : "unmuted"}`),
    ),
    reaction(
      () => media.isVideoTrackMuted,
      (muted) =>
        notification.showInfo(`Video was ${muted ? "muted" : "unmuted"}`),
    ),
    observe(media, "audioDeviceId", (change) => {
      if (change.oldValue === null) {
        // skip initial value
        return;
      }
      notification.showInfo("Mic input was changed");
    }),
    observe(media, "videoDeviceId", (change) => {
      if (change.oldValue === null) {
        notification.showInfo("Video input was enabled");
        return;
      }
      if (change.newValue !== null) {
        notification.showInfo("Video input was changed");
      } else {
        notification.showInfo("Video input was disabled");
      }
    }),
    reaction(
      () => room.castRequestCount,
      () => notification.showInfo("Your video was casted to everyone"),
    ),
    reaction(
      () => client.displayName,
      (name) => {
        localStorage.setItem("SkyWayConf.displayName", name.trim());
        notification.showInfo("Display name saved");
      },
      { delay: 2000 },
    ),
  ];

  return () => disposers.forEach((d) => d());
};

export const listenGlobalEvents = ({ media, ui }: RootStore) => {
  log("listenGlobalEvents()");

  const reloadOnHashChange = () => {
    location.reload();
  };
  const reloadOnDeviceAddOrRemoved = async () => {
    log("devicechange event fired");
    const { audioInDevices, videoInDevices } = await getUserDevices({
      video: true,
      audio: true,
    }).catch((err) => {
      throw ui.showError(err);
    });

    // must not be happened
    if (audioInDevices === null || videoInDevices === null) {
      throw ui.showError(new Error("getUserDevices() returns null"));
    }

    const curAudioInDevices = media.audioInDevices;
    const curVideoInDevices = media.videoInDevices;

    // Safari fires this event on updating label(num of devices are not changed)
    if (
      curAudioInDevices.length &&
      audioInDevices.length !== curAudioInDevices.length
    ) {
      location.reload();
    }
    if (
      curVideoInDevices.length &&
      videoInDevices.length !== curVideoInDevices.length
    ) {
      location.reload();
    }
  };

  window.addEventListener("hashchange", reloadOnHashChange, false);
  navigator.mediaDevices.addEventListener(
    "devicechange",
    reloadOnDeviceAddOrRemoved,
    false,
  );

  return () => {
    log("listener removed");
    window.removeEventListener("hashchange", reloadOnHashChange);
    navigator.mediaDevices.removeEventListener(
      "devicechange",
      reloadOnDeviceAddOrRemoved,
    );
  };
};
