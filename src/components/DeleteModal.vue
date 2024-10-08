<template>
  <div
    class="modal"
    tabindex="-1"
    role="dialog"
  >
    <div
      class="modal-dialog"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Підтвердження видалення
          </h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="close"
          />
        </div>
        <div class="modal-body">
          <p>
            Ви дійсно бажаєте видалити учасника "{{
              participantToDelete.name
            }}", "{{ participantToDelete.email }}"?
          </p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="close"
          >
            Ні
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="confirmDelete"
          >
            Так
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";

const props = defineProps({
  participantToDelete: Object,
});

const emit = defineEmits(["close", "delete"]);

const close = () => {
  emit("close");
};

const confirmDelete = () => {
  emit("delete", props.participantToDelete);
  close();
};
</script>

<style scoped>
.modal {
  display: block;
}
</style>
