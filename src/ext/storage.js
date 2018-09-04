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
            openInNewTab: false,
            popupDefaultTab: 'options'
          };
        }

        resolve(settings);
      });
    });
  }
  static async getHistoryLinks() {
    const { entries } = await ExtStorage.getDocumentLinks();
    const links = [];
    Object.entries(entries).forEach(([, link]) => {
      if (link.isHistory) {
        links.push(link);
      }
    });
    return links;
  }
  static async getFavoriteLinks() {
    const { entries } = await ExtStorage.getDocumentLinks();
    const links = [];
    Object.entries(entries).forEach(([, link]) => {
      if (link.isFav) {
        links.push(link);
      }
    });
    return links;
  }

  static async getDocumentLinks() {
    return new Promise(resolve => {
      chrome.storage.local.get('docLinks', ({ docLinks }) => {
        if (!docLinks) {
          docLinks = {
            entries: {}
          };
        }
        resolve(docLinks);
      });
    });
  }

  /**
   * Adds link to history/favorite storage
   *
   * @param origin
   * @param ownerPage
   * @param href
   * @param file
   * @param protocol
   * @param type
   * @returns {Promise<void>}
   */
  static async addLinkToHistory(origin, ownerPage, href, file, protocol, type) {
    const docLinks = await ExtStorage.getDocumentLinks();
    const settings = await ExtStorage.getSettings();
    if (
      !docLinks.entries[href] &&
      Object.keys(docLinks.entries).length === settings.maxLinkHistory
    ) {
      return;
    }
    let docLink = docLinks.entries[href];
    if (docLink) {
      docLink.openedOn = new Date();
      docLink.isHistory = true;
    } else {
      docLinks.entries[href] = {
        origin,
        href,
        ownerPage,
        protocol,
        file,
        type,
        isFav: false,
        isHistory: true,
        openedOn: new Date()
      };
    }
    chrome.storage.local.set({ docLinks });
  }

  static async removeLinkFromFavorites(href) {
    const docLinks = await ExtStorage.getDocumentLinks();
    const settings = await ExtStorage.getSettings();

    const link = docLinks.entries[href];
    if (link) {
      if (!settings.linkHistoryActive) {
        delete docLinks.entries[href];
      } else {
        link.isFav = false;
      }

      chrome.storage.local.set({ docLinks });
    }
  }

  static async addNewLinkToFavorites(origin, ownerPage, href, file, protocol, type) {
    const docLinks = await ExtStorage.getDocumentLinks();
    let docLink = docLinks.entries[href];
    if (docLink) {
      docLink.isFav = true;
    } else {
      docLinks.entries[href] = {
        origin,
        href,
        ownerPage,
        protocol,
        file,
        type,
        isFav: true,
        isHistory: false,
        openedOn: undefined
      };
    }
    chrome.storage.local.set({ docLinks });
  }
  static async addLinkToFavorites(link) {
    const docLinks = await ExtStorage.getDocumentLinks();
    let docLink = docLinks.entries[link.href];
    if (docLink) {
      docLink.isFav = true;
    } else {
      docLinks.entries[link.href] = link;
    }
    chrome.storage.local.set({ docLinks });
  }
  static async clearLinkHistory() {
    const docLinks = await ExtStorage.getDocumentLinks();
    Object.entries(docLinks.entries).forEach(([linkHref, link]) => {
      if (!link.isFav) {
        delete docLinks.entries[linkHref];
      } else {
        link.isHistory = false;
      }
    });
    chrome.storage.local.set({ docLinks });
  }
  static async clearLinkFavorites() {
    const docLinks = await ExtStorage.getDocumentLinks();
    Object.entries(docLinks.entries).forEach(([linkHref, link]) => {
      if (!link.isHistory) {
        delete docLinks.entries[linkHref];
      } else {
        link.isFav = false;
      }
    });
    chrome.storage.local.set({ docLinks });
  }
  static clearFavorites() {}
}
