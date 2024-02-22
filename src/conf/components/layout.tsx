import { ReactNode } from "react";
import { css } from "@emotion/react";

interface Props {
  children: ReactNode;
}
function Layout({ children }: Props) {
  return <div css={wrapperStyle}>{children}</div>;
}

export default Layout;

const wrapperStyle = css({
  height: "100vh",
  position: "relative",
});
