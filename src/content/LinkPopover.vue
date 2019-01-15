<template>
  <div class="link-popper" v-show="popperVisible">
    <div class="file-options">
      <link-actions @action="confirm" :app-type="linkAppType" :on-page="true"></link-actions>
    </div>
    <div class="popper__arrow" x-arrow></div>
  </div>
</template>

<script>
import { LinkHandler, on, off, LinkUtil } from '../util';
import LinkActions from '../assets/components/LinkActions';

export default {
  name: 'LinkPopover',
  components: { LinkActions },
  data: () => ({
    linkEl: null,
    popperVisible: false,
    fileOpenOption: 'read',
    file: '',
    origin: '',
    ownerPage: '',
    linkAppType: 'word'
  }),
  created() {
    on(document, 'click', this.onDocumentClick);
    this.$parent.$on('showPopper', (linkEl, origin, ownerPage) => {
      // close popper if the same link is clicked
      if (this.linkEl === linkEl) {
        this.popperVisible = false;
        this.linkEl = null;
        return;
      }
      this.linkEl = linkEl;
      const { link, type } = LinkUtil.getLinkInfo(linkEl.href);
      this.linkAppType = type;
      this.linkUrl = link;
      this.origin = origin;
      this.ownerPage = ownerPage;
      const files = this.linkUrl.match(/\/(?:.(?!\/))+$/gi);
      this.file = files.length > 0 ? files[0] : linkEl.innerText;
      if (this.file.startsWith('/')) {
        this.file = decodeURI(this.file.substring(1, this.file.length));
      }
      this.popperVisible = true;
    });
  },
  destroyed() {
    off(document, 'click', this.onDocumentClick);
  },
  methods: {
    onDocumentClick(evt) {
      this.popperVisible = false;
      this.linkEl = false;
    },
    confirm(option) {
      this.popperVisible = false;
      window.setTimeout(() => {
        const linkHandler = new LinkHandler(option, this.linkUrl, this.origin, this.ownerPage);
        if (option === 'markasfav') {
          linkHandler.createFavorite();
          this.$notify({
            title: this.$i18n('extName'),
            message: this.$i18n('MSG_favAddedInfo', [this.file]),
            type: 'success'
          });
        } else if (option === 'copylink') {
          // Copies the link to the clipboard
          linkHandler.copyLinkAddress();
          this.$notify({
            title: this.$i18n('extName'),
            message: this.$i18n('MSG_linkCopiedInfo'),
            type: 'info',
            duration: 2000
          });
        } else {
          linkHandler.sendTabUpdateViaMessage();
        }
      }, 250);
    }
  }
};
</script>

<style lang="scss">
@import '../assets/css/base';
@import '../assets/css/vars';

.file-options {
  /*padding: 5px;*/
  .el-button {
    margin: 2px;
    padding: 10px;
  }
}

.el-dialog__title {
  font-size: 20px;
}

.notification-text {
  padding: 0 0 20px 0;
  font-size: 15px;
}

.link-popper {
  user-select: none;
  width: auto;
  background-color: #fafafa;
  color: #212121;
  text-align: center;
  padding: 2px;
  display: inline-block;
  border-radius: 3px;
  position: absolute;
  font-size: 14px;
  font-weight: normal;
  border: 1px #ebebeb solid;
  box-shadow: rgb(58, 58, 58) 0 0 6px 0;
  z-index: 1100;

  button {
    min-width: 1em;
  }

  .popper__arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
  }

  &[x-placement^='bottom'] {
    margin-top: 5px;
    .popper__arrow {
      border-width: 0 5px 5px 5px;
      border-color: transparent transparent #fafafa transparent;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^='top'] {
    margin-bottom: 5px;

    .popper__arrow {
      border-width: 5px 5px 0 5px;
      border-color: #fafafa transparent transparent transparent;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }
  &[x-placement^='right'] {
    margin-left: 5px;
    .popper__arrow {
      border-width: 5px 5px 5px 0;
      border-color: transparent #fafafa transparent transparent;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }
  &[x-placement^='left'] {
    margin-right: 5px;
    .popper__arrow {
      border-width: 5px 0 5px 5px;
      border-color: transparent transparent transparent #fafafa;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }
}
</style>
