import { useContext, useCallback, Fragment } from "react";
import { Observer } from "mobx-react";
import { StoreContext } from "../contexts";
import SettingsLayout from "../components/settings-layout";
import {
  changeDisplayName,
  enableUserVideo,
  disableUserVideo,
  enableDisplayVideo,
  disableDisplayVideo,
  changeVideoDeviceId,
  changeVideoEffect,
  changeAudioDeviceId,
  closeSettings,
  joinConference,
  toggleVideoMuted,
  toggleAudioMuted,
} from "../effects/settings";
import { VideoEffectId } from "../utils/types";

function Settings() {
  const store = useContext(StoreContext);

  const onChangeDisplayName = useCallback(
    (name: string) => changeDisplayName(name, store),
    [store],
  );
  const onClickEnableUserVideo = useCallback(
    () => enableUserVideo(store),
    [store],
  );
  const onClickDisableUserVideo = useCallback(
    () => disableUserVideo(store),
    [store],
  );
  const onClickEnableDisplayVideo = useCallback(
    () => enableDisplayVideo(store),
    [store],
  );
  const onClickDisableDisplayVideo = useCallback(
    () => disableDisplayVideo(store),
    [store],
  );
  const onChangeVideoDeviceId = useCallback(
    (deviceId: string) => changeVideoDeviceId(deviceId, store),
    [store],
  );
  const onChangeVideoEffect = useCallback(
    (effectId: VideoEffectId) => changeVideoEffect(effectId, store),
    [store],
  );
  const onChangeAudioDeviceId = useCallback(
    (deviceId: string) => changeAudioDeviceId(deviceId, store),
    [store],
  );
  const onClickJoinConference = useCallback(
    () => joinConference(store),
    [store],
  );
  const onClickCloseSettings = useCallback(() => closeSettings(store), [store]);
  const onClickToggleAudioMuted = useCallback(
    () => toggleAudioMuted(store),
    [store],
  );
  const onClickToggleVideoMuted = useCallback(
    () => toggleVideoMuted(store),
    [store],
  );

  const { ui, media, room, client } = store;
  return (
    <Observer>
      {() => {
        if (!ui.isSettingsOpen) {
          return <Fragment></Fragment>;
        }

        return (
          <SettingsLayout
            stream={media.stream}
            defaultDisplayName={client.displayName}
            browser={client.browser}
            hasGetDisplayMedia={client.hasGetDisplayMedia}
            hasUserVideoDevice={client.hasUserVideoDevice}
            onChangeDisplayName={onChangeDisplayName}
            videoType={media.videoType}
            onClickEnableUserVideo={onClickEnableUserVideo}
            onClickDisableUserVideo={onClickDisableUserVideo}
            onClickEnableDisplayVideo={onClickEnableDisplayVideo}
            onClickDisableDisplayVideo={onClickDisableDisplayVideo}
            videoDeviceId={media.videoDeviceId || ""}
            videoEffectId={media.videoEffectId || ""}
            audioDeviceId={media.audioDeviceId || ""}
            videoInDevices={media.videoInDevices.slice()}
            audioInDevices={media.audioInDevices.slice()}
            onChangeVideoDeviceId={onChangeVideoDeviceId}
            onChangeVideoEffect={onChangeVideoEffect}
            onChangeAudioDeviceId={onChangeAudioDeviceId}
            isVideoTrackMuted={media.isVideoTrackMuted}
            isAudioTrackMuted={media.isAudioTrackMuted}
            onClickToggleVideoMuted={onClickToggleVideoMuted}
            onClickToggleAudioMuted={onClickToggleAudioMuted}
            isJoined={room.isJoined}
            isDisplayNameValid={client.isDisplayNameValid}
            onClickCloseSettings={onClickCloseSettings}
            onClickJoinConference={onClickJoinConference}
          />
        );
      }}
    </Observer>
  );
}

export default Settings;
