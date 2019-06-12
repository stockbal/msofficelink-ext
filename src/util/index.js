import { ExtStorage } from '../ext/storage';
import { ActionId, ContextId } from './enums';

const wordFileEndings = ['doc', 'docx', 'docm'];
const excelFileEndings = ['xls', 'xlsx', 'xlsm', 'csv', 'xlsb'];
const powerPointFileEndings = ['ppt', 'pptx', 'pptm'];
const visioFileEndings = ['vsd', 'vsdx', 'vsdm', 'vssx', 'vssm', 'vstx', 'vstm'];

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

  /**
   * Checks if the link points to a Visio file
   * @param link {String} url to check
   * @returns {boolean} <code>true</code> if link is Visio file
   */
  static isVisioFileEnding(link) {
    return new RegExp(`\\.(${visioFileEndings.join('|')})$`).test(link);
  }

  static getAllEndingsAsRegex() {
    return new RegExp(
      `\\.(${excelFileEndings
        .concat(wordFileEndings, powerPointFileEndings, visioFileEndings)
        .join('|')})`
    );
  }

  /**
   * Returns all valid Office file endings that the extension can handle
   * @returns {string[]}
   */
  static getAllFileEndings() {
    return excelFileEndings.concat(wordFileEndings, powerPointFileEndings, visioFileEndings);
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
    let cleanedLink = null;
    // check if link is wopi frame link
    if (LinkUtil.isWopiFrameLink(link)) {
      // extract source link from wopi frame link
      cleanedLink = LinkUtil._extractWopiFrameSourceLink(link);
    } else {
      cleanedLink = LinkUtil._removeQueryParams(link);
    }
    if (OfficeFileEnding.isWordFileEnding(cleanedLink)) {
      return { link: cleanedLink, protocol: 'ms-word', type: 'word' };
    } else if (OfficeFileEnding.isExcelFileEnding(cleanedLink)) {
      return { link: cleanedLink, protocol: 'ms-excel', type: 'excel' };
    } else if (OfficeFileEnding.isPowerPointFileEnding(cleanedLink)) {
      return { link: cleanedLink, protocol: 'ms-powerpoint', type: 'powerpoint' };
    } else if (OfficeFileEnding.isVisioFileEnding(cleanedLink)) {
      return { link: cleanedLink, protocol: 'ms-visio', type: 'visio' };
    } else {
      return { link: cleanedLink, protocol: '', type: '' };
    }
  }

  /**
   * Checks if the given link is relevant for the extension
   * @param link
   */
  static isLinkRelevant(link) {
    // exclude file protocol links -> they are not working with the office URI protocols
    if (link.startsWith('file://')) {
      return false;
    }

    if (LinkUtil.isWopiFrameLink(link)) {
      // check if the file ending is relevant
      let linkInfo = LinkUtil.getLinkInfo(link);
      return linkInfo.type !== '';
    }
    // only consider segment after last slash
    const lastSlashSegment = link.substr(link.lastIndexOf('/'), link.length);
    if (!lastSlashSegment || lastSlashSegment === '') {
      return false;
    }

    // test if it as a link which points to a file
    const regexResult = lastSlashSegment.match(/(.*\.[a-zA-Z]{3,4})($|\?|#)+/);
    if (regexResult === null || regexResult.length < 2) {
      return false;
    }
    // test if the link points to an ms office document
    return new RegExp(
      `\\.(${OfficeFileEnding.getAllFileEndings().join('|')})(^\\.|([\\?#&].*)|$)`
    ).test(lastSlashSegment);
  }

  /**
   * Removes all url query parameters from the given link
   * @param link
   * @private
   */
  static _removeQueryParams(link) {
    const regexResult = link.match(/(.*\.[a-zA-Z]{3,4})($|\?|#)+/);
    if (regexResult !== null && regexResult.length > 1) {
      let matchWithLink = regexResult[1];
      if (/[\\?#&]+/.test(matchWithLink)) {
        throw Error('Link does not match');
      } else {
        return matchWithLink;
      }
    } else {
      throw Error('Link does not match');
    }
  }

  /**
   * Checks if the given link is a WOPI Frame link
   * @param link {String} the link to be checked
   * @return {boolean}
   */
  static isWopiFrameLink(link) {
    return link.includes('WopiFrame.aspx?sourcedoc');
  }

  /**
   * Extracts source document link from WOPI frame link
   * @param link {String}
   * @return {String} the extracted WOPI Frame link
   * @private
   */
  static _extractWopiFrameSourceLink(link) {
    const tokens = link.split('/');
    const origin = `${tokens[0]}/${tokens[2]}`;
    const sourcedoc = link.match(/sourcedoc=(.*\.[a-zA-Z]+)/)[1];
    return LinkUtil._removeQueryParams(`${origin}${sourcedoc}`);
  }
}

/**
 * Link Handler for creating and sending office
 * document links to the chrome tabs api
 */
export class LinkHandler {
  /**
   * Creates new link handler instance for performing the chosen
   * user action for a document link
   * @param action
   * @param linkUrl
   * @param origin
   * @param ownerPage
   */
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

    // check if the final link url should already be built
    if (
      action !== ActionId.CREATE_FAV &&
      action !== ActionId.COPY_LINK &&
      !action.startsWith(ContextId.CLIP_BOARD)
    ) {
      this._finalTabUrl = this._buildLinkActionUrl();
    }
  }
  /**
   * Builds the url for the tab update
   * @returns {*}
   */
  _buildLinkActionUrl() {
    switch (this._action) {
      case ActionId.OPEN_TO_READ:
        return `${this._fileProtocol}:ofv|u|${decodeURI(this._linkUrl)}`;
      case ActionId.OPEN_TO_EDIT:
        return `${this._fileProtocol}:ofe|u|${decodeURI(this._linkUrl)}`;
      case ActionId.OPEN_ONLINE:
        return `${this._linkUrl}?web=1`;
      case ActionId.DOWNLOAD_FILE:
        return this._linkUrl;
      case ActionId.ORIGINAL_LINK:
        return this._linkUrl;
      case ActionId.OPEN_PARENT_FOLDER:
        const lastSlash = this._linkUrl.lastIndexOf('/');
        return this._linkUrl.substring(0, lastSlash);
      case ActionId.OPEN_OWNER_PAGE:
        return this._ownerPage || '';
      default:
        throw new Error('unrecognized link action');
    }
  }

  /**
   * Updates the link history
   * @returns {Promise<void>}
   */
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

  /**
   * Creates new favorite
   * @returns {Promise<void>}
   */
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
    if (this._action === 'copylink') {
      this.copyLinkAddress();
      return;
    }
    // if (!preventHistoryUpdate) {
    this.updateLinkHistory();
    // }
    openUrlInTab(await this._isOpenInNewTab(), this._finalTabUrl);
  }

  /**
   * Copy the address of the link to the clipboard
   *
   * @param {String} copyToClipboardAction clip board action
   */
  async copyLinkAddress(copyToClipboardAction = null) {
    // read settings to determine the correct link copy action
    debugger;
    if (copyToClipboardAction) {
      switch (copyToClipboardAction) {
        case ContextId.ORIGINAL_TO_CLIPBOARD:
          this._action = ActionId.DOWNLOAD_FILE;
          break;
        case ContextId.OPEN_ONLINE_TO_CLIPBOARD:
          this._action = ActionId.OPEN_ONLINE;
          break;
        case ContextId.OPEN_TO_EDIT_TO_CLIPBOARD:
          this._action = ActionId.OPEN_TO_EDIT;
          break;
        case ContextId.OPEN_PROTECTED_TO_CLIPBOARD:
          this._action = ActionId.OPEN_TO_READ;
          break;
      }
    } else {
      const settings = await ExtStorage.getSettings();
      this._action = settings.copyLinkMode;
    }
    this._finalTabUrl = this._buildLinkActionUrl();

    const input = document.createElement('textarea');
    input.style.position = 'fixed';
    input.style.opacity = 0;
    input.value = this._finalTabUrl;
    document.body.appendChild(input);
    input.select();
    document.execCommand('Copy');
    document.body.removeChild(input);
  }
}
