<template>
    <el-button @click="clear" :type="type" :size="size">{{$i18n('Btn_clearFavs')}}</el-button>
</template>

<script>
import { ExtStorage } from '../../ext/storage';

export default {
  name: 'ClearFavoritesButton',
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
        await this.$confirm(this.$i18n('MSG_deleteAllFavsWarning'), this.$i18n('Warning'), {
          confirmButtonText: this.$i18n('Ok'),
          cancelButtonText: this.$i18n('Cancel'),
          type: 'warning'
        });
        await ExtStorage.clearLinkFavorites();
        this.$notify({ type: 'info', message: this.$i18n('MSG_favsWereDeleted'), duration: 2500 });
        this.$emit('cleared');
      } catch (e) {}
    }
  }
};
</script>

<style scoped>
</style>
