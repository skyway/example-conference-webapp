import { ReactNode } from "react";
import { css } from "@emotion/react";
import { zIndex } from "../utils/style";

interface Props {
  children: ReactNode;
}
function LeftBottom({ children }: Props) {
  return (
    <div css={wrapperStyle}>
      <div css={bottomStyle}>{children}</div>
    </div>
  );
}

export default LeftBottom;

const wrapperStyle = css({
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  zIndex: zIndex.base,
});

const bottomStyle = css({
  position: "absolute",
  left: 8,
  bottom: 8,
});
