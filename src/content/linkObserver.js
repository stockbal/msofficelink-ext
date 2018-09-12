export class LinkObserver {
  constructor(observeCallback) {
    this._observeCallback = observeCallback;
    // initialize observer to recognize new links
    this._observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        this._observeCallback();
      });
    });
  }
  start() {
    this._observer.observe(document.body, { childList: true });
  }
  stop() {
    this._observer.disconnect();
  }
}
