import { buildLinkActionUrl } from '../util';

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

chrome.contextMenus.onClicked.addListener((info, tab) => {
  try {
    chrome.tabs.update({ url: buildLinkActionUrl(info.menuItemId, info.linkUrl) });
  } catch (e) {
    console.log(e);
  }
});

// handle messages from content scripts or popup pages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'handleLink':
      if (request.url) {
        chrome.tabs.update({ url: request.url });
      }
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
