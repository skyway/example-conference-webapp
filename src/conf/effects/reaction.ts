import debug from "debug";
import RootStore from "../stores";
const log = debug("effect:reaction");

export const toggleReaction = ({ ui }: RootStore) => {
  log(`toggleReaction() -> ${!ui.isReactionOpen}`);
  ui.isReactionOpen = !ui.isReactionOpen;
};

export const sendReaction = (reaction: string, { room, client }: RootStore) => {
  log("sendReaction()", reaction);
  room.addReaction(client.displayName, reaction);
};
