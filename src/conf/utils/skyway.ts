import {
  RoomType,
  P2PRoom,
  SfuRoom,
  LocalP2PRoomMember,
  LocalSFURoomMember,
  SkyWayContext,
  SkyWayRoom,
  uuidV4,
  SkyWayConfigOptions,
  LogLevel,
  logLevelTypes,
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

  const configOption = createConfigOption(getLogLevel());
  const context = await SkyWayContext.Create(token, configOption).catch(
    (err) => {
      handleSetTokenError(err);
      return null;
    },
  );
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

function getLogLevel() {
  const logLevel = (localStorage.getItem("SkyWayConf.logLevel") || "").trim();
  if (logLevel === "") {
    localStorage.setItem(
      "SkyWayConf.logLevel",
      "disable or error or warn or info or debug",
    );
  }

  return (
    logLevelTypes.find((logLevelType) => logLevelType === logLevel) ?? "debug"
  );
}

function createConfigOption(logLevel: LogLevel) {
  const configOption: Partial<SkyWayConfigOptions> = {
    log: {
      level: logLevel,
      format: "object",
    },
    rtcConfig: {
      turnPolicy: "enable",
      turnProtocol: "all",
      encodedInsertableStreams: false,
      timeout: 30000,
      iceDisconnectBufferTimeout: 5000,
    },
    token: {
      updateReminderSec: 30,
    },
    member: {
      keepaliveIntervalSec: 30,
      keepaliveIntervalGapSec: 30,
    },
  };

  return configOption;
}
