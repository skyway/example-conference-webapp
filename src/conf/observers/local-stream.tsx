import { useContext, useCallback, Fragment } from "react";
import { Observer } from "mobx-react";
import { StoreContext } from "../contexts";
import LocalStreamLayout from "../components/local-stream-layout";
import {
  openSettings,
  castVideo,
  toggleAudioMuted,
  toggleVideoMuted,
} from "../effects/local-stream";

function LocalStream() {
  const store = useContext(StoreContext);

  const onClickCastVideo = useCallback(() => castVideo(store), [store]);
  const onClickOpenSettings = useCallback(() => openSettings(store), [store]);
  const onClickToggleAudioMuted = useCallback(
    () => toggleAudioMuted(store),
    [store],
  );
  const onClickToggleVideoMuted = useCallback(
    () => toggleVideoMuted(store),
    [store],
  );

  const { media, client, ui } = store;
  return (
    <Observer>
      {() => {
        if (ui.isSettingsOpen) {
          return <Fragment></Fragment>;
        }

        return (
          <LocalStreamLayout
            stream={media.stream}
            displayName={client.displayName}
            browser={client.browser}
            videoType={media.videoType}
            isVideoTrackMuted={media.isVideoTrackMuted}
            isAudioTrackMuted={media.isAudioTrackMuted}
            onClickToggleAudioMuted={onClickToggleAudioMuted}
            onClickToggleVideoMuted={onClickToggleVideoMuted}
            onClickCastVideo={onClickCastVideo}
            onClickOpenSettings={onClickOpenSettings}
          />
        );
      }}
    </Observer>
  );
}

export default LocalStream;
