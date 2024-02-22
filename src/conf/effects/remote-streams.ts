import debug from "debug";
import RootStore from "../stores";
const log = debug("effect:remote-streams");

export const setPinned = (id: string, { room }: RootStore) => {
  const pinnedMemberId = room.pinnedMemberId === id ? null : id;
  log("setPinned()", pinnedMemberId);

  room.pinnedMemberId = pinnedMemberId;
};
