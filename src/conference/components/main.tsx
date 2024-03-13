import { ReactNode } from "react";
import { css } from "@emotion/react";

interface Props {
  children: ReactNode;
}
function Main({ children }: Props) {
  return <div css={wrapperStyle}>{children}</div>;
}

export default Main;

const wrapperStyle = css({
  position: "relative",
  width: "100%",
  height: "100%",
  backgroundImage: "url(./images/logo.svg)",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
});
