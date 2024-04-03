import { ReactNode } from "react";
import { css } from "@emotion/react";
import { zIndex } from "../utils/style";

interface Props {
  children: ReactNode;
}
function NotificationLayout({ children }: Props) {
  return <div css={wrapperStyle}>{children}</div>;
}

const wrapperStyle = css({
  position: "absolute",
  top: 8,
  left: 8,
  zIndex: zIndex.notification,
});

export default NotificationLayout;
