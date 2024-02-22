import * as React from "react";
import { FunctionComponent } from "react";
import { css } from "@emotion/react";
import { VideoEffects } from "../utils/types";

interface Props {
  deviceId: string;
  inDevices: MediaDeviceInfo[];
  onChangeDeviceId: (deviceId: string) => void;
}
export const SettingsDeviceSelector: FunctionComponent<Props> = ({
  deviceId,
  inDevices,
  onChangeDeviceId,
}: Props) => (
  <select
    value={deviceId || ""}
    onChange={(ev) => onChangeDeviceId(ev.target.value)}
    css={formStyle}
  >
    {inDevices.map((device) => (
      <option key={device.deviceId} value={device.deviceId}>
        {device.label}
      </option>
    ))}
  </select>
);

interface TogglerProps {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}
export const SettingsDeviceToggler: FunctionComponent<TogglerProps> = ({
  label,
  disabled,
  onClick,
}: TogglerProps) => (
  <button css={formStyle} disabled={disabled ? true : false} onClick={onClick}>
    {label}
  </button>
);

interface VideoEffectProps {
  effectId: string;
  onChangeVideoEffect: (effectId: string) => void;
  canUseVideoEffect: boolean;
}
export const SettingsVideoEffectSelector: FunctionComponent<
  VideoEffectProps
> = ({
  effectId,
  onChangeVideoEffect,
  canUseVideoEffect,
}: VideoEffectProps) => (
  <select
    value={effectId || ""}
    onChange={(ev) => onChangeVideoEffect(ev.target.value)}
    disabled={!canUseVideoEffect}
    css={formStyle}
  >
    {Object.keys(VideoEffects).map((effectId) => (
      <option key={effectId} value={effectId}>
        {VideoEffects[effectId].label}
      </option>
    ))}
  </select>
);

const formStyle = css({
  boxSizing: "border-box",
  width: "100%",
  height: "100%",
});
