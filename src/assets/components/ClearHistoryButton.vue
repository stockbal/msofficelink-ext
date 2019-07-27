<template>
  <el-button @click="clear" :type="type" :size="size">{{ $i18n('Btn_clearHistory') }}</el-button>
</template>

<script>
import { ExtStorage } from '../../ext/ExtStorage';

export default {
  name: 'ClearHistoryButton',
  props: {
    type: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    }
  },
  methods: {
    async clear() {
      try {
        await this.$confirm(this.$i18n('MSG_deleteHistoryWarning'), this.$i18n('Warning'), {
          confirmButtonText: this.$i18n('Ok'),
          cancelButtonText: this.$i18n('Cancel'),
          type: 'warning'
        });
        await ExtStorage.clearLinkHistory();
        this.$emit('cleared');
        this.$notify({
          type: 'info',
          message: this.$i18n('MSG_historyWasDeleted'),
          duration: 2500
        });
      } catch (e) {}
    }
  }
};
</script>

<style></style>
