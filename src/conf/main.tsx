import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Global } from "@emotion/react";
import debug from "debug";
import packageInfo from "../../package.json";
import { globalStyle } from "../shared/global-style";
import App from "./app";

const log = debug("main");

(async () => {
  log(`${packageInfo.name} v${packageInfo.version}`);
  document.title += ` v${packageInfo.version}`;

  const root = createRoot(document.getElementById("app-root") as HTMLElement);
  root.render(
    <StrictMode>
      <Global styles={globalStyle} />
      <App />
    </StrictMode>,
  );
})().catch((err) => console.error(err));
