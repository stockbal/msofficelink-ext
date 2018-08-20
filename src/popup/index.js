import Vue from 'vue';
import root from './root.vue';
import ElementUI from 'element-ui';
import '../assets/css/element-ui.scss';
import locale from 'element-ui/lib/locale/lang/en';

Vue.config.productionTip = false;

Vue.use(ElementUI, { locale });

/* eslint-disable no-new */
new Vue({
  // eslint-disable-line no-new
  el: '#root',
  render: h => h(root)
});
