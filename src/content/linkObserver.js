export class LinkObserver {
  constructor(observeCallback) {
    this._observeCallback = observeCallback;
    // initialize observer to recognize new links
    this._observer = new MutationObserver(mutations => {
      if (mutations && mutations.length > 0) {
        this._observeCallback();
      }
    });
  }
  start() {
    this._observer.observe(document.body, { childList: true, subtree: true });
  }
  stop() {
    this._observer.disconnect();
  }
}
