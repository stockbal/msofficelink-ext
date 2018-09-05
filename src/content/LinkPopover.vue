<template>
    <div class="popper" v-show="popperVisible">
        <div class="file-options">
            <el-tooltip effect="dark" placement="bottom" :content="$i18n('LinkOption_openProtected')" :open-delay="500">
                <el-button @click="confirm('read')" size="medium" round type="primary">
                    <font-awesome-icon icon="glasses"></font-awesome-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" placement="bottom" :content="$i18n('LinkOption_openEdit')" :open-delay="500">
                <el-button @click="confirm('edit')" size="medium" round type="primary">
                    <font-awesome-icon icon="edit"></font-awesome-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" placement="bottom" :content="$i18n('LinkOption_openOnline')" :open-delay="500">
                <el-button @click="confirm('online')" size="medium" round type="primary">
                    <font-awesome-icon icon="globe"></font-awesome-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" placement="bottom" :content="$i18n('LinkOption_download')" :open-delay="500">
                <el-button @click="confirm('download')" size="medium" round type="primary">
                    <font-awesome-icon icon="download"></font-awesome-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" placement="bottom" :content="$i18n('LinkOption_addToFavs')" :open-delay="500">
                <el-button @click="confirm('markasfav')" size="medium" round type="primary">
                    <font-awesome-icon icon="star"></font-awesome-icon>
                </el-button>
            </el-tooltip>
        </div>
        <div class="popper__arrow" x-arrow></div>
    </div>
</template>

<script>
import { LinkHandler, on, off } from '../util';

export default {
  name: 'LinkPopover',
  data: () => ({
    linkEl: null,
    popperVisible: false,
    fileOpenOption: 'read',
    file: '',
    origin: '',
    ownerPage: ''
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
      this.linkUrl = linkEl.href;
      this.origin = origin;
      this.ownerPage = ownerPage;
      const files = linkEl.href.match(/\/(?:.(?!\/))+$/gi);
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
    },
    confirm(option) {
      this.popperVisible = false;
      window.setTimeout(() => {
        const linkHandler = new LinkHandler(option, this.linkUrl);
        if (option === 'markasfav') {
          linkHandler.createFavorite();
        } else {
          linkHandler.sendTabUpdateViaMessage();
        }
      }, 300);
    }
  }
};
</script>

<style lang="scss">
@import '../assets/css/base';
@import '../assets/css/vars';

.file-options {
  padding: 5px;
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

.popper {
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
  /*z-index: 200000;*/
  box-shadow: rgb(58, 58, 58) 0 0 6px 0;
}
.popper .popper__arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
}
.popper[x-placement^='top'] {
  margin-bottom: 5px;
}
.popper[x-placement^='top'] .popper__arrow {
  border-width: 5px 5px 0 5px;
  border-color: #fafafa transparent transparent transparent;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}
.popper[x-placement^='bottom'] {
  margin-top: 5px;
}
.popper[x-placement^='bottom'] .popper__arrow {
  border-width: 0 5px 5px 5px;
  border-color: transparent transparent #fafafa transparent;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}
.popper[x-placement^='right'] {
  margin-left: 5px;
}
.popper[x-placement^='right'] .popper__arrow {
  border-width: 5px 5px 5px 0;
  border-color: transparent #fafafa transparent transparent;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}
.popper[x-placement^='left'] {
  margin-right: 5px;
}
.popper[x-placement^='left'] .popper__arrow {
  border-width: 5px 0 5px 5px;
  border-color: transparent transparent transparent #fafafa;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}
</style>
