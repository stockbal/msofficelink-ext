<template>
    <div class="link-actions">
        <div class="link-actions__action" @click="onAction('read')">
            <font-awesome-icon icon="glasses" fixed-width></font-awesome-icon>
            Open in protected mode
        </div>
        <div class="link-actions__action" @click="onAction('edit')">
            <font-awesome-icon icon="edit" fixed-width></font-awesome-icon>
            Open in edit mode
        </div>
        <div class="link-actions__action" @click="onAction('online')">
            <font-awesome-icon icon="globe" fixed-width></font-awesome-icon>
            Open online
        </div>
        <div class="link-actions__action" @click="onAction('download')">
            <font-awesome-icon icon="download" fixed-width></font-awesome-icon>
            Download file
        </div>
    </div>
</template>

<script>
export default {
  name: 'LinkActions',
  methods: {
    onAction(action) {
      this.$emit('action', action);
    }
  }
};
</script>

<style lang="scss">
.link-actions {
  font-size: 10px;
  line-height: 2;
}

.link-actions__action {
  font-size: 13px;
  padding: 5px 7px;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: #f3f3f3;
  }
  &:active {
    background: darken(#e5e5e5, 5%);
    font-weight: 600;
  }
}
</style>
