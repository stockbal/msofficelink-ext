import { ExtStorage } from '../ext/storage';

export function on(element, event, handler) {
  if (element && event && handler) {
    document.addEventListener
      ? element.addEventListener(event, handler, false)
      : element.attachEvent('on' + event, handler);
  }
}
export function off(element, event, handler) {
  if (element && event) {
    document.removeEventListener
      ? element.removeEventListener(event, handler, false)
      : element.detachEvent('on' + event, handler);
  }
}

export const runsSharepoint = () => {
  for (const script of document.querySelectorAll('script')) {
    if (/_layouts\/15\/sp\.init\.js/.test(script.src)) {
      return true;
    }
  }
  return false;
};

/**
 * Updates the tab url with the given url with an option to
 * create a new tab with the given url
 * @param openNewTab
 * @param url
 */
export const openUrlInTab = (openNewTab, url) => {
  if (openNewTab) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.create({ url: url, index: tabs[0].index + 1 });
    });
  } else {
    chrome.tabs.update({ url: url });
  }
};

export class LinkUtil {
  /**
   * Returns information about the link
   * @param link
   */
  static getLinkInfo(link) {
    const cleanedLink = LinkUtil._removeQueryParams(link);
    if (/\.(docx|doc|docm)$/.test(cleanedLink)) {
      return { link: cleanedLink, protocol: 'ms-word', type: 'word' };
    } else if (/\.(xlsx|xls|xlsm|csv)$/.test(cleanedLink)) {
      return { link: cleanedLink, protocol: 'ms-excel', type: 'excel' };
    } else if (/\.(pptx|ppt|pptm)$/.test(cleanedLink)) {
      return { link: cleanedLink, protocol: 'ms-powerpoint', type: 'powerpoint' };
    } else {
      return { link: cleanedLink, protocol: '', type: '' };
    }
  }

  /**
   * Removes all url query parameters from the given link
   * @param link
   * @private
   */
  static _removeQueryParams(link) {
    const regexResult = link.match(/(.*\.[^\\?]+)/);
    if (regexResult.length > 1) {
      return regexResult[1];
    } else {
      throw Error('Link does not match');
    }
  }
}

/**
 * Link Handler for creating and sending office
 * document links to the chrome tabs api
 */
export class LinkHandler {
  constructor(action, linkUrl, origin, ownerPage) {
    const linkInfo = LinkUtil.getLinkInfo(linkUrl);
    this._linkUrl = linkInfo.link;
    this._action = action;
    this._origin = origin;
    this._ownerPage = ownerPage;
    if (!linkInfo.protocol) {
      throw new Error('unrecognized protocol');
    }
    this._fileProtocol = linkInfo.protocol;
    this._fileType = linkInfo.protocol;
    if (action !== 'markasfav') {
      this._finalTabUrl = this._buildLinkActionUrl();
    }
  }
  /**
   * Builds the url for the tab update
   * @returns {*}
   */
  _buildLinkActionUrl() {
    switch (this._action) {
      case 'read':
        return `${this._fileProtocol}:ofv|u|${decodeURI(this._linkUrl)}`;
      case 'edit':
        return `${this._fileProtocol}:ofe|u|${decodeURI(this._linkUrl)}`;
      case 'online':
        return `${this._linkUrl}?web=1`;
      case 'download':
        return this._linkUrl;
      case 'original':
        return this._linkUrl;
      case 'parent':
        const lastSlash = this._linkUrl.lastIndexOf('/');
        return this._linkUrl.substring(0, lastSlash);
      case 'owner':
        return this._ownerPage || '';
      default:
        throw new Error('unrecognized link action');
    }
  }
  getLinkInfo() {
    if (/\.(docx|doc|docm)$/.test(this._linkUrl)) {
      return { protocol: 'ms-word', type: 'word' };
    } else if (/\.(xlsx|xls|xlsm|csv)$/.test(this._linkUrl)) {
      return { protocol: 'ms-excel', type: 'excel' };
    } else if (/\.(pptx|ppt|pptm)$/.test(this._linkUrl)) {
      return { protocol: 'ms-powerpoint', type: 'powerpoint' };
    } else {
      return { protocol: '', type: '' };
    }
  }
  async updateLinkHistory() {
    const settings = await ExtStorage.getSettings();
    if (!settings.linkHistoryActive) {
      return;
    }
    const fileNameMatch = this._linkUrl.match(new RegExp('/([^/]+\\.\\w+$)'));
    if (fileNameMatch && fileNameMatch.length > 0) {
      const linkHasOrigin = new RegExp('^(\\w+):').test(this._linkUrl);

      ExtStorage.addLinkToHistory(
        this._origin,
        this._ownerPage,
        !linkHasOrigin ? this._origin + '/' + this._linkUrl : this._linkUrl,
        decodeURI(fileNameMatch[1]),
        this._fileProtocol,
        this._fileType
      );
    }
  }
  async createFavorite() {
    const fileNameMatch = this._linkUrl.match(new RegExp('/([^/]+\\.\\w+$)'));
    if (fileNameMatch && fileNameMatch.length > 0) {
      const linkHasOrigin = new RegExp('^(\\w+):').test(this._linkUrl);

      ExtStorage.addNewLinkToFavorites(
        this._origin,
        this._ownerPage,
        !linkHasOrigin ? this._origin + '/' + this._linkUrl : this._linkUrl,
        decodeURI(fileNameMatch[1]),
        this._fileProtocol,
        this._fileType
      );
    }
  }

  /**
   * Sends update tab command via runtime chrome runtime message
   * @returns {Promise<void>}
   */
  async sendTabUpdateViaMessage() {
    this.updateLinkHistory();
    chrome.runtime.sendMessage({
      action: 'handleLink',
      url: this._finalTabUrl,
      openNewTab: await this._isOpenInNewTab()
    });
  }

  /**
   * Returns the OpenInNewTab option from extension settings
   * @returns {Promise<boolean>}
   * @private
   */
  async _isOpenInNewTab() {
    const settings = await ExtStorage.getSettings();
    return (
      settings.openInNewTab &&
      (this._action === 'online' || this._action === 'parent' || this._action === 'owner')
    );
  }

  /**
   * Sends update tab command immediately
   * NOTE: cannot be used inside of content script
   * @returns {Promise<void>}
   */
  async sendTabUpdateImmediately(preventHistoryUpdate = false) {
    if (!preventHistoryUpdate) {
      this.updateLinkHistory();
    }
    openUrlInTab(await this._isOpenInNewTab(), this._finalTabUrl);
  }
}
