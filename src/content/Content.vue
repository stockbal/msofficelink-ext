<template>
    <div class="link-popover msoffice-open--dark"
         :class="{'link-popover--visible': visible, 'sharepoint-site': isSharepoint}" @mouseenter="onMouseEnter"
         @mouseleave="onMouseLeave">
        <div class="link-popover__arrow" style="left: 30px;"></div>
        <div class="link-popover__content flex flex--column"></div>
        <div class="link-popover__button-bar flex flex--row">
            <div class="popover-button is-round" title="View in local MS office" @click="viewLocally">
                <i class="fas fa-glasses"></i>
            </div>
            <div class="popover-button is-round" title="Edit in local MS office" @click="editLocally">
                <i class="fas fa-edit"></i>
            </div>
            <div class="popover-button is-round" title="View online" @click="viewOnline" v-if="isSharepoint">
                <i class="fas fa-globe"></i>
            </div>
            <div class="popover-button is-round" title="Download file" @click="downloadFile" v-if="isSharepoint">
                <i class="fas fa-download"></i>
            </div>
        </div>
    </div>
</template>

<script>
import {
  TIMER_DURATION,
  popoverFrame,
  runsSharepoint,
  sendUpdateTabRequest,
  getProtocol
} from '../util';

import { bus } from './bus';

export default {
  data: () => ({
    visible: true,
    isSharepoint: runsSharepoint(),
    timer: null,
    linkType: '',
    linkText: '',
    linkURL: ''
  }),
  created() {
    bus.$on('show', link => {
      this.resetTimer();
      this.$data.linkType = getProtocol(link.href);
      this.$data.linkURL = link.href;
      this.startShowTimer(link);
    });
    bus.$on('hide', link => {
      this.resetTimer();
      this.startHideTimer();
    });
  },
  methods: {
    onMouseEnter(evt) {
      this.resetTimer();
      this.startShowTimer();
    },
    onMouseLeave(evt) {
      this.resetTimer();
      this.hide();
      popoverFrame.hide();
    },
    viewLocally() {
      sendUpdateTabRequest(this.linkType + ':ofv|u|' + this.linkURL);
    },
    editLocally() {
      sendUpdateTabRequest(this.linkType + ':ofe|u|' + this.linkURL);
    },
    viewOnline() {
      sendUpdateTabRequest(this.linkURL + '?web=1');
    },
    downloadFile() {},
    show() {
      this.$data.visible = true;
    },
    hide() {
      this.$data.visible = false;
    },
    resetTimer() {
      clearTimeout(this.$data.timer);
    },
    startShowTimer(link = null) {
      this.$data.timer = setTimeout(() => {
        if (link) {
          const { x, y, height } = link.getBoundingClientRect();
          popoverFrame.setTop(y + height + scrollY);

          popoverFrame.setLeft(x);
          this.$data.linkText = link.innerText;
        }
        this.show();
        popoverFrame.show();
      }, TIMER_DURATION);
    },
    startHideTimer() {
      this.$data.timer = setTimeout(() => {
        this.hide();
        popoverFrame.hide();
      }, TIMER_DURATION);
    }
  }
};
</script>

<style lang="scss">
</style>
