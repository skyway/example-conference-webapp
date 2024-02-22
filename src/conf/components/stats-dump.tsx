import { useState, Fragment } from "react";
import { css } from "@emotion/react";
import { WebRTCStats } from "@skyway-sdk/room";

interface Props {
  rtcStats: WebRTCStats | null;
}
function StatsDump({ rtcStats }: Props) {
  const [searchKey, setSearchKey] = useState("");
  const filteredStats =
    rtcStats === null ? null : filterStats(rtcStats, searchKey.trim());

  return (
    <Fragment>
      <input
        type="text"
        placeholder="filter stat reports"
        value={searchKey}
        onChange={(ev) => setSearchKey(ev.target.value)}
        css={inputStyle}
      />
      <pre css={statsStyle}>
        {filteredStats === null
          ? "Loading..."
          : `${filteredStats.size} report(s) found.\n${JSON.stringify(
              filteredStats.reports,
              null,
              2,
            )}`}
      </pre>
    </Fragment>
  );
}

export default StatsDump;

const filterStats = (stats: WebRTCStats, searchKey: string) => {
  // stats not ready
  if (stats.length === 0) {
    return null;
  }

  let length = 0;
  const res: { [key: string]: unknown } = {};
  stats.forEach((stat) => {
    const key = stat.id;
    const value = stat;
    const index = JSON.stringify(value);
    // empty string is treated as included
    if (index.includes(searchKey)) {
      res[key] = value;
      length++;
    }
  });
  return { reports: res, size: length };
};

const inputStyle = css({
  boxSizing: "border-box",
  width: "100%",
});

const statsStyle = css({
  margin: 0,
  padding: 4,
  fontSize: ".8rem",
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
});
