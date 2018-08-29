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
  static async getLinkHistory() {
    return new Promise(resolve => {
      chrome.storage.local.get('history', ({ history }) => {
        if (!history) {
          history = {
            links: []
          };
        }
        resolve(history);
      });
    });
  }
  static async addLinkToHistory(link, file, type) {
    const history = await ExtStorage.getLinkHistory();
    history.links.push({ link, type, file });
    chrome.storage.local.set({ history });
  }
  static clearLinkHistory() {
    chrome.storage.local.remove('history');
  }
}
