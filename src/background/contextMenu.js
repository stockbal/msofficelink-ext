import { OfficeFileEnding } from '../util';

const i18n = chrome.i18n.getMessage;

const patterns = OfficeFileEnding.getAllFileEndings()
  .map(el => `https://*/*.${el}*`)
  .concat(OfficeFileEnding.getAllFileEndings().map(el => `http://*/*.${el}*`));

const createContextMenu = (i18nId, id) => {
  chrome.contextMenus.create({
    title: i18n(i18nId),
    id: id,
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
  createContextMenu('LinkOption_openProtected', 'read');
  createContextMenu('LinkOption_openEdit', 'edit');
  createContextMenu('LinkOption_openOnline', 'online');
  createContextMenu('LinkOption_download', 'download');
  createCtxMenuSeparator('sep1');
  createContextMenu('LinkOption_openParent', 'parent');
  createCtxMenuSeparator('sep2');
  createContextMenu('LinkOption_addToFavs', 'markasfav');
  chrome.contextMenus.create({
    title: i18n('History_ctxMenuOpen'),
    id: 'history2',
    contexts: ['browser_action']
  });
}
