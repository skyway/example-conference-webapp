import { useState } from "react";
import { css } from "@emotion/react";
import { globalColors } from "../../shared/global-style";

interface Props {
  defaultDisplayName: string;
  isInvalid: boolean;
  onChangeDisplayName: (name: string) => void;
}
function SettingsNameEdit({
  defaultDisplayName,
  isInvalid,
  onChangeDisplayName,
}: Props) {
  const [displayName, setDisplayName] = useState(defaultDisplayName);

  return (
    <div>
      <input
        type="text"
        value={displayName}
        maxLength={10}
        placeholder="Enter your name"
        onChange={(ev) => {
          // ignore while IME compositing
          if (ev.target.value.length > 10) {
            return;
          }
          const name = ev.target.value;
          setDisplayName(name);
          onChangeDisplayName(name);
        }}
        css={isInvalid ? [nameStyle, invalidStyle] : nameStyle}
      />
    </div>
  );
}

export default SettingsNameEdit;

const nameStyle = css({
  boxSizing: "border-box",
  width: "100%",
  padding: "4px 8px",
  appearance: "none",
  border: 0,
  borderBottom: `1px solid ${globalColors.gray}`,
  fontSize: "1.1rem",
  "&:focus": {
    borderColor: globalColors.blue,
  },
});

const invalidStyle = css({
  borderColor: globalColors.red,
});
