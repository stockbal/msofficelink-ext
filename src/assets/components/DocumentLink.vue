<template>
  <div class="document-link flex flex--row flex--align-center">
    <div v-if="checkable" class="document-link__check">
      <el-checkbox v-model="link.checked" @change="onChecked"></el-checkbox>
    </div>
    <div class="document-link__icon" :class="'document-link__icon--' + link.type">
      <font-awesome-icon
        v-if="link.type !== 'visio'"
        :icon="'file-' + link.type"
        fixed-width
      ></font-awesome-icon>
      <font-awesome-layers v-else fixed-width class="fa-1x">
        <font-awesome-icon icon="file" />
        <font-awesome-layers-text class="visio-icon-text" transform="down-2 shrink-8" value="V" />
      </font-awesome-layers>
    </div>
    <div v-if="showOpenedOn" class="document-link__opened-on">{{ link.openedOn }}</div>
    <div class="flex flex--column document-link__content" @click="onLinkClick">
      <h3>{{ link.file }}</h3>
      <h4>{{ link.href }}</h4>
    </div>
    <div
      class="document-link__fav-indicator"
      @click="changeFav"
      :class="'document-link__fav-indicator--' + link.type"
    >
      <el-tooltip
        v-if="mode === 'history' || mode === 'history-page'"
        class="item"
        effect="dark"
        :content="favToolTip"
        placement="bottom"
        :open-delay="500"
      >
        <font-awesome-icon :icon="favIcon"></font-awesome-icon>
      </el-tooltip>
      <el-tooltip
        v-else
        class="item"
        effect="dark"
        :content="$i18n('Link_deleteFavorite')"
        placement="bottom"
        :open-delay="500"
      >
        <font-awesome-icon :icon="['far', 'trash-alt']"></font-awesome-icon>
      </el-tooltip>
    </div>
    <div class="flex flex--row flex--align-center document-link__action">
      <el-popover
        placement="left"
        popper-class="document-link__action-popper"
        v-model="actionPopoverVisible"
      >
        <link-actions @action="performLinkAction" :app-type="link.type"></link-actions>
        <el-button slot="reference" round type="text" icon="el-icon-more" circle></el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>
import LinkActions from './LinkActions';
import { ExtStorage } from '../../ext/ExtStorage';
import { LinkHandler } from '../../util/LinkHandler';

export default {
  name: 'DocumentLink',
  props: {
    link: {
      type: Object
    },
    mode: {
      type: String,
      default: 'history-page'
    },
    showOpenedOn: {
      type: Boolean,
      default: false
    },
    checkable: {
      type: Boolean,
      default: false
    },
    checked: {}
  },
  components: {
    LinkActions
  },
  data: () => ({
    actionPopoverVisible: false
  }),
  computed: {
    favIcon() {
      return this.link.isFav ? ['fas', 'star'] : ['far', 'star'];
    },
    favToolTip() {
      return !this.link.isFav ? this.$i18n('Link_addFavorite') : this.$i18n('Link_deleteFavorite');
    }
  },
  methods: {
    onChecked(val) {
      this.$emit('update:checked', val);
    },
    /**
     * Performs the specified action for the link
     *
     * @param action the action to be performed
     */
    performLinkAction(action) {
      this.actionPopoverVisible = false;
      const { origin, href, ownerPage } = this.link;
      new LinkHandler(action, href, origin, ownerPage).sendTabUpdateImmediately(true);
      if (action === 'copylink') {
        if (this.mode === 'history-page') {
          this.$notify({
            message: this.$i18n('MSG_linkCopiedInfo'),
            showClose: false,
            type: 'info',
            duration: 2000
          });
        } else {
          this.$message({
            message: this.$i18n('MSG_linkCopiedInfo'),
            type: 'info',
            duration: 2000
          });
        }
      }
    },
    /**
     * Handle a direct click on the document link
     * @returns {Promise<void>}
     */
    async onLinkClick() {
      const settings = await ExtStorage.getSettings();
      const { origin, href, ownerPage } = this.link;
      new LinkHandler(
        settings.menuLinkDefaultAction,
        href,
        origin,
        ownerPage
      ).sendTabUpdateImmediately(true);
    },
    changeFav() {
      this.link.isFav = !this.link.isFav;
      // update history link in storage
      if (this.link.isFav) {
        ExtStorage.addLinkToFavorites(this.link);
      } else {
        ExtStorage.removeLinkFromFavorites(this.link.href);
      }
      this.$emit('favChanged');
    }
  },
  created() {},
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import '../css/base';

.document-link {
  padding: 5px;
  &:hover {
    background: #f8f8f8;
  }
}

.document-link__icon {
  margin: 0 auto;
  font-size: 20px;
}

.document-link__content {
  flex: 1;
  padding: 0 15px;
  overflow: hidden;
  cursor: pointer;

  h3,
  h4 {
    margin: 2px;
  }
  h4 {
    font-weight: 200;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.document-link__action {
  padding: 5px;
}

.document-link__action-popper {
  &.el-popover {
    padding: 0;
  }
}

.document-link__icon--powerpoint {
  color: $--powerpoint;
}
.document-link__icon--excel {
  color: $--excel;
}
.document-link__icon--word {
  color: $--word;
}
.document-link__icon--visio {
  color: $--visio;
}

.document-link__fav-indicator {
  cursor: pointer;
  font-size: 14px;

  &.document-link__fav-indicator--powerpoint {
    &:hover {
      color: $--powerpoint;
    }
  }
  &.document-link__fav-indicator--excel {
    &:hover {
      color: $--excel;
    }
  }
  &.document-link__fav-indicator--word {
    &:hover {
      color: $--word;
    }
  }
  &.document-link__fav-indicator--visio {
    &:hover {
      color: $--visio;
    }
  }
}

.visio-icon-text {
  color: white;
}

.document-link__check {
  padding: 0 15px 0 5px;
}

.document-link__opened-on {
  padding: 0 0 0 15px;
  min-width: 80px;
}
</style>
