import { useContext, Fragment } from "react";
import { Observer } from "mobx-react";
import { StoreContext } from "../contexts";
import Video from "../components/video";

function PinnedStream() {
  const store = useContext(StoreContext);

  const { room } = store;
  return (
    <Observer>
      {() => {
        if (room.pinnedStream === null) {
          return <Fragment></Fragment>;
        }

        return <Video stream={room.pinnedStream} isVideoOnly={true} />;
      }}
    </Observer>
  );
}

export default PinnedStream;
