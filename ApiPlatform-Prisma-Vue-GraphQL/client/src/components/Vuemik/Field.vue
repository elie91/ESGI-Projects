<template>
  <div>
    <component
      :value="value"
      v-if="component"
      v-bind:is="component"
      v-bind="$attrs"
      @input="(!$attrs.type || $attrs.type !== 'file') &&  handleChange($event, $attrs.name)"
      @change="($attrs.type && $attrs.type === 'file') &&  handleChange($event, $attrs.name)"
    >
      <slot></slot>
    </component>
  </div>
</template>

<script>
export default {
  name: "Field",
  props: {
    component: {
      type: String,
      default: 'input',
    },
  },
  inject: ["values", "handleChange", "getError"],
  data: function () {
    return {
      value: this.values[this.$attrs.name],
    };
  },
};
</script>
