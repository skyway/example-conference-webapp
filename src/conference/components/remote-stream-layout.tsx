import { useState, Fragment } from "react";
import { css } from "@emotion/react";
import { globalColors } from "../../shared/global-style";
import { RoomStat } from "../utils/types";
import { rightMenuWidth } from "../utils/style";
import Video from "./video";
import StreamController from "./stream-controller";
import { Icon, IconButton } from "./icon";
import StreamInfo from "./stream-info";
import VADetector from "./va-detector";

interface Props {
  stream: MediaStream;
  stat: RoomStat | null;
  isPinned: boolean;
  onClickSetPinned: () => void;
}
function RemoteStreamLayout({
  stream,
  stat,
  isPinned,
  onClickSetPinned,
}: Props) {
  const isVideoDisabled = stat && stat.isVideoDisabled ? true : false;
  const [isInfoShown, setInfoShown] = useState(false);

  return (
    <Fragment>
      <div css={videoStyle}>
        <Video stream={stream} />
        <div css={actionStyle}>
          {!isVideoDisabled ? (
            <IconButton
              name={isPinned ? "cancel_presentation" : "present_to_all"}
              showEdge={true}
              title="Pin this video"
              onClick={onClickSetPinned}
            />
          ) : null}
          <IconButton
            name="info"
            showEdge={true}
            title="Toggle stream info"
            onClick={() => setInfoShown(!isInfoShown)}
          />
        </div>
        {isInfoShown && stat !== null ? (
          <div css={infoStyle}>
            <StreamInfo stream={stream} browser={stat.browser} />
          </div>
        ) : null}
        <div css={controllerStyle}>
          {stat !== null ? (
            <Fragment>
              <VADetector stream={stream} />
              <StreamController
                displayName={stat.displayName}
                browser={stat.browser}
                controllers={
                  <Fragment>
                    {stat.isVideoDisabled ? null : (
                      <Icon
                        name={stat.isVideoMuted ? "videocam_off" : "videocam"}
                      />
                    )}
                    <Icon name={stat.isAudioMuted ? "mic_off" : "mic"} />
                  </Fragment>
                }
              />
            </Fragment>
          ) : null}
        </div>
      </div>
    </Fragment>
  );
}

export default RemoteStreamLayout;

const videoStyle = css({
  position: "relative",
  height: (rightMenuWidth / 4) * 3,
  backgroundColor: globalColors.black,
});

const infoStyle = css({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  zIndex: 10,
});

const controllerStyle = css({
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
});

const actionStyle = css({
  position: "absolute",
  top: 4,
  right: 4,
  zIndex: 100,
  display: "flex",
  alignItems: "center",
  color: globalColors.white,
});
