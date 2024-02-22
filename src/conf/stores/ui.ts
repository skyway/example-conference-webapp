import { makeObservable, observable, action } from "mobx";

class UiStore {
  error: Error | null;
  isSettingsOpen: boolean;
  isStatsOpen: boolean;

  constructor() {
    this.error = null;
    this.isSettingsOpen = true;
    this.isStatsOpen = false;

    makeObservable(this, {
      error: observable.ref,
      isSettingsOpen: observable,
      isStatsOpen: observable,
      showError: action,
    });
  }

  showError(err: Error): Error {
    this.error = err;
    return err;
  }
}

export default UiStore;
