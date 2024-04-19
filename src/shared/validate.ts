export const errorMessageForInvalidRoomType = `Invalid room type! it should be 'SFU' or 'P2P'.`;
export const isValidRoomType = (type: string): boolean => {
  if (type === "SFU" || type === "P2P") {
    return true;
  }
  return false;
};

// Channel、Memberのnameとして使用可能な文字種
// from https://skyway.ntt.com/en/docs/user-guide/commons/quotas-and-limits/
// > Allowed characters: Only characters composed of a-z, A-Z, 0-9, -, ., _, %, *
// - * is allowed but not used
// > Number of characters: 1~128 characters (0 characters are not allowed)
// - 4 characters or more to reduce the possibility of unexpected users using the same Room Id
// - 120 characters or less to be added prefix 'P2P_' or 'SFU_'
const minRoomNameLength = 4;
export const maxRoomNameLength = 120;
export const messageForValidRoomName = `${minRoomNameLength}~${maxRoomNameLength} characters of half-width alphanumeric, '-', '.', '_', '%'.`;
export const errorMessageForInvalidRoomName = `Invalid room name! it should be ${messageForValidRoomName}`;
export const roomNameRegex = `^[a-zA-Z0-9-._%]{${minRoomNameLength},${maxRoomNameLength}}$`;
export const isValidRoomName = (name: string): boolean => {
  return new RegExp(roomNameRegex).test(name);
};
