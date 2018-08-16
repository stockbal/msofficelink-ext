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

  const newLink = document.createElement('a');
  newLink.href = link.href;
  newLink.innerHTML = link.innerHTML;

  link.classList.forEach(clsname => {
    newLink.classList.add(clsname);
  });

  newLink.onmousedown = evt => {
    // TODO: do custom link handling here
    evt.preventDefault();
    evt.stopPropagation();
    return true;
  };

  newLink.onmouseup = evt => {
    evt.preventDefault();
    evt.stopPropagation();
    return true;
  };

  newLink.onclick = evt => {
    evt.preventDefault();
    evt.stopPropagation();
    return true;
  };

  link.parentNode.replaceChild(newLink, link);

  newLink.addEventListener('mouseenter', evt => {
    popover.$emit('show', newLink, evt);
  });
  newLink.addEventListener('mouseleave', evt => {
    popover.$emit('hide');
  });
}
