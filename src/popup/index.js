import Vue from 'vue';
import root from './root.vue';
import ElementUI from 'element-ui';
import '../assets/css/element-ui.scss';
import localeEN from 'element-ui/lib/locale/lang/en';
import localeDE from 'element-ui/lib/locale/lang/de';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faGlobe, faGlasses, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faEdit, faGlobe, faGlasses, faDownload);

Vue.component(FontAwesomeIcon.name, FontAwesomeIcon);

Vue.config.productionTip = false;

const currentLocale = chrome.i18n.getUILanguage();
const locale = currentLocale === 'de' ? localeDE : localeEN;

Vue.use(ElementUI, { locale });

/* eslint-disable no-new */
new Vue({
  // eslint-disable-line no-new
  el: '#root',
  render: h => h(root)
});
