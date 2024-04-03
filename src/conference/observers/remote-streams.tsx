import { useContext, useCallback } from "react";
import { Observer } from "mobx-react";
import { StoreContext } from "../contexts";
import { setPinned } from "../effects/remote-streams";
import RemoteStreamsLayout from "../components/remote-streams-layout";

function RemoteStreams() {
  const store = useContext(StoreContext);

  const onClickSetPinned = useCallback(
    (memberId: string) => setPinned(memberId, store),
    [store],
  );

  const { room } = store;
  return (
    <Observer>
      {() => (
        <RemoteStreamsLayout
          streams={[...room.streams.entries()]}
          stats={[...room.stats.entries()]}
          pinnedMemberId={room.pinnedMemberId || ""}
          onClickSetPinned={onClickSetPinned}
        />
      )}
    </Observer>
  );
}

export default RemoteStreams;
