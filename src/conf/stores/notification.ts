import { makeObservable, observable, action } from "mobx";
import { IObservableArray } from "mobx";
import { NotificationItem, NotificationType } from "../utils/types";

class NotificationStore {
  items: IObservableArray<NotificationItem>;

  constructor() {
    this.items = observable<NotificationItem>([]);

    makeObservable<NotificationStore, "show">(this, {
      items: observable.shallow,
      showInfo: action,
      showJoin: action,
      showLeave: action,
      replaceNotification: action,
      show: action,
    });
  }

  showInfo(text: string) {
    this.show("info", text, 1000);
  }

  showJoin(name: string) {
    this.show("person", `${name} joined`, 2000);
  }

  showLeave(name: string) {
    this.show("person", `${name} left`, 2000);
  }

  showError(text: string) {
    this.show("warning", text, 6000);
  }

  replaceNotification(nextItems: NotificationItem[]) {
    this.items.replace(nextItems);
  }

  private show(type: NotificationType, text: string, duration: number) {
    const item: NotificationItem = { id: Math.random(), type, text };
    this.items.push(item);
    setTimeout(() => {
      const nextItems = this.items.filter((i) => i.id !== item.id);
      this.replaceNotification(nextItems);
    }, duration);
  }
}

export default NotificationStore;
