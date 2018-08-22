import '../assets/css/element-ui.scss';
import LinkOptions from './LinkOptions';
import ElementUI from 'element-ui';
import Vue from 'vue';
import localeEN from 'element-ui/lib/locale/lang/en';
import localeDE from 'element-ui/lib/locale/lang/de';
import { buildLinkActionUrl, sendUpdateTabRequest } from '../util';

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

const getLinkDefaultAction = () =>
  new Promise((resolve, reject) => {
    // read current extension settings
    chrome.storage.sync.get('settings', ({ settings }) => {
      resolve(settings.linkDefaultAction || 'original');
    });
  });

const updateOfficeLinks = async () => {
  const links = document.querySelectorAll('a[href]');

  let officeLinkCount = 0;
  const defaultAction = await getLinkDefaultAction();

  for (const link of links) {
    if (!/.(doc|docx|docm|xls|xlsx|xlsm|csv|ppt|pptx|pptm)$/.test(link.href)) {
      continue;
    }

    officeLinkCount++;

    if (defaultAction !== 'original') {
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
          const defaultAction = await getLinkDefaultAction();
          if (defaultAction === 'original') {
          } else {
            if (defaultAction === 'dialog') {
              popover.$emit('openDialog', newLink, evt);
            } else {
              sendUpdateTabRequest(buildLinkActionUrl(defaultAction, newLink.href));
            }
            evt.preventDefault();
            evt.stopPropagation();
            return true;
          }
        }
      });

      link.parentNode.replaceChild(newLink, link);
    }
  }

  // retrieve current tab id from background script
  chrome.runtime.sendMessage({ action: 'updateBadge', officeLinkCount }, tabId => {});
};

updateOfficeLinks();

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   console.log('update links');
//   if (request.action && request.action === 'updateLinks') {
//     updateOfficeLinks();
//   }
// });
