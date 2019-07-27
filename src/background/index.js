import { openUrlInTab } from '../util';
import { installContextMenu } from './contextMenu';
import { ActionId, ContextId } from '../util/enums';
import { LinkHandler } from '../util/LinkHandler';

// register command listener to open history/favorites page
chrome.commands.onCommand.addListener(command => {
  if (command === 'openLinkHistory') {
    chrome.tabs.create({ url: 'pages/history.html' });
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId.startsWith('history')) {
    chrome.tabs.create({ url: 'pages/history.html' });
    return;
  }

  try {
    // Origin has to be extracted from url, because window.location.origin does not work here
    const urlPaths = info.linkUrl.split('/');
    const origin = urlPaths.length >= 3 ? urlPaths[2] : '';
    const linkHandler = new LinkHandler(info.menuItemId, info.linkUrl, origin, info.pageUrl);
    if (info.menuItemId === ActionId.CREATE_FAV) {
      linkHandler.createFavorite();
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'createdFav' });
      });
    } else if (info.menuItemId.startsWith(ContextId.CLIP_BOARD)) {
      linkHandler.copyLinkAddress(info.menuItemId);
    } else {
      linkHandler.sendTabUpdateImmediately();
    }
  } catch (e) {
    console.log(e);
  }
});

// handle messages from content scripts or popup pages
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const { action, url, openNewTab = false } = request;

  switch (action) {
    case 'handleLink':
      openUrlInTab(openNewTab, url);
      sendResponse({ success: true });
      break;
    case 'updateBadge':
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.browserAction.setBadgeText({
          text: request.officeLinkCount ? `${request.officeLinkCount}` : '',
          tabId: tabs[0].id
        });
        sendResponse({ success: true, tabId: tabs[0].id });
      });
      break;
  }
});

chrome.runtime.onInstalled.addListener(details => {
  installContextMenu();
});
