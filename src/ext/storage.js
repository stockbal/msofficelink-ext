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
            menuLinkDefaultAction: 'online',
            linkDefaultAction: 'original',
            openInNewTab: false,
            copyLinkMode: 'original',
            popupDefaultTab: 'options'
          };
        }

        resolve(settings);
      });
    });
  }

  /**
   * Returns an array of all the current history links
   * @returns {Promise<Array>}
   */
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
    let docLink = docLinks.entries[href];
    if (docLink) {
      docLink.openedOn = new Date().toJSON();
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
        openedOn: new Date().toJSON()
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
  static async removeLinks(links) {
    const docLinks = await ExtStorage.getDocumentLinks();

    links.forEach(link => {
      const storageLink = docLinks.entries[link.href];
      if (storageLink) {
        if (link.deleteFav && link.deleteHistory) {
          delete docLinks.entries[link.href];
        } else {
          if (link.deleteFav) {
            storageLink.isFav = false;
          }
          if (link.deleteHistory) {
            storageLink.isHistory = false;
          }
        }
      }
    });

    chrome.storage.local.set({ docLinks });
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
    return new Promise(resolve => {
      chrome.storage.local.set({ docLinks }, result => {
        resolve();
      });
    });
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
    return new Promise(resolve => {
      chrome.storage.local.set({ docLinks }, result => {
        resolve();
      });
    });
  }
}
