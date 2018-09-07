<template>
    <div class="document-link flex flex--row flex--align-center">
        <div v-if="mode === 'history-page'" class="document-link__check">
            <el-checkbox :checked="checked" @change="onChecked"></el-checkbox>
        </div>
        <div class="document-link__icon">
            <img v-if="link.protocol === 'ms-word'" src="../../../static/icons/word-app.svg" width="20px"
                 alt="word">
            <img v-else-if="link.protocol === 'ms-excel'" src="../../../static/icons/excel-app.svg"
                 width="20px"
                 alt="word">
            <img v-else src="../../../static/icons/powerpoint-app.svg" width="20px" alt="word">
        </div>
        <div class="flex flex--column document-link__content" @click="onLinkClick">
            <h3>{{link.file}}</h3>
            <h4>{{link.href}}</h4>
        </div>
        <div class="document-link__fav-indicator" @click="changeFav" :class="'document-link__fav-indicator--' + link.type">
            <el-tooltip v-if="mode === 'history' || mode === 'history-page'" class="item" effect="dark" :content="favToolTip" placement="bottom" :open-delay="500">
                <font-awesome-icon :icon="favIcon"></font-awesome-icon>
            </el-tooltip>
            <el-tooltip v-else class="item" effect="dark" :content="$i18n('Link_deleteFavorite')" placement="bottom" :open-delay="500">
                <font-awesome-icon :icon="['far', 'trash-alt']"></font-awesome-icon>
            </el-tooltip>
        </div>
        <div class="flex flex--row flex--align-center document-link__action">
            <el-popover placement="left"
                        popper-class="document-link__action-popper"
                        v-model="actionPopoverVisible">
                <link-actions @action="performLinkAction" :app-type="link.type"></link-actions>
                <el-button slot="reference" round type="text" icon="el-icon-more" circle></el-button>
            </el-popover>
        </div>
    </div>
</template>

<script>
import LinkActions from './LinkActions';
import { LinkHandler } from '../../util/index';
import { ExtStorage } from '../../ext/storage';

export default {
  name: 'DocumentLink',
  props: {
    link: {
      type: Object
    },
    mode: {
      type: String,
      default: 'history'
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
    performLinkAction(action) {
      this.actionPopoverVisible = false;
      const { origin, href, ownerPage } = this.link;
      new LinkHandler(action, href, origin, ownerPage).sendTabUpdateImmediately(true);
    },
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
      this.$emit('favChanged');
    }
  },
  created() {},
  mounted() {}
};
</script>

<style lang="scss">
@import '../css/base';

.document-link {
  padding: 5px;
  &:hover {
    background: #f8f8f8;
  }
}

.document-link__icon {
  margin: 0 auto;
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
    max-width: 386px;
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
}

.document-link__check {
  padding: 0 15px 0 5px;
}
</style>
