import Bootstrap from "./observers/bootstrap";
import Settings from "./observers/settings";
import Notification from "./observers/notification";
import { StatsOpener, Stats } from "./observers/stats";
import { ExitOpener } from "./observers/exit";
import PinnedStream from "./observers/pinned-stream";
import LocalStream from "./observers/local-stream";
import RemoteStreams from "./observers/remote-streams";
import Layout from "./components/layout";
import ErrorDetail from "./components/error-detail";
import Main from "./components/main";
import LeftBottom from "./components/left-bottom";
import RightMenu from "./components/right-menu";
import { ErrorBoundary } from "react-error-boundary";

function App() {
  function fallbackRender({ error }: { error: Error }) {
    return (
      <Layout>
        <ErrorDetail error={error} />
      </Layout>
    );
  }

  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <Layout>
        <Bootstrap>
          {/* Base Layer */}
          <Main>
            <PinnedStream />
          </Main>
          <LeftBottom>
            <LocalStream />
          </LeftBottom>
          <RightMenu
            openers={[<StatsOpener key="stats" />, <ExitOpener key="exit" />]}
          >
            <RemoteStreams />
          </RightMenu>

          {/* Modal Layer */}
          <Settings />
          <Stats />
          <Notification />
        </Bootstrap>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
