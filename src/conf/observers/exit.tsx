import { useCallback } from "react";
import { Observer } from "mobx-react";
import { IconButton } from "../components/icon";
import { exitRoom } from "../effects/exit";

export function ExitOpener() {
  const onClickExitRoom = useCallback(() => exitRoom(), []);

  return (
    <Observer>
      {() => <IconButton name="exit_to_app" onClick={onClickExitRoom} />}
    </Observer>
  );
}
