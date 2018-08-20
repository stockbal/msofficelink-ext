export const TIMER_DURATION = 200;

export const runsSharepoint = () => {
  for (const script of document.querySelectorAll('script')) {
    if (/_layouts\/15\/sp\.init\.js/.test(script.src)) {
      return true;
    }
  }
  return false;
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
