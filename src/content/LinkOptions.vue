<template>
    <el-dialog title="Open Microsoft Office Document" class="msoffice-link-dialog"
               :visible.sync="dialogVisible"
               width="30%">
        <div class="notification-text">You are about to open the file <em><u>{{file}}</u></em></div>
        <div class="notification-text">Choose the file operation</div>
        <div class="file-options">
            <el-button @click="confirm('read')" type="primary">Open in protected mode</el-button>
            <el-button @click="confirm('edit')" type="primary">Open in edit mode</el-button>
            <el-button @click="confirm('online')" type="primary">Open online</el-button>
            <el-button @click="confirm('download')" type="primary">Download</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { getProtocol, LinkHandler } from '../util';

export default {
  name: 'LinkOptions',
  data: () => ({
    dialogVisible: false,
    fileOpenOption: 'read',
    type: '',
    file: ''
  }),
  created() {
    this.$parent.$on('openDialog', (link, evt) => {
      this.type = getProtocol(link.href);
      this.linkUrl = link.href;
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
    width: 200px;
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
