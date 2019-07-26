import Vue from 'vue';
import root from './root.vue';
import ElementUI from 'element-ui';
import '../assets/css/element-ui.scss';
import localeEN from 'element-ui/lib/locale/lang/en';
import localeDE from 'element-ui/lib/locale/lang/de';
import '../util/initAwesomeIconsForHistory';

Vue.config.productionTip = false;
Vue.prototype.$i18n = chrome.i18n.getMessage;

const currentLocale = chrome.i18n.getUILanguage();
const locale = currentLocale === 'de' ? localeDE : localeEN;

Vue.use(ElementUI, { locale });

/* eslint-disable no-new */
new Vue({
  // eslint-disable-line no-new
  el: '#root',
  render: h => h(root)
});
