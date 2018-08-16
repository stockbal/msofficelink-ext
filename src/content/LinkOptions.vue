<template>
    <el-dialog title="Open Microsoft Office Document" class="msoffice-link-dialog"
               :visible.sync="dialogVisible"
               width="30%">
        <div class="notification-text">You are about to open the file '{{file}}'</div>
        <el-radio-group class="file-option-radio" v-model="fileOpenOption">
            <el-radio :label="'read'">Open in Read Only mode</el-radio>
            <el-radio :label="'edit'">Open in Edit mode</el-radio>
            <el-radio :label="'online'">Open in {{type}} online</el-radio>
            <el-radio :label="'download'">Download file</el-radio>
        </el-radio-group>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="confirm">Confirm</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { getProtocol, sendUpdateTabRequest } from '../util';

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
      this.file = link.innerText;
      this.dialogVisible = true;
    });
  },
  methods: {
    confirm() {
      switch (this.fileOpenOption) {
        case 'read':
          this.viewLocally();
          break;
        case 'edit':
          this.editLocally();
          break;
        case 'online':
          this.viewOnline();
          break;
        case 'download':
          this.downloadFile();
          break;
      }
      this.dialogVisible = false;
    },
    viewLocally() {
      sendUpdateTabRequest(this.type + ':ofv|u|' + this.linkUrl);
    },
    editLocally() {
      sendUpdateTabRequest(this.type + ':ofe|u|' + this.linkUrl);
    },
    viewOnline() {
      sendUpdateTabRequest(this.linkUrl + '?web=1');
    },
    downloadFile() {
      sendUpdateTabRequest(this.linkUrl);
    }
  }
};
</script>

<style lang="scss">
@import '../assets/css/base';
@import '../assets/css/element-ui';

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

.file-option-radio {
  border: 1px solid $--color-primary;
  border-radius: 5px;
}

.notification-text {
  padding: 0 0 20px 0;
  font-size: 1.2vh;
}
</style>
