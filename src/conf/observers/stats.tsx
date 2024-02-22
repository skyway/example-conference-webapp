import { useContext, useCallback } from "react";
import { FunctionComponent } from "react";
import { Observer } from "mobx-react";
import { StoreContext } from "../contexts";
import { IconButton } from "../components/icon";
import StatsLayout from "../components/stats-layout";
import { openStats, closeStats } from "../effects/stats";

export const StatsOpener: FunctionComponent<Record<string, unknown>> = () => {
  const store = useContext(StoreContext);

  const onClickOpenStats = useCallback(() => openStats(store), [store]);

  return (
    <Observer>
      {() => <IconButton name="assessment" onClick={onClickOpenStats} />}
    </Observer>
  );
};

export const Stats: FunctionComponent<Record<string, never>> = () => {
  const store = useContext(StoreContext);

  const onClickCloseStats = useCallback(() => closeStats(store), [store]);

  const { ui, room } = store;
  return (
    <Observer>
      {() => {
        if (!ui.isStatsOpen) {
          return <></>;
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
};
