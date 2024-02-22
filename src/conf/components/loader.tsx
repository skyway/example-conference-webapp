import * as React from "react";
import { FunctionComponent } from "react";
import { css } from "@emotion/react";

const Loader: FunctionComponent<Record<string, never>> = () => (
  <img css={wrapperStyle} src="./images/conf/icon-loading.svg" />
);

export default Loader;

const wrapperStyle = css({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  margin: "auto",
  width: 160,
});
