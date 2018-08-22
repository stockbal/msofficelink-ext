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
      return `${protocol}:ofv|u|${url}`;
    case 'edit':
      return `${protocol}:ofe|u|${url}`;
    case 'online':
      return `${url}?web=1`;
    case 'download':
      return url;
    default:
      throw new Error('unrecognized link action');
  }
};

export const sendUpdateTabRequest = url => {
  chrome.runtime.sendMessage({ action: 'handleLink', url });
};

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
