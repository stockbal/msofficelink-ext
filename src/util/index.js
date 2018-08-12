export const TIMER_DURATION = 200;

export const runsSharepoint = () => {
  for (const script of document.querySelectorAll('script')) {
    if (/_layouts\/15\/sp\.js/.test(script.src)) {
      return true;
    }
  }
  return false;
};

const createCSSEl = url => {
  const el = document.createElement('link');
  el.href = chrome.runtime.getURL(url);
  el.rel = 'stylesheet';
  el.type = 'text/css';
  return el;
};

export const sendUpdateTabRequest = url => {
  chrome.runtime.sendMessage({ url });
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

class Frame {
  constructor() {
    this._frame = document.createElement('iframe');
    this._frame.id = 'msoffice-ext-frame';
    this._popoverEl = document.createElement('div');
  }
  get frame() {
    return this._frame;
  }
  get popoverEl() {
    return this._popoverEl;
  }
  setTop(top) {
    this._frame.style.top = top + 'px';
  }
  setLeft(left) {
    this._frame.style.left = left + 'px';
  }
  hide() {
    this._frame.classList.remove('visible');
  }
  show() {
    this._frame.classList.add('visible');
  }
  fillContent() {
    document.body.appendChild(this._frame);

    // inject font awesome script for icons
    const FAScript = document.createElement('script');
    FAScript.type = 'text/javascript';
    FAScript.src = 'https://use.fontawesome.com/releases/v5.1.0/js/all.js';
    this._frame.contentDocument.head.appendChild(FAScript);
    this._frame.contentDocument.head.appendChild(createCSSEl('css/content.css'));
    this._frame.contentDocument.body.appendChild(this._popoverEl);

    if (runsSharepoint()) {
      this._frame.contentDocument.body.classList.add('sharepoint-site');
    }
  }
}

export const popoverFrame = new Frame();
