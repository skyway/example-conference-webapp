import {
  RoomType,
  P2PRoom,
  SfuRoom,
  LocalP2PRoomMember,
  LocalSFURoomMember,
  SkyWayContext,
  SkyWayRoom,
  uuidV4,
} from "@skyway-sdk/room";

export const generateMemberNameInRtcRoom = () => {
  return uuidV4();
};

export const initRtcContext = async (
  _roomType: string,
  roomName: string,
  memberName: string,
  getToken: (channelName: string, memberName: string) => Promise<string>,
  handleGetTokenError: (err: Error) => null,
  handleSetTokenError: (err: Error) => void,
): Promise<SkyWayContext | null> => {
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

  return context;
};

export const initRtcRoom = async (
  context: SkyWayContext,
  _roomType: string,
  roomName: string,
): Promise<P2PRoom | SfuRoom | null> => {
  const roomType: RoomType = _roomType === "SFU" ? "sfu" : "p2p";

  return SkyWayRoom.FindOrCreate(context, {
    type: roomType,
    name: roomName,
  });
};

export const joinRtcRoom = async (
  room: P2PRoom | SfuRoom,
  memberName: string,
): Promise<LocalP2PRoomMember | LocalSFURoomMember | null> => {
  return room.join({ name: memberName });
};
