<template>
    <el-dialog title="Open Microsoft Office Document" class="msoffice-link-dialog"
               :visible.sync="dialogVisible"
               width="30%">
        <div class="notification-text">You are about to open the file <em><u>{{file}}</u></em></div>
        <div class="notification-text">Choose the file operation</div>
        <div class="file-options">
            <el-tooltip effect="dark" placement="bottom" content="Open in protected mode">
                <el-button @click="confirm('read')" size="medium" round type="primary">
                    <font-awesome-icon icon="glasses"></font-awesome-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" placement="bottom" content="Open in edit mode">
                <el-button @click="confirm('edit')" size="medium" round type="primary">
                    <font-awesome-icon icon="edit"></font-awesome-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" placement="bottom" content="Open online">
                <el-button @click="confirm('online')" size="medium" round type="primary">
                    <font-awesome-icon icon="globe"></font-awesome-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" placement="bottom" content="Download file">
                <el-button @click="confirm('download')" size="medium" round type="primary">
                    <font-awesome-icon icon="download"></font-awesome-icon>
                </el-button>
            </el-tooltip>
        </div>
    </el-dialog>
</template>

<script>
import { LinkHandler } from '../util';

export default {
  name: 'LinkOptions',
  data: () => ({
    dialogVisible: false,
    fileOpenOption: 'read',
    file: '',
    origin: '',
    ownerPage: ''
  }),
  created() {
    this.$parent.$on('openDialog', (link, origin, ownerPage) => {
      this.linkUrl = link.href;
      this.origin = origin;
      this.ownerPage = ownerPage;
      const files = link.href.match(/\/(?:.(?!\/))+$/gi);
      this.file = files.length > 0 ? files[0] : link.innerText;
      if (this.file.startsWith('/')) {
        this.file = decodeURI(this.file.substring(1, this.file.length));
      }
      this.dialogVisible = true;
    });
  },
  methods: {
    confirm(option) {
      this.dialogVisible = false;
      window.setTimeout(() => {
        new LinkHandler(option, this.linkUrl).sendTabUpdateViaMessage();
      }, 300);
    }
  }
};
</script>

<style lang="scss">
@import '../assets/css/base';
@import '../assets/css/vars';

.el-radio-group {
  display: block;
  padding: 5px;
}

.el-radio {
  display: block;
  padding: 5px;

  + .el-radio {
    margin-left: 0;
  }
}

.msoffice-link-dialog {
  font-family: Google Sans, Roboto, sans-serif;
}

.file-options {
  padding: 5px;
  .el-button {
    margin: 2px;
    padding: 10px;
  }
}

.el-dialog {
  button {
    min-width: 1em;
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
