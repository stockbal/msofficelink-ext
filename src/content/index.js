import { popoverFrame } from '../util';
import Content from './Content.vue';
import { bus } from './bus';
import Vue from 'vue';

popoverFrame.fillContent();
popoverFrame.hide();

/* eslint-disable no-new */
new Vue({
  el: popoverFrame.popoverEl,
  render: h => h(Content)
});

const links = document.querySelectorAll('a[href]');

for (const link of links) {
  if (!/.(doc|docx|docm|xls|xlsx|xlsm|csv|ppt|pptx|pptm)$/.test(link.href)) {
    continue;
  }
  link.addEventListener('mouseenter', evt => {
    bus.$emit('show', link);
  });
  link.addEventListener('mouseleave', evt => {
    bus.$emit('hide');
  });
}
