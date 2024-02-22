import * as React from "react";
import { useCallback } from "react";
import { FunctionComponent } from "react";
import { Observer } from "mobx-react";
import { IconButton } from "../components/icon";
import { exitRoom } from "../effects/exit";

export const ExitOpener: FunctionComponent<Record<string, unknown>> = () => {
  const onClickExitRoom = useCallback(() => exitRoom(), []);

  return (
    <Observer>
      {() => <IconButton name="exit_to_app" onClick={onClickExitRoom} />}
    </Observer>
  );
};
