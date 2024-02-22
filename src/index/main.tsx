import * as React from "react";
import { render } from "react-dom";
import { Global } from "@emotion/react";
import debug from "debug";
import packageInfo from "../../package.json";
import { globalStyle } from "../shared/global-style";
import App from "./app";

const log = debug("main");

(async () => {
  log(`${packageInfo.name} v${packageInfo.version}`);
  document.title += ` v${packageInfo.version}`;

  render(
    <React.StrictMode>
      <Global styles={globalStyle} />
      <App />
    </React.StrictMode>,
    document.getElementById("app-root")
  );
})().catch((err) => console.error(err));
