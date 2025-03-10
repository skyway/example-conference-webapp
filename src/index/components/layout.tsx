import { ReactNode } from "react";
import { css } from "@emotion/react";
import { globalColors, animation } from "../../shared/global-style";

interface Props {
  children: ReactNode;
}
function Layout({ children }: Props) {
  return (
    <div css={wrapperStyle}>
      <h1 css={headStyle}>SkyWay Conference</h1>
      <p css={pStyle}>Video conference on web browser</p>

      <div css={contentStyle}>{children}</div>

      <p css={pStyle}>
        No registration or installs! Just create a room and share the link.
      </p>
      <a
        css={logoStyle}
        href="https://skyway.ntt.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="./images/logo.svg" alt="SkyWay" />
      </a>
      <div css={navCodeStyle}>
        <a
          css={githubLinkStyle}
          href="https://github.com/skyway/example-conference-webapp"
          target="_blank"
          rel="noopener noreferrer"
        >
          {`View source code on `}
          <img src="./images/index/GitHub_Logo.png" />
          <img src="./images/index/github-mark.svg" />
        </a>
      </div>
    </div>
  );
}

export default Layout;

const wrapperStyle = css({
  backgroundImage: "url(./images/index/bg.jpg)",
  backgroundSize: "cover",
  animation: `${animation.moveBackground} 30s linear infinite alternate`,
  height: "100vh",
  position: "relative",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
});

const contentStyle = css({
  width: "90%",
  maxWidth: 400,
  margin: "0 auto",
});

const headStyle = css({
  margin: 0,
  marginBottom: -8,
  color: globalColors.lightblue,
  fontSize: "2.5rem",
});

const pStyle = css({
  margin: "16px auto",
  color: globalColors.lightblue,
  fontSize: "1.2rem",
});

const logoStyle = css({
  position: "absolute",
  bottom: 24,
  right: 10,

  "& > img": {
    height: 60,
  },
});

const navCodeStyle = css({
  position: "absolute",
  bottom: 0,

  backgroundColor: globalColors.white,
  width: "100vw",

  display: "flex",
  justifyContent: "center",
});

const githubLinkStyle = css({
  display: "flex",
  alignItems: "center",

  "& > img": {
    height: 20,
  },
});
