import { LinkHandler, openUrlInTab } from '../util';

const patterns = ['docx', 'doc', 'docm', 'xls', 'xlsx', 'csv', 'xlsm', 'pptx', 'ppt', 'pptm'].map(
  el => `*://*/*.${el}`
);

// install the context menus to open links in ms office applications
chrome.contextMenus.create({
  title: 'Open in read only mode',
  id: 'read',
  contexts: ['link'],
  targetUrlPatterns: patterns
});
chrome.contextMenus.create({
  title: 'Open in edit mode',
  id: 'edit',
  contexts: ['link'],
  targetUrlPatterns: patterns
});
chrome.contextMenus.create({
  title: 'Open in online mode',
  id: 'online',
  contexts: ['link'],
  targetUrlPatterns: patterns
});
chrome.contextMenus.create({
  title: 'Download file',
  id: 'download',
  contexts: ['link'],
  targetUrlPatterns: patterns
});
chrome.contextMenus.create({
  type: 'separator',
  id: 'sep1',
  contexts: ['link'],
  targetUrlPatterns: patterns
});
chrome.contextMenus.create({
  title: 'Add to Favorites',
  id: 'markasfav',
  contexts: ['link'],
  targetUrlPatterns: patterns
});
chrome.contextMenus.create({
  title: 'Document History / Favorites',
  id: 'advoptions',
  contexts: ['browser_action']
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'advoptions') {
    chrome.tabs.create({ url: 'pages/history.html' });
    return;
  }

  try {
    // Origin has to be extracted from url, because window.location.origin does not work here
    const urlPaths = info.linkUrl.split('/');
    const origin = urlPaths.length >= 3 ? urlPaths[2] : '';
    const linkHandler = new LinkHandler(info.menuItemId, info.linkUrl, origin, info.pageUrl);
    if (info.menuItemId === 'markasfav') {
      linkHandler.createFavorite();
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
