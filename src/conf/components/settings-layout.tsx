import { Fragment } from "react";
import { css } from "@emotion/react";
import { globalColors } from "../../shared/global-style";
import { VideoType, ClientBrowser } from "../utils/types";
import { modalContentWidth } from "../utils/style";
import Modal from "./modal";
import Video from "./video";
import { IconButton, Icon } from "./icon";
import { SettingsItemName, SettingsItemDevice } from "./settings-item";
import SettingsNameEdit from "./settings-name-edit";
import {
  SettingsDeviceSelector,
  SettingsDeviceToggler,
  SettingsVideoEffectSelector,
} from "./settings-device-selector";
import StreamController from "./stream-controller";

import { canUseBlurOrVirtualBackground } from "../utils/webrtc";

interface Props {
  stream: MediaStream;
  defaultDisplayName: string;
  browser: ClientBrowser;
  hasGetDisplayMedia: boolean;
  hasUserVideoDevice: boolean;
  videoType: VideoType;
  isVideoTrackMuted: boolean;
  isAudioTrackMuted: boolean;
  videoDeviceId: string;
  videoEffectId: string;
  audioDeviceId: string;
  videoInDevices: MediaDeviceInfo[];
  audioInDevices: MediaDeviceInfo[];
  isJoined: boolean;
  isDisplayNameValid: boolean;
  onChangeVideoDeviceId: (deviceId: string) => void;
  onChangeVideoEffect: (effectId: string) => void;
  onChangeAudioDeviceId: (deviceId: string) => void;
  onClickToggleVideoMuted: () => void;
  onClickToggleAudioMuted: () => void;
  onClickEnableUserVideo: () => void;
  onClickDisableUserVideo: () => void;
  onClickEnableDisplayVideo: () => void;
  onClickDisableDisplayVideo: () => void;
  onChangeDisplayName: (name: string) => void;
  onClickCloseSettings: () => void;
  onClickJoinConference: () => void;
}
function SettingsLayout({
  stream,
  defaultDisplayName,
  browser,
  hasGetDisplayMedia,
  hasUserVideoDevice,
  videoType,
  isVideoTrackMuted,
  isAudioTrackMuted,
  videoDeviceId,
  videoEffectId,
  audioDeviceId,
  videoInDevices,
  audioInDevices,
  isJoined,
  isDisplayNameValid,
  onChangeVideoDeviceId,
  onChangeVideoEffect,
  onChangeAudioDeviceId,
  onClickToggleVideoMuted,
  onClickToggleAudioMuted,
  onClickEnableUserVideo,
  onClickDisableUserVideo,
  onClickEnableDisplayVideo,
  onClickDisableDisplayVideo,
  onChangeDisplayName,
  onClickCloseSettings,
  onClickJoinConference,
}: Props) {
  return (
    <Modal>
      <div css={wrapperStyle}>
        <div css={videoStyle}>
          <Video
            stream={stream}
            isReverse={videoType === "camera"}
            isVideoOnly={true}
          />
          <div css={controllerStyle}>
            <StreamController
              displayName={`v${browser.version}`}
              browser={browser}
              controllers={
                <Fragment>
                  {videoType === null ? null : (
                    <IconButton
                      name={isVideoTrackMuted ? "videocam_off" : "videocam"}
                      title={isVideoTrackMuted ? "Unmute video" : "Mute video"}
                      onClick={onClickToggleVideoMuted}
                    />
                  )}
                  <IconButton
                    name={isAudioTrackMuted ? "mic_off" : "mic"}
                    title={isAudioTrackMuted ? "Unmute audio" : "Mute audio"}
                    onClick={onClickToggleAudioMuted}
                  />
                </Fragment>
              }
            />
          </div>
        </div>

        <div css={settingsStyle}>
          <SettingsItemName label="NAME">
            <SettingsNameEdit
              defaultDisplayName={defaultDisplayName}
              isInvalid={!isDisplayNameValid}
              onChangeDisplayName={onChangeDisplayName}
            />
          </SettingsItemName>
          <SettingsItemDevice label="MIC.">
            <SettingsDeviceToggler label="Disable" disabled={true} />
            <SettingsDeviceSelector
              deviceId={audioDeviceId || ""}
              inDevices={audioInDevices}
              onChangeDeviceId={onChangeAudioDeviceId}
            />
          </SettingsItemDevice>
          {hasUserVideoDevice ? (
            <SettingsItemDevice label="CAMERA">
              {videoType === "camera" ? (
                <Fragment>
                  <SettingsDeviceToggler
                    label="Disable"
                    onClick={onClickDisableUserVideo}
                  />
                  <SettingsDeviceSelector
                    deviceId={videoDeviceId || ""}
                    inDevices={videoInDevices}
                    onChangeDeviceId={onChangeVideoDeviceId}
                  />
                  <div></div>
                  <div>Effect</div>
                  <SettingsVideoEffectSelector
                    effectId={videoEffectId || ""}
                    onChangeVideoEffect={onChangeVideoEffect}
                    canUseVideoEffect={canUseBlurOrVirtualBackground()}
                  />
                </Fragment>
              ) : (
                <SettingsDeviceToggler
                  label="Enable"
                  onClick={onClickEnableUserVideo}
                />
              )}
            </SettingsItemDevice>
          ) : null}
          {hasGetDisplayMedia ? (
            <SettingsItemDevice label="DISPLAY">
              {videoType === "display" ? (
                <Fragment>
                  <SettingsDeviceToggler
                    label="Disable"
                    onClick={onClickDisableDisplayVideo}
                  />
                  <SettingsDeviceToggler
                    label="Use another dispaly"
                    onClick={onClickEnableDisplayVideo}
                  />
                </Fragment>
              ) : (
                <SettingsDeviceToggler
                  label="Enable"
                  onClick={onClickEnableDisplayVideo}
                />
              )}
            </SettingsItemDevice>
          ) : null}
        </div>

        <div css={buttonWrapStyle}>
          <button
            css={doneButtonStyle}
            onClick={isJoined ? onClickCloseSettings : onClickJoinConference}
            disabled={!isDisplayNameValid}
          >
            <Fragment>
              <Icon name={isJoined ? "done" : "meeting_room"} />
              <span>{isJoined ? "CLOSE SETTINGS" : "ENTER THIS ROOM"}</span>
            </Fragment>
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default SettingsLayout;

const wrapperStyle = css({
  width: modalContentWidth,
  margin: "32px auto 0",
  boxSizing: "border-box",
  backgroundColor: globalColors.white,
});

const videoStyle = css({
  position: "relative",
  width: "100%",
  height: (modalContentWidth / 4) * 3,
  backgroundColor: globalColors.black,
});

const controllerStyle = css({
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
});

const settingsStyle = css({
  margin: 16,
});

const buttonWrapStyle = css({
  padding: 16,
  textAlign: "center",
});

const doneButtonStyle = css({
  display: "inline-flex",
  alignItems: "center",
  backgroundColor: globalColors.blue,
  color: globalColors.white,
  height: 40,
  border: 0,
  cursor: "pointer",
  padding: "0 24px",
  fontSize: "1.2rem",
  borderRadius: 2,
  "&:disabled": {
    cursor: "not-allowed",
    backgroundColor: globalColors.gray,
  },
});
