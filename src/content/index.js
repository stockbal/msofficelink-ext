import { popoverFrame } from '../util';
import Content from './Content.vue';
import Vue from 'vue';

popoverFrame.fillContent();
popoverFrame.hide();

/* eslint-disable no-new */
const popover = new Vue({
  data: {
    isSharepoint: popoverFrame.isSharePointSite
  },
  el: popoverFrame.popoverEl,
  render: h => h(Content)
});

const links = document.querySelectorAll('a[href]');

for (const link of links) {
  if (!/.(doc|docx|docm|xls|xlsx|xlsm|csv|ppt|pptx|pptm)$/.test(link.href)) {
    continue;
  }
  link.addEventListener('mouseenter', evt => {
    popover.$emit('show', link, evt);
  });
  link.addEventListener('mouseleave', evt => {
    popover.$emit('hide');
  });
}
