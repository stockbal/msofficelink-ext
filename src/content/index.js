import '../assets/css/element-ui.scss';
import LinkOptions from './LinkOptions';
import ElementUI from 'element-ui';
import Vue from 'vue';
import locale from 'element-ui/lib/locale/lang/en';

Vue.use(ElementUI, { locale });

const popoverEl = document.createElement('div');
document.body.appendChild(popoverEl);

/* eslint-disable no-new */
const popover = new Vue({
  el: popoverEl,
  render: h => h(LinkOptions)
});

const links = document.querySelectorAll('a[href]');

let officeLinkCount = 0;

for (const link of links) {
  if (!/.(doc|docx|docm|xls|xlsx|xlsm|csv|ppt|pptx|pptm)$/.test(link.href)) {
    continue;
  }

  officeLinkCount++;

  const newLink = document.createElement('a');
  newLink.href = link.href;
  newLink.innerHTML = link.innerHTML;

  link.classList.forEach(clsname => {
    newLink.classList.add(clsname);
  });

  newLink.onmousedown = evt => {
    if (!evt.button) {
      popover.$emit('openDialog', newLink, evt);
      evt.preventDefault();
      evt.stopPropagation();
      return true;
    }
  };

  link.parentNode.replaceChild(newLink, link);
}

// retrieve current tab id from background script
chrome.runtime.sendMessage({ action: 'updateBadge', officeLinkCount }, tabId => {});
