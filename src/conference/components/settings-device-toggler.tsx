import { css } from "@emotion/react";

interface Props {
  state: "ON" | "OFF";
  onClick: () => void;
}
function SettingsDeviceToggler({ state, onClick }: Props) {
  return (
    <span css={wrapperStyle}>
      <button onClick={onClick}>{state === "ON" ? "OFF" : "ON"}</button>
    </span>
  );
}

export default SettingsDeviceToggler;

const wrapperStyle = css({
  textAlign: "center",
});
