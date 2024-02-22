import { ReactNode } from "react";
import { css, keyframes } from "@emotion/react";
import { zIndex } from "../utils/style";

interface Props {
  children: ReactNode;
}
function Modal({ children }: Props) {
  return <div css={wrapperStyle}>{children}</div>;
}

const wrapperStyle = css({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: zIndex.modal,
  overflow: "auto",
  backgroundColor: "rgba(0, 0, 0, .8)",
  willChange: "opacity",
  animation: `${keyframes`from { opacity: 0; } to { opacity: 1; }`} .4s ease`,
});

export default Modal;
