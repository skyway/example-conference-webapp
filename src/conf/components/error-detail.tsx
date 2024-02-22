import { css } from "@emotion/react";
import { globalColors } from "../../shared/global-style";

interface Props {
  error: Error;
}
function Error({ error }: Props) {
  return (
    <div css={wrapperStyle}>
      <h2 css={headStyle}>{error.message || error.name}</h2>
      <pre css={detailStyle}>
        {error.stack || "Stack trace is not available."}
      </pre>
    </div>
  );
}

export default Error;

const wrapperStyle = css({
  color: globalColors.black,
  margin: 16,
});

const headStyle = css({
  fontWeight: 900,
});

const detailStyle = css({
  whiteSpace: "pre-wrap",
});
