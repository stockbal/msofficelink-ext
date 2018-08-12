const getProtocol = link => {
  if (/\.(docx|doc|docm)$/.test(link)) {
    return 'ms-word';
  } else if (/\.(xlsx|xls|xlsm|csv)$/.test(link)) {
    return 'ms-excel';
  } else if (/\.(pptx|ppt|pptm)$/.test(link)) {
    return 'ms-powerpoint';
  } else {
    return null;
  }
};

// const patterns = ['docx', 'doc', 'docm', 'xls', 'xlsx', 'csv', 'xlsm', 'pptx', 'ppt', 'pptm'].map(
//   el => `*://*/*.${el}`
// );

// install the context menus to open links in ms office applications
chrome.contextMenus.create({
  title: 'Open in read only mode',
  id: 'MenuOpenRead',
  contexts: ['link']
  // targetUrlPatterns: patterns
});
chrome.contextMenus.create({
  title: 'Open in edit mode',
  id: 'MenuOpenEdit',
  contexts: ['link']
  // targetUrlPatterns: patterns
});
chrome.contextMenus.create({
  title: 'Open in online mode',
  id: 'MenuOpenOnline',
  contexts: ['link']
  // targetUrlPatterns: patterns
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const protocol = getProtocol(info.linkUrl);
  if (protocol) {
    chrome.tabs.update({ url: `${info.linkUrl}?web=1` });
  } else {
    alert('File extension is not yet supported');
    return;
  }

  switch (info.menuItemId) {
    case 'MenuOpenRead':
      chrome.tabs.update({ url: `${protocol}:ofv|u|${info.linkUrl}` });
      break;
    case 'MenuOpenEdit':
      chrome.tabs.update({ url: `${protocol}:ofe|u|${info.linkUrl}` });
      break;
    case 'MenuOpenOnline':
      chrome.tabs.update({ url: `${info.linkUrl}?web=1` });
      break;
  }
});

// open
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.url) {
    chrome.tabs.update({ url: request.url });
  }
  sendResponse({ success: true });
});
