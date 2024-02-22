import { css } from "@emotion/react";
import { RoomStat } from "../utils/types";
import { rightMenuWidth, rightMenuTogglerHeight } from "../utils/style";
import RemoteStreamLayout from "./remote-stream-layout";

type StreamEntry = [string, MediaStream];
const sortByVideo: (a: StreamEntry, b: StreamEntry) => number = (
  [, aStream],
  [, bStream],
) =>
  aStream.getVideoTracks().length > bStream.getVideoTracks().length ? -1 : 1;

interface Props {
  streams: StreamEntry[];
  stats: [string, RoomStat][];
  pinnedMemberId: string;
  onClickSetPinned: (memberId: string) => void;
}
function RemoteStreamsLayout({
  streams,
  stats,
  pinnedMemberId,
  onClickSetPinned,
}: Props) {
  return (
    <div css={wrapperStyle}>
      <div css={headStyle}>
        <span css={numberStyle}>{streams.length}</span> participant(s)
      </div>
      {streams.sort(sortByVideo).map(([memberId, stream]) => {
        const entry = stats.find(([id]) => id === memberId);
        const stat = entry ? entry[1] : null;
        const isPinned = memberId === pinnedMemberId;
        return (
          <RemoteStreamLayout
            key={memberId}
            stream={stream}
            stat={stat}
            isPinned={isPinned}
            onClickSetPinned={() => onClickSetPinned(memberId)}
          />
        );
      })}
    </div>
  );
}

export default RemoteStreamsLayout;

const wrapperStyle = css({
  width: rightMenuWidth,
});

const headStyle = css({
  height: rightMenuTogglerHeight,
  padding: 4,
  boxSizing: "border-box",
  fontSize: ".8rem",
  textAlign: "center",
});

const numberStyle = css({
  fontSize: ".9rem",
  fontWeight: "bold",
});
