import '../assets/css/element-ui.scss';
import LinkPopover from './LinkPopover';
import ElementUI from 'element-ui';
import Vue from 'vue';
import localeEN from 'element-ui/lib/locale/lang/en';
import localeDE from 'element-ui/lib/locale/lang/de';
import { LinkHandler } from '../util';
import { ExtStorage } from '../ext/storage';
import '../util/initAwesomeIconsForHistory';
import Popper from 'popper.js';

Vue.config.productionTip = false;

const currentLocale = chrome.i18n.getUILanguage();
const locale = currentLocale === 'de' ? localeDE : localeEN;

Vue.use(ElementUI, { locale });

const popoverEl = document.createElement('div');
document.body.appendChild(popoverEl);

/* eslint-disable no-new */
const popover = new Vue({
  el: popoverEl,
  render: h => h(LinkPopover)
});

const updateOfficeLinks = async () => {
  const links = document.querySelectorAll('a[href]');

  let officeLinkCount = 0;
  const settings = await ExtStorage.getSettings();

  for (const link of links) {
    if (!/\.(doc|docx|docm|xls|xlsx|xlsm|csv|ppt|pptx|pptm)$/.test(link.href)) {
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
        const { origin, href } = window.location;

        if (!evt.button) {
          // check the required option
          const settings = await ExtStorage.getSettings();
          const defaultAction = settings.linkDefaultAction;
          if (defaultAction === 'original') {
            new LinkHandler(
              settings.linkDefaultAction,
              link.href,
              origin,
              href
            ).updateLinkHistory();
          } else {
            evt.preventDefault();
            evt.stopPropagation();

            if (defaultAction === 'dialog') {
              popover.$emit('showPopper', evt.target, origin, href);
              if (!window.msofficeLinkPopper) {
                window.msofficeLinkPopper = new Popper(evt.target, popover.$el, {
                  placement: 'bottom'
                });
              } else {
                window.msofficeLinkPopper.reference = evt.target;
                window.msofficeLinkPopper.update();
              }
            } else {
              new LinkHandler(defaultAction, newLink.href, origin, href).sendTabUpdateViaMessage();
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
        if (evt.button) {
          return;
        }
        new LinkHandler(
          settings.linkDefaultAction,
          link.href,
          window.location.origin,
          window.location.href
        ).updateLinkHistory();
      });
    }
  }

  // retrieve current tab id from background script
  chrome.runtime.sendMessage({ action: 'updateBadge', officeLinkCount }, tabId => {});
};

updateOfficeLinks();

window.addEventListener('popstate', evt => {
  updateOfficeLinks();
});
window.addEventListener('pushstate', evt => {
  updateOfficeLinks();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action && request.action === 'updateLinks') {
    updateOfficeLinks();
  }
});
