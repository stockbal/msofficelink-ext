import '../assets/css/element-ui.scss';
import LinkPopver from './LinkPopover';
import ElementUI from 'element-ui';
import Vue from 'vue';
import localeEN from 'element-ui/lib/locale/lang/en';
import localeDE from 'element-ui/lib/locale/lang/de';
import { LinkHandler } from '../util';
import { ExtStorage } from '../ext/storage';
import '../util/initAwesomeIconsForHistory';

Vue.config.productionTip = false;

const currentLocale = chrome.i18n.getUILanguage();
const locale = currentLocale === 'de' ? localeDE : localeEN;

Vue.use(ElementUI, { locale });

// create constructor for popover element
const LinkPopoverComp = Vue.extend(LinkPopver);

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
      const newLink = document.createElement('div');
      let classList = '';
      link.classList.forEach(clsname => {
        classList += ` ${clsname}`;
      });

      link.parentNode.replaceChild(newLink, link);

      // mount popover
      /* eslint-disable no-new */
      new LinkPopoverComp({
        propsData: {
          href: link.href,
          html: link.innerHTML,
          text: link.innerText,
          classes: classList
        }
      }).$mount(newLink);
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
