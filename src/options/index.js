import '../assets/css/element-ui.scss';
import App from './root';
import ElementUI from 'element-ui';
import Vue from 'vue';
import localeEN from 'element-ui/lib/locale/lang/en';
import localeDE from 'element-ui/lib/locale/lang/de';
import '../util/initIconLibrary';

Vue.config.productionTip = false;
Vue.prototype.$i18n = chrome.i18n.getMessage;

document.title = chrome.i18n.getMessage('extName') + ' | ' + chrome.i18n.getMessage('extOptions');

const currentLocale = chrome.i18n.getUILanguage();
const locale = currentLocale === 'de' ? localeDE : localeEN;

Vue.use(ElementUI, { locale });

/* eslint-disable no-new */
new Vue({
  el: '#root',
  render: h => h(App)
});
