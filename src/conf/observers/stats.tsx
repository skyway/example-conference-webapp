import { useContext, useCallback, Fragment } from "react";
import { Observer } from "mobx-react";
import { StoreContext } from "../contexts";
import { IconButton } from "../components/icon";
import StatsLayout from "../components/stats-layout";
import { openStats, closeStats } from "../effects/stats";

export function StatsOpener() {
  const store = useContext(StoreContext);

  const onClickOpenStats = useCallback(() => openStats(store), [store]);

  return (
    <Observer>
      {() => <IconButton name="assessment" onClick={onClickOpenStats} />}
    </Observer>
  );
}

export function Stats() {
  const store = useContext(StoreContext);

  const onClickCloseStats = useCallback(() => closeStats(store), [store]);

  const { ui, room } = store;
  return (
    <Observer>
      {() => {
        if (!ui.isStatsOpen) {
          return <Fragment></Fragment>;
        }

        return (
          <StatsLayout
            isSFU={room.mode === "SFU"}
            rtcStats={room.rtcStats}
            onClickCloser={onClickCloseStats}
          />
        );
      }}
    </Observer>
  );
}
