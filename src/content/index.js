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
import { LinkObserver } from './linkObserver';

Vue.config.productionTip = false;
Vue.prototype.$i18n = chrome.i18n.getMessage;

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

let observer = null;

const updateOfficeLinks = async () => {
  // stop observing
  if (observer) {
    observer.stop();
  }
  const links = document.querySelectorAll('a[href]');

  const settings = await ExtStorage.getSettings();

  for (const link of links) {
    if (!link.parentNode) {
      // this link is not really shown or existing in a state that it is clickable
      continue;
    }
    if (!/\.(doc|docx|docm|xls|xlsx|xlsm|csv|ppt|pptx|pptm)/.test(link.href)) {
      continue;
    }

    if (settings.linkDefaultAction !== 'original') {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.innerHTML = link.innerHTML;

      link.classList.forEach(clsname => {
        newLink.classList.add(clsname);
      });

      // handle the link click
      newLink.addEventListener(
        'mousedown',
        async evt => {
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
                popover.$emit('showPopper', newLink, origin, href);
                if (!window.msofficeLinkPopper) {
                  window.msofficeLinkPopper = new Popper(newLink, popover.$el, {
                    placement: 'bottom',
                    modifiers: {
                      preventOverflow: {
                        enabled: false
                      }
                    }
                  });
                } else {
                  window.msofficeLinkPopper.reference = newLink;
                  window.msofficeLinkPopper.update();
                }
              } else {
                new LinkHandler(
                  defaultAction,
                  newLink.href,
                  origin,
                  href
                ).sendTabUpdateViaMessage();
              }

              return true;
            }
          }
        },
        false
      );

      newLink.addEventListener(
        'click',
        evt => {
          evt.preventDefault();
          evt.stopPropagation();
          return true;
        },
        false
      );

      newLink.addEventListener(
        'mouseup',
        evt => {
          evt.preventDefault();
          evt.stopPropagation();
          return true;
        },
        false
      );

      link.parentNode.replaceChild(newLink, link);
    } else if (settings.linkHistoryActive) {
      link.addEventListener(
        'mousedown',
        evt => {
          if (evt.button) {
            return;
          }
          new LinkHandler(
            settings.linkDefaultAction,
            link.href,
            window.location.origin,
            window.location.href
          ).updateLinkHistory();
        },
        false
      );
    }
  }

  if (observer) {
    setTimeout(() => {
      observer.start();
    }, 300);
  }
};

updateOfficeLinks();
// inistialize observer
observer = new LinkObserver(updateOfficeLinks);

window.addEventListener('popstate', evt => {
  updateOfficeLinks();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action) {
    if (request.action === 'updateLinks') {
      updateOfficeLinks();
      // } else if (request.action === 'createdFav') {
      //   popover.$notify({
      //     title: this.$i18n('extName'),
      //     message: this.$i18n('MSG_favAddedInfo', [this.file]),
      //     type: 'success'
      //   });
    }
  }
});
