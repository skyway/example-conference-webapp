import { css, keyframes } from "@emotion/react";

export const fontSize = 16;

export const globalColors = {
  blue: "#0e367d",
  blueAlpha: `rgba(14, 54, 125, 0.5)`,
  lightblue: "#3178c4",
  lightblueAlpha: `rgba(49, 120, 196, 0.5)`,
  red: "#ff6673",
  gray: "#eee",
  white: "#fff",
  black: "#111",
};

export const animation = {
  moveBackground: keyframes`
      0% { background-position: top left; }
    100% { background-position: top right; }
  `,
};

export const globalStyle = css({
  html: {
    WebkitFontSmoothing: "antialiased",
  },
  body: {
    margin: 0,
    fontSize,
    fontFamily: '"Open Sans", sans-serif',
    fontWeight: "lighter",
    lineHeight: 1.5,
    height: "100vh",
  },
  "#app-root": {
    height: "100vh",
    overflow: "hidden",
  },
});
