<template>
    <div class="form-entry">
        <label class="form-entry__label">{{label}}</label>
        <div class="form-entry__content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
  props: ['label'],
  data: () => ({}),
  mounted() {}
};
</script>

<style lang="scss">
@import '../css/element-ui';
@import '../css/base';

.form-entry {
  margin: 1em 0;
}

.form-entry__label {
  display: block;
  font-size: inherit;
  color: #606266;
}

.form-entry__content {
  /*border: 1px solid;*/
  position: relative;
  overflow: hidden;
}
</style>
