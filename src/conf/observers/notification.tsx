import { useContext } from "react";
import { Observer } from "mobx-react";
import { StoreContext } from "../contexts";
import NotificationLayout from "../components/notification-layout";
import Toast from "../components/toast";

function Notification() {
  const store = useContext(StoreContext);

  const { notification } = store;
  return (
    <Observer>
      {() => (
        <NotificationLayout>
          {notification.items.slice().map((item) => (
            <Toast key={item.id} {...item} />
          ))}
        </NotificationLayout>
      )}
    </Observer>
  );
}

export default Notification;
