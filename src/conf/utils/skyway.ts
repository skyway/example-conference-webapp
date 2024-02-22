import {
  RoomType,
  LocalP2PRoomMember,
  LocalSFURoomMember,
  SkyWayContext,
  SkyWayRoom,
  uuidV4,
} from "@skyway-sdk/room";

export const initMember = async (
  _roomType: string,
  roomId: string,
  getToken: (channelName: string, memberName: string) => Promise<string>,
  handleGetTokenError: (err: Error) => null,
  handleSetTokenError: (err: Error) => void,
): Promise<LocalP2PRoomMember | LocalSFURoomMember | null> => {
  const roomType: RoomType = _roomType === "SFU" ? "sfu" : "p2p";
  const roomName = `${roomType}_${roomId}`;
  const memberName = uuidV4();

  const token = await getToken(roomName, memberName).catch(handleGetTokenError);
  if (token === null) return null;

  const context = await SkyWayContext.Create(token).catch((err) => {
    handleSetTokenError(err);
    return null;
  });
  if (context === null) return null;

  context.onTokenUpdateReminder.add(async () => {
    const token = await getToken(roomName, memberName).catch(
      handleGetTokenError,
    );
    if (token === null) return;

    context.updateAuthToken(token).catch(handleSetTokenError);
  });

  const room = await SkyWayRoom.FindOrCreate(context, {
    type: roomType,
    name: roomName,
  });

  return room.join({ name: memberName });
};
