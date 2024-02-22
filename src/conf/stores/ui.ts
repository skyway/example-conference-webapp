import { makeObservable, observable, action } from "mobx";

class UiStore {
  error: Error | null;
  isSettingsOpen: boolean;
  isReactionOpen: boolean;
  isStatsOpen: boolean;
  isReEntering: boolean;

  constructor() {
    this.error = null;
    this.isSettingsOpen = true;
    this.isReactionOpen = false;
    this.isStatsOpen = false;
    this.isReEntering = false;

    makeObservable(this, {
      error: observable.ref,
      isSettingsOpen: observable,
      isReactionOpen: observable,
      isStatsOpen: observable,
      isReEntering: observable,
      showError: action,
    });
  }

  showError(err: Error): Error {
    this.error = err;
    return err;
  }
}

export default UiStore;
