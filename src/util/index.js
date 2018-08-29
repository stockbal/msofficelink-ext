import { ExtStorage } from '../ext/storage';

export const TIMER_DURATION = 200;

export const runsSharepoint = () => {
  for (const script of document.querySelectorAll('script')) {
    if (/_layouts\/15\/sp\.init\.js/.test(script.src)) {
      return true;
    }
  }
  return false;
};

/**
 * Builds the url for the tab update
 * @param action
 * @param url
 * @returns {*}
 */
export const buildLinkActionUrl = (action, protocol, url) => {
  switch (action) {
    case 'read':
      return `${protocol}:ofv|u|${decodeURI(url)}`;
    case 'edit':
      return `${protocol}:ofe|u|${decodeURI(url)}`;
    case 'online':
      return `${url}?web=1`;
    case 'download':
      return url;
    case 'original':
      return url;
    default:
      throw new Error('unrecognized link action');
  }
};

export const sendUpdateTabRequest = (url, openNewTab) => {};

export const getProtocol = link => {
  if (/\.(docx|doc|docm)$/.test(link)) {
    return 'ms-word';
  } else if (/\.(xlsx|xls|xlsm|csv)$/.test(link)) {
    return 'ms-excel';
  } else if (/\.(pptx|ppt|pptm)$/.test(link)) {
    return 'ms-powerpoint';
  } else {
    return '';
  }
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
    chrome.tabs.update({ url: this._finalTabUrl });
  }
};

/**
 * Link Handler for creating and sending office
 * document links to the chrome tabs api
 */
export class LinkHandler {
  constructor(action, linkUrl) {
    this._linkUrl = linkUrl;
    this._action = action;
    const protocol = getProtocol(this._linkUrl);
    if (!protocol) {
      throw new Error('unrecognized protocol');
    }
    this._fileType = protocol;
    this._finalTabUrl = buildLinkActionUrl(action, protocol, linkUrl);
  }
  async updateLinkHistory() {
    const settings = await ExtStorage.getSettings();
    if (!settings.linkHistoryActive) {
      return;
    }
    const fileNameMatch = this._linkUrl.match(new RegExp('/([^/]+\\.\\w+$)'));
    if (fileNameMatch && fileNameMatch.length > 0) {
      ExtStorage.addLinkToHistory(this._linkUrl, decodeURI(fileNameMatch[1]), this._fileType);
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
    return settings.openInNewTab && this._action === 'online';
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
