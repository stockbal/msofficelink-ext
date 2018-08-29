import '../assets/css/element-ui.scss';
import LinkOptions from './LinkOptions';
import ElementUI from 'element-ui';
import Vue from 'vue';
import localeEN from 'element-ui/lib/locale/lang/en';
import localeDE from 'element-ui/lib/locale/lang/de';
import { LinkHandler } from '../util';
import { ExtStorage } from '../ext/storage';

Vue.config.productionTip = false;

const currentLocale = chrome.i18n.getUILanguage();
const locale = currentLocale === 'de' ? localeDE : localeEN;

Vue.use(ElementUI, { locale });

const popoverEl = document.createElement('div');
document.body.appendChild(popoverEl);

/* eslint-disable no-new */
const popover = new Vue({
  el: popoverEl,
  render: h => h(LinkOptions)
});

const updateOfficeLinks = async () => {
  const links = document.querySelectorAll('a[href]');

  let officeLinkCount = 0;
  const settings = await ExtStorage.getSettings();

  for (const link of links) {
    if (!/.(doc|docx|docm|xls|xlsx|xlsm|csv|ppt|pptx|pptm)$/.test(link.href)) {
      continue;
    }

    officeLinkCount++;

    if (settings.linkDefaultAction !== 'original') {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.innerHTML = link.innerHTML;

      link.classList.forEach(clsname => {
        newLink.classList.add(clsname);
      });

      // handle the link click
      newLink.addEventListener('mousedown', async evt => {
        if (!evt.button) {
          // check the required option
          const settings = await ExtStorage.getSettings();
          const defaultAction = settings.linkDefaultAction;
          if (defaultAction === 'original') {
          } else {
            evt.preventDefault();
            evt.stopPropagation();

            if (defaultAction === 'dialog') {
              popover.$emit('openDialog', newLink, evt);
            } else {
              new LinkHandler(newLink.href, defaultAction).sendTabUpdateViaMessage();
            }

            return true;
          }
        }
      });

      newLink.addEventListener('click', evt => {
        evt.preventDefault();
        evt.stopPropagation();
        return true;
      });

      newLink.addEventListener('mouseup', evt => {
        evt.preventDefault();
        evt.stopPropagation();
        return true;
      });

      link.parentNode.replaceChild(newLink, link);
    } else if (settings.linkHistoryActive) {
      link.addEventListener('mousedown', evt => {
        // TODO: store link in history
      });
    }
  }

  // retrieve current tab id from background script
  chrome.runtime.sendMessage({ action: 'updateBadge', officeLinkCount }, tabId => {});
};

updateOfficeLinks();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action && request.action === 'updateLinks') {
    updateOfficeLinks();
  }
});
