<template>
  <div>
    <slot :handleSubmit="handleSubmit" :handleChange="handleChange" :values="values" :errors="errors"></slot>
  </div>
</template>

<script>
import {toBase64} from "@/utils";

export default {
  name: "Vuemik",
  props: {
    initialValues: Object,
    onSubmit: Function,
    validationSchema: {
      type: Object,
      required: false,
    },
  },
  data: function () {
    return {
      values: this.$props.initialValues,
      errors: {},
    };
  },
  methods: {
    handleChange: async function (value, name) {
      if (value instanceof File) {
        const fileData = await toBase64(value);
        this.$data.values = {...this.$data.values, [name]: fileData};
      } else if (Array.isArray(value) && value.every(val => val instanceof File)) {
        const filesData = [];
        value.forEach(file => filesData.push(toBase64(file)));
        Promise.all(filesData)
          .then(filesData => this.$data.values = {...this.$data.values, [name]: filesData})
      } else {
        this.$data.values = {...this.$data.values, [name]: value};
      }
    },
    handleSubmit: function () {
      if (this.$props.validationSchema) {
        this.validateFields().then((values) => {
          this.$props.onSubmit(values);
        });
      } else {
        this.$props.onSubmit(this.$data.values);
      }
    },
    validateFields: function () {
      return new Promise((resolve) => {
        this.$props.validationSchema.validate(this.$data.values, {
          abortEarly: false,
        }).then(() => {
          this.$data.errors = {};
          resolve(this.$data.values);
        })
          .catch(err => {
            this.$data.errors = {};
            err.inner.forEach((error) => {
              this.$set(this.$data.errors, error.path, error.message);
            });
            resolve({errors: this.$data.errors});
          });
      });

    },
    getError: function (name) {
      return this.$data.errors[name];
    },
  },
  provide: function () {
    return {
      values: this.$data.values,
      handleChange: this.handleChange,
      getError: this.getError,
    };
  },
};
</script>
