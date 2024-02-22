import debug from "debug";
import { when } from "mobx";
import RootStore from "../stores";

const log = debug("effect:stats");

export const openStats = ({ ui, room }: RootStore) => {
  log("openStats()");
  ui.isStatsOpen = true;

  // 1000ms is enough(same as chrome://webrtc-internals)
  const timer = setInterval(async () => {
    room.room?.subscriptions.forEach(async (subscription) => {
      const localRoomMember = room.room?.localRoomMember;
      if (localRoomMember === undefined) return;
      if (subscription.subscriber.id !== localRoomMember.id) return;

      try {
        const webRTCStats = await subscription.getStats();
        room.rtcStats = webRTCStats;
      } catch (err) {
        log("getStats() error", err);
      }
    });
  }, 1000);

  // wait for closer
  when(
    () => !ui.isStatsOpen,
    () => {
      log("stop stats collector");
      clearInterval(timer);
      room.rtcStats = null;
    },
  );
};

export const closeStats = ({ ui }: RootStore) => {
  log("closeStats()");
  ui.isStatsOpen = false;
};
