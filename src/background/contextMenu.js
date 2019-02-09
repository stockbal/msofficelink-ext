import { OfficeFileEnding } from '../util';
import { ContextId } from '../util/enums';

const i18n = chrome.i18n.getMessage;

const patterns = OfficeFileEnding.getAllFileEndings()
  .map(el => `https://*/*.${el}*`)
  .concat(OfficeFileEnding.getAllFileEndings().map(el => `http://*/*.${el}*`));

const createContextMenu = (i18nId, id, parentId = null) => {
  chrome.contextMenus.create({
    title: i18n(i18nId),
    id: id,
    parentId: parentId,
    contexts: ['link'],
    targetUrlPatterns: patterns
  });
};
const createCtxMenuSeparator = id => {
  chrome.contextMenus.create({
    type: 'separator',
    id: id,
    contexts: ['link'],
    targetUrlPatterns: patterns
  });
};

export function installContextMenu() {
  // remove previously installed context menus
  chrome.contextMenus.removeAll();
  // install context menus
  // create default context menu for showing the history
  chrome.contextMenus.create({
    title: i18n('extName') + ' - ' + i18n('History_ctxMenuOpen'),
    id: 'history1',
    contexts: ['page']
  });

  // install the context menus to open links in ms office applications
  // Add menu entry to copy link address

  createContextMenu('CTX_copyLinkAddressAs', ContextId.CLIP_BOARD);
  createContextMenu('LinkOption_original', ContextId.ORIGINAL_TO_CLIPBOARD, ContextId.CLIP_BOARD);
  createContextMenu(
    'LinkOption_openProtected',
    ContextId.OPEN_PROTECTED_TO_CLIPBOARD,
    ContextId.CLIP_BOARD
  );
  createContextMenu(
    'LinkOption_openEdit',
    ContextId.OPEN_TO_EDIT_TO_CLIPBOARD,
    ContextId.CLIP_BOARD
  );
  createContextMenu(
    'LinkOption_openOnline',
    ContextId.OPEN_ONLINE_TO_CLIPBOARD,
    ContextId.CLIP_BOARD
  );

  createCtxMenuSeparator('sep1');

  createContextMenu('LinkOption_openProtected', ContextId.OPEN_TO_READ);
  createContextMenu('LinkOption_openEdit', ContextId.OPEN_TO_EDIT);
  createContextMenu('LinkOption_openOnline', ContextId.OPEN_ONLINE);
  createContextMenu('LinkOption_download', ContextId.DOWNLOAD_FILE);
  createCtxMenuSeparator('sep2');
  createContextMenu('LinkOption_openParent', ContextId.OPEN_PARENT_FOLDER);
  createCtxMenuSeparator('sep3');
  createContextMenu('LinkOption_addToFavs', ContextId.CREATE_FAV);
  chrome.contextMenus.create({
    title: i18n('History_ctxMenuOpen'),
    id: 'history2',
    contexts: ['browser_action']
  });
}
