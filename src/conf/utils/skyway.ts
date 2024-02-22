import {
  LocalP2PRoomMember,
  LocalSFURoomMember,
  SkyWayContext,
  SkyWayRoom,
  uuidV4,
} from "@skyway-sdk/room";

export const initPeer = async (
  _roomType: string,
  roomId: string,
  getToken: (channelName: string, memberName: string) => Promise<string>,
): Promise<LocalP2PRoomMember | LocalSFURoomMember> => {
  const roomType = _roomType === "sfu" ? "sfu" : "p2p";
  const roomName = `${roomType}_${roomId}`;
  const memberName = uuidV4();

  const token = await getToken(roomName, memberName);

  const context = await SkyWayContext.Create(token);

  context.onTokenUpdateReminder.add(async () => {
    const token = await getToken(roomName, memberName);

    context.updateAuthToken(token);
  });

  const room = await SkyWayRoom.FindOrCreate(context, {
    type: roomType,
    name: roomName,
  });

  return room.join({ name: memberName });
};
