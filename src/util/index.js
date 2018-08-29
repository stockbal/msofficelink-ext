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
export const buildLinkActionUrl = (action, url) => {
  const protocol = getProtocol(url);
  if (!protocol) {
    throw new Error('unrecognized protocol');
  }

  switch (action) {
    case 'read':
      return `${protocol}:ofv|u|${decodeURI(url)}`;
    case 'edit':
      return `${protocol}:ofe|u|${decodeURI(url)}`;
    case 'online':
      return `${url}?web=1`;
    case 'download':
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

export class LinkHandler {
  constructor(action, linkUrl) {
    this._linkUrl = linkUrl;
    this._action = action;
    this._finalTabUrl = buildLinkActionUrl(action, linkUrl);
  }
  async sendTabUpdateViaMessage() {
    chrome.runtime.sendMessage({
      action: 'handleLink',
      url: this._finalTabUrl,
      openNewTab: await this._isOpenInNewTab()
    });
  }
  async _isOpenInNewTab() {
    const settings = await ExtStorage.getSettings();
    return settings.openInNewTab && this._action === 'online';
  }
  async sendTabUpdateImmediately() {
    // retrieve settings to check if
    const openInNewTab = await this._isOpenInNewTab();
    if (openInNewTab) {
      chrome.tabs.create({ url: this._finalTabUrl });
    } else {
      chrome.tabs.update({ url: this._finalTabUrl });
    }
  }
}
