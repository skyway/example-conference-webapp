import { useState } from "react";
import { css } from "@emotion/react";
import { globalColors } from "../../shared/global-style";
import {
  isValidRoomName,
  roomNameRegex,
  maxRoomNameLength,
  messageForValidRoomName,
} from "../../shared/validate";
import { RoomInit } from "../utils/types";

interface Props {
  onSubmit: (init: RoomInit) => void;
}
function RoomCreate(props: Props) {
  const [roomType, setRoomType] = useState("SFU");
  const [roomName, setRoomName] = useState("");
  const [isRoomNameValid, setRoomNameValid] = useState(true);

  return (
    <form
      css={wrapperStyle}
      onSubmit={(ev) => {
        ev.preventDefault();
        props.onSubmit({ mode: roomType as RoomInit["mode"], id: roomName });
      }}
    >
      <div css={itemStyle}>
        <div>ROOM NAME</div>
        <input
          type="text"
          value={roomName}
          placeholder="room-name"
          onChange={(ev) => setRoomName(ev.target.value)}
          onBlur={() => setRoomNameValid(isValidRoomName(roomName))}
          required
          maxLength={maxRoomNameLength}
          pattern={roomNameRegex}
          css={roomNameStyle}
        />
      </div>
      <span css={tipStyle}>
        {isRoomNameValid ? "" : messageForValidRoomName}
      </span>

      <div css={itemStyle}>
        <div>ROOM TYPE</div>
        <div>
          {["SFU", "P2P"].map((type) => (
            <label key={type} css={roomTypeStyle}>
              <input
                type="radio"
                onChange={() => setRoomType(type)}
                value={type}
                checked={roomType === type}
                name="room-type"
              />{" "}
              {type}
            </label>
          ))}
        </div>
      </div>

      <div css={buttonWrapStyle}>
        <button
          css={createButtonStyle}
          type="submit"
          disabled={!isValidRoomName(roomName)}
        >
          CREATE ROOM
        </button>
      </div>
    </form>
  );
}

export default RoomCreate;

const wrapperStyle = css({
  backgroundColor: globalColors.white,
  border: `1px solid ${globalColors.gray}`,
  padding: 16,
  borderRadius: 2,
});

const itemStyle = css({
  display: "grid",
  alignItems: "center",
  gridTemplateColumns: "88px 1fr",
  height: 40,
  marginBottom: 4,
});

const roomNameStyle = css({
  width: "100%",
  boxSizing: "border-box",
  appearance: "none",
  border: 0,
  borderBottom: `1px solid ${globalColors.gray}`,
  fontSize: "1.2rem",
  padding: "4px 8px",
  "&:focus": {
    borderColor: globalColors.blue,
  },
});

const tipStyle = css({
  color: globalColors.red,
  fontSize: ".8rem",
});

const roomTypeStyle = css({
  margin: "0 8px",
  fontSize: "1.2rem",
  "& > input": {
    verticalAlign: "middle",
  },
});

const buttonWrapStyle = css({
  marginTop: 24,
});

const createButtonStyle = css({
  backgroundColor: globalColors.blue,
  color: globalColors.white,
  height: 40,
  border: 0,
  cursor: "pointer",
  padding: "0 24px",
  fontSize: "1.2rem",
  borderRadius: 2,
  "&:disabled": {
    backgroundColor: globalColors.gray,
    cursor: "not-allowed",
  },
});
