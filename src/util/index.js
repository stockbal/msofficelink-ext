import { ExtStorage } from '../ext/storage';

const wordFileEndings = ['doc', 'docx', 'docm'];
const excelFileEndings = ['xls', 'xlsx', 'xlsm', 'csv', 'xlsb'];
const powerPointFileEndings = ['ppt', 'pptx', 'pptm'];

/**
 * Utility class for checking office link file endings
 */
export class OfficeFileEnding {
  /**
   * Checks if the link points to an Excel file
   * @param link {String} url to check
   * @returns {boolean} <code>true</code> if link is Excel file
   */
  static isExcelFileEnding(link) {
    return new RegExp(`\\.(${excelFileEndings.join('|')})$`).test(link);
  }
  /**
   * Checks if the link points to an PowerPoint file
   * @param link {String} url to check
   * @returns {boolean} <code>true</code> if link is PowerPoint file
   */
  static isPowerPointFileEnding(link) {
    return new RegExp(`\\.(${powerPointFileEndings.join('|')})$`).test(link);
  }

  /**
   * Checks if the link points to an Word file
   * @param link {String} url to check
   * @returns {boolean} <code>true</code> if link is Word file
   */
  static isWordFileEnding(link) {
    return new RegExp(`\\.(${wordFileEndings.join('|')})$`).test(link);
  }

  static getAllEndingsAsRegex() {
    return new RegExp(
      `\\.(${excelFileEndings.concat(wordFileEndings, powerPointFileEndings).join('|')})`
    );
  }

  /**
   * Returns all valid Office file endings that the extension can handle
   * @returns {string[]}
   */
  static getAllFileEndings() {
    return excelFileEndings.concat(wordFileEndings, powerPointFileEndings);
  }
}

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
    let cleanedLink = LinkUtil._removeQueryParams(link);
    // check if link is wopi frame link
    if (LinkUtil._isWopiFrameLink(cleanedLink)) {
      // extract source link from wopi frame link
      cleanedLink = LinkUtil._extractWopiFrameSourceLink(cleanedLink);
    }
    if (OfficeFileEnding.isWordFileEnding(cleanedLink)) {
      return { link: cleanedLink, protocol: 'ms-word', type: 'word' };
    } else if (OfficeFileEnding.isExcelFileEnding(cleanedLink)) {
      return { link: cleanedLink, protocol: 'ms-excel', type: 'excel' };
    } else if (OfficeFileEnding.isPowerPointFileEnding(cleanedLink)) {
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
    const regexResult = link.match(/(.*\.[a-zA-Z]+)/);
    if (regexResult.length > 1) {
      return regexResult[1];
    } else {
      throw Error('Link does not match');
    }
  }
  static _isWopiFrameLink(link) {
    return link.includes('WopiFrame.aspx?sourcedoc');
  }
  static _extractWopiFrameSourceLink(link) {
    const tokens = link.split('/');
    const origin = `${tokens[0]}/${tokens[2]}`;
    const sourcedoc = link.match(/sourcedoc=(.*\.[a-zA-Z]+)/)[1];
    return `${origin}${sourcedoc}`;
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
    this._fileType = linkInfo.type;
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
    // if (!preventHistoryUpdate) {
    this.updateLinkHistory();
    // }
    openUrlInTab(await this._isOpenInNewTab(), this._finalTabUrl);
  }
}
