<template>
    <transition name="fade">
        <div v-show="visible" class="link-popover msoffice-open--dark"
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
    </transition>
</template>

<script>
import { TIMER_DURATION, popoverFrame, sendUpdateTabRequest, getProtocol } from '../util';

export default {
  data: () => ({
    visible: false,
    timer: null,
    linkType: '',
    linkText: '',
    linkURL: ''
  }),
  created() {
    this.$parent.$on('show', (link, evt) => {
      this.resetTimer();
      this.$data.linkType = getProtocol(link.href);
      this.$data.linkURL = link.href;
      this.startShowTimer(link, evt);
    });
    this.$parent.$on('hide', link => {
      this.resetTimer();
      this.startHideTimer();
    });
  },
  computed: {
    isSharepoint() {
      return this.$parent.isSharepoint;
    }
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
    setSharepoint(isSharepoint) {
      this.isSharepoint = isSharepoint;
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
    startShowTimer(link = null, evt) {
      this.$data.timer = setTimeout(() => {
        console.log(evt.movementY);
        if (link) {
          const { y, height } = link.getBoundingClientRect();
          popoverFrame.setTop(y + height + scrollY);

          popoverFrame.setLeft(evt.pageX - 30);
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
@import '../assets/css/base';
@import './content';

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.p-l-5 {
  padding-left: 5px;
}

.link-popover {
  display: none;
  border-radius: 7px;
  padding: 1px 0 1px 5px;
  z-index: 2000;
  line-height: 1.4;
  text-align: justify;
}

.link-popover__content {
}

.link-popover__link {
  font-size: 17px;
}

.link-popover__link > svg {
  font-size: 21px;
}

.link-popover__link > span {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.link-popover__button-bar {
}

.popover-button {
  height: 40px;
  width: 40px;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  -webkit-transition: background-color 0.3s;
  transition: background-color 0.3s;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.54);
  box-sizing: border-box;
  display: -webkit-flex;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
  fill: currentColor;
  -webkit-flex: none;
  flex: none;
  border: none;
  background: transparent;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    /*transition: transform 0.15s;*/
    transform: scale(0);
    border-radius: 50%;

    background-color: rgba(152, 163, 171, 0.3) !important;
  }

  /*&:active:before {*/
  /*transform: none;*/
  /*}*/

  &:active {
    outline: none;

    &:before {
      tranform: none;
    }
  }

  &:hover,
  &:focus {
  }
}

.link-popover__arrow {
  width: 0;
  height: 0;
  position: absolute;
  border: 5px solid transparent;
  border-top-width: 0;
  top: -2px;
  left: calc(50% - 5px);
  margin: 5px 5px 0;
}

.link-popover__button-bar .popover-button.is-round {
  border-radius: 20px;
  height: 20px;
  padding: 20px;
}

.link-popover--visible {
  display: block;
}

/* DARK Style */

.msoffice-open--dark {
  .link-popover__arrow {
    border-bottom-color: black;
  }

  .popover-button {
    color: #fff;

    &:active {
      color: white;
    }

    &:hover,
    &:focus {
      color: #c9c9c9;
    }
  }

  &.link-popover {
    color: white;
    box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.3);
    background-color: rgba(17, 17, 17, 1);
  }
}

/* LIGHT style */
.msoffice-open--light {
  &.link-popover {
    color: black;
    box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.3);
    background-color: white;
  }

  .link-popover__arrow {
    border-bottom-color: white;
  }
  .popover-button {
    color: black;

    &:active {
      color: black;
    }

    &:hover,
    &:focus {
      color: #5a5a5a;
    }
  }
}
</style>
