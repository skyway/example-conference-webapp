import { ReactNode } from "react";
import { css } from "@emotion/react";

interface Props {
  label: string;
  children: ReactNode;
}
export function SettingsItemDevice({ label, children }: Props) {
  return (
    <div css={[wrapperStyle, deviceStyle]}>
      <div css={labelStyle}>{label}</div>
      {children}
    </div>
  );
}

export function SettingsItemName({ label, children }: Props) {
  return (
    <div css={[wrapperStyle, nameStyle]}>
      <div css={labelStyle}>{label}</div>
      <div>{children}</div>
    </div>
  );
}

const wrapperStyle = css({
  margin: "8px auto",
});

const deviceStyle = css({
  display: "grid",
  gridTemplateColumns: "80px 72px 1fr",
  gridGap: 8,
  alignItems: "center",
});

const nameStyle = css({
  display: "grid",
  gridTemplateColumns: "80px 1fr",
  gridGap: 8,
  alignItems: "center",
});

const labelStyle = css({
  textAlign: "center",
});
