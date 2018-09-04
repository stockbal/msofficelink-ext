<template>
    <el-popover placement="bottom"
                v-model="popoverVisible">
        <div class="file-options">
            <el-tooltip effect="dark" placement="bottom" content="Open in protected mode" :open-delay="500">
                <el-button @click="confirm('read')" size="medium" round type="primary">
                    <font-awesome-icon icon="glasses"></font-awesome-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" placement="bottom" content="Open in edit mode" :open-delay="500">
                <el-button @click="confirm('edit')" size="medium" round type="primary">
                    <font-awesome-icon icon="edit"></font-awesome-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" placement="bottom" content="Open online" :open-delay="500">
                <el-button @click="confirm('online')" size="medium" round type="primary">
                    <font-awesome-icon icon="globe"></font-awesome-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" placement="bottom" content="Download file" :open-delay="500">
                <el-button @click="confirm('download')" size="medium" round type="primary">
                    <font-awesome-icon icon="download"></font-awesome-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" placement="bottom" content="Add To Favorites" :open-delay="500">
                <el-button @click="confirm('markasfav')" size="medium" round type="primary">
                    <font-awesome-icon icon="star"></font-awesome-icon>
                </el-button>
            </el-tooltip>
        </div>
        <a href="#" slot="reference" v-html="html" :class="classes"></a>
    </el-popover>
</template>

<script>
import { LinkHandler } from '../util';

export default {
  name: 'LinkPopover',
  props: ['href', 'text', 'html', 'classes'],
  data: () => ({
    popoverVisible: false,
    file: ''
  }),
  created() {
    const files = this.href.match(/\/(?:.(?!\/))+$/gi);
    this.file = files.length > 0 ? files[0] : this.text;
    if (this.file.startsWith('/')) {
      this.file = decodeURI(this.file.substring(1, this.file.length));
    }
  },
  methods: {
    confirm(option) {
      this.popoverVisible = false;
      window.setTimeout(() => {
        const linkHandler = new LinkHandler(
          option,
          this.href,
          window.location.origin,
          window.location.href
        );
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
</style>
