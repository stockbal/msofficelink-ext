/**
 * Link Handler for creating and sending office
 * document links to the chrome tabs api
 */
import { ExtStorage } from '../ext/ExtStorage';
import { ActionId, ContextId } from './enums';
import { LinkUtil } from './LinkUtil';
import { openUrlInTab } from './index';

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
