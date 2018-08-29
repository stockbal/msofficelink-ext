export class ExtStorage {
  /**
   * Returns the current extension settings
   * @returns {Promise<any>}
   */
  static getSettings() {
    return new Promise((resolve, reject) => {
      // read current extension settings
      chrome.storage.sync.get('settings', ({ settings }) => {
        if (!settings) {
          settings = {
            linkHistoryActive: false,
            linkDefaultAction: 'original',
            maxLinkHistory: 10,
            openInNewTab: false
          };
        }

        resolve(settings);
      });
    });
  }
}
