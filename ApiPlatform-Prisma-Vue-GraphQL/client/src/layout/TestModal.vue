<template>
  <div class="container mt-lg-5">
    This is a test
    <button @click="openModal">Toggle Modal</button>
    <Modal :open="modalOpen">
      <template v-slot:title="{ color }">Add Item {{ color }}</template>
      <template v-slot:content>
        <h1>Le titre de ma page</h1>
      </template>
      <h1>test</h1>
    </Modal>
  </div>
</template>

<script>
import Modal from "../components/Modal";

export default {
  name: "TestModal",
  components: {
    Modal,
  },
  data: () => ({
    modalOpen: false,
  }),
  methods: {
    openModal: function () {
      this.$data.modalOpen = !this.$data.modalOpen;
    },
  },
};
</script>
