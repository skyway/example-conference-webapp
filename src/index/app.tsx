import { RoomInit } from "./utils/types";
import Layout from "./components/layout";
import RoomCreate from "./components/room-create";

function App() {
  const effects = {
    enterConference(room: RoomInit) {
      location.href = `./conference.html#!/${room.mode}/${room.id}`;
    },
  };

  return (
    <Layout>
      <RoomCreate onSubmit={(room) => effects.enterConference(room)} />
    </Layout>
  );
}

export default App;
