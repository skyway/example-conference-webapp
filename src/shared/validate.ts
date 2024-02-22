export const isValidRoomType = (type: string): boolean => {
  if (type === "SFU" || type === "P2P") {
    return true;
  }
  return false;
};

export const maxRoomIdLength = 16;
export const roomIdRe = "^[0-9a-z_-]{4,16}$";
export const isValidRoomId = (name: string): boolean => {
  return new RegExp(roomIdRe).test(name);
};
