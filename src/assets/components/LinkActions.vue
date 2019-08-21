<template>
  <div class="link-actions" :class="appClass">
    <div class="link-actions__action" @click="onAction('read')">
      <font-awesome-icon icon="glasses" fixed-width></font-awesome-icon>
      {{ $i18n('LinkOption_openProtected') }}
    </div>
    <div class="link-actions__action" @click="onAction('edit')">
      <font-awesome-icon icon="edit" fixed-width></font-awesome-icon>
      {{ $i18n('LinkOption_openEdit') }}
    </div>
    <div class="link-actions__action" @click="onAction('online')">
      <font-awesome-icon icon="globe" fixed-width></font-awesome-icon>
      {{ $i18n('LinkOption_openOnline') }}
    </div>
    <div class="link-actions__separator"></div>
    <div class="link-actions__action" @click="onAction('copylink')">
      <font-awesome-icon icon="copy" fixed-width></font-awesome-icon>
      {{ $i18n('LinkOption_copyDocLink') }}
    </div>
    <div class="link-actions__separator"></div>
    <div class="link-actions__action" @click="onAction('download')">
      <font-awesome-icon icon="download" fixed-width></font-awesome-icon>
      {{ $i18n('LinkOption_download') }}
    </div>
    <div v-if="onPage" class="link-actions__action" @click="onAction('markasfav')">
      <font-awesome-icon icon="star" fixed-width></font-awesome-icon>
      {{ $i18n('LinkOption_addToFavs') }}
    </div>
    <div class="link-actions__separator"></div>
    <div class="link-actions__action" @click="onAction('parent')">
      <font-awesome-icon icon="folder-open" fixed-width></font-awesome-icon>
      {{ $i18n('LinkOption_openParent') }}
    </div>
    <div v-if="!onPage" class="link-actions__action" @click="onAction('owner')">
      <font-awesome-icon icon="file-alt" fixed-width></font-awesome-icon>
      {{ $i18n('LinkOption_openOwnerPage') }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'LinkActions',
  props: {
    appType: {
      type: String,
      default: 'word'
    },
    enableLinkCopy: {
      type: Boolean,
      default: false
    },
    onPage: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    appClass() {
      return `link-actions--${this.appType}`;
    }
  },
  created() {},
  methods: {
    onAction(action) {
      this.$emit('action', action);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../css/base';

.link-actions {
  font-size: 10px;
  text-align: left;
  line-height: 2;
}

.link-actions__action {
  font-size: 13px;
  padding: 5px 7px;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: #f3f3f3;
    color: $--color-primary;
  }
  &:active {
    background: darken(#e5e5e5, 5%);
    font-weight: 600;
    color: $--color-primary;
  }
}

.link-actions__separator {
  background: #ccc;
  margin: 0 5px;
  height: 1px;
}

.link-actions--word {
  .link-actions__action {
    &:hover,
    &:active {
      color: $--word;
    }
  }
}

.link-actions--excel {
  .link-actions__action {
    &:hover,
    &:active {
      color: $--excel;
    }
  }
}

.link-actions--powerpoint {
  .link-actions__action {
    &:hover,
    &:active {
      color: $--powerpoint;
    }
  }
}
.link-actions--visio {
  .link-actions__action {
    &:hover,
    &:active {
      color: $--visio;
    }
  }
}
</style>
