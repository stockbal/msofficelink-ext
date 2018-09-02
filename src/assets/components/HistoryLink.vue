<template>
    <div class="history-link flex flex--row flex--align-center">
        <div class="history-link__icon">
            <img v-if="link.protocol === 'ms-word'" src="../../../static/icons/word-app.svg" width="20px"
                 alt="word">
            <img v-else-if="link.protocol === 'ms-excel'" src="../../../static/icons/excel-app.svg"
                 width="20px"
                 alt="word">
            <img v-else src="../../../static/icons/powerpoint-app.svg" width="20px" alt="word">
        </div>
        <div class="flex flex--column history-link__content">
            <h3>{{link.file}}</h3>
            <h4>{{link.link}}</h4>
        </div>
        <div class="flex flex--row flex--align-center history-link__action">
            <el-popover placement="left"
                        popper-class="history-link__action-popper"
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

export default {
  name: 'HistoryLink',
  props: ['link'],
  components: {
    LinkActions
  },
  data: () => ({
    actionPopoverVisible: false
  }),
  methods: {
    performLinkAction(action) {
      this.actionPopoverVisible = false;
      const { origin, link, ownerPage } = this.link;
      new LinkHandler(action, link, origin, ownerPage).sendTabUpdateImmediately(true);
    }
  },
  created() {},
  mounted() {}
};
</script>

<style lang="scss">
@import '../css/base';

.history-link {
  padding: 5px;
  &:hover {
    background: #f8f8f8;
  }
}

.history-link__icon {
  margin: 0 auto;
}

.history-link__content {
  flex: 1;
  padding: 0 15px;
  h3,
  h4 {
    margin: 2px;
  }
  h4 {
    font-weight: 200;
  }
}

.history-link__action {
  padding: 5px;
}

.history-link__action-popper {
  &.el-popover {
    padding: 0;
  }
}
</style>
