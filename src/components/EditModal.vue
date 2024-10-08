<template>
  <div
    class="modal fade show d-block"
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
            Edit Participant
          </h5>
          <button
            type="button"
            class="close"
            @click="$emit('close')"
          >
            <span>&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form
            novalidate
            @submit.prevent="submitForm"
          >
            <div class="form-group">
              <label for="name">Name</label>
              <input
                v-model="editedUser.name"
                type="text"
                class="form-control"
                :class="{
                  'is-invalid': !isNameValid && isFormSubmitted,
                  'is-valid': isNameValid && isFormSubmitted,
                }"
                required
              >
              <div
                v-if="!isNameValid && isFormSubmitted"
                class="invalid-feedback"
              >
                Please enter a valid name.
              </div>
            </div>
            <div class="form-group">
              <label for="dob">Date of Birth</label>
              <input
                v-model="editedUser.dob"
                type="date"
                class="form-control"
                :class="{
                  'is-invalid': !isDobValid && isFormSubmitted,
                  'is-valid': isDobValid && isFormSubmitted,
                }"
                required
                :max="currentDate"
              >
              <div
                v-if="!isDobValid && isFormSubmitted"
                class="invalid-feedback"
              >
                Please select a valid date.
              </div>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input
                v-model="editedUser.email"
                type="email"
                class="form-control"
                :class="{
                  'is-invalid': !isEmailValid && isFormSubmitted,
                  'is-valid': isEmailValid && isFormSubmitted,
                }"
                required
              >
              <div
                v-if="!isEmailValid && isFormSubmitted"
                class="invalid-feedback"
              >
                Please enter a valid email.
              </div>
            </div>
            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input
                v-model="editedUser.phone"
                type="tel"
                class="form-control"
                :class="{
                  'is-invalid': !isPhoneValid && isFormSubmitted,
                  'is-valid': isPhoneValid && isFormSubmitted,
                }"
                required
              >
              <div
                v-if="!isPhoneValid && isFormSubmitted"
                class="invalid-feedback"
              >
                Please enter a valid phone number.
              </div>
            </div>
            <button
              type="submit"
              class="btn btn-primary mt-3"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, defineEmits } from "vue";

const emit = defineEmits(["update", "close"]);

const props = defineProps({
  user: Object,
});

const editedUser = ref({ ...props.user });
const isFormSubmitted = ref(false);
const currentDate = new Date().toISOString().split("T")[0];

// Валідація
const isNameValid = computed(() => /^[a-zA-Z\s]+$/.test(editedUser.value.name));
const isDobValid = computed(() => {
  const dob = new Date(editedUser.value.dob);
  return dob <= new Date() && editedUser.value.dob !== "";
});
const isEmailValid = computed(() =>
  /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(editedUser.value.email)
);
const isPhoneValid = computed(() =>
  /^\+?(\d{1,3})?[-. \(\)]?\(?\d{1,4}\)?[-. \(\)]?\d{1,4}[-. \(\)]?\d{1,9}$/.test(
    editedUser.value.phone
  )
);

watch(
  () => props.user,
  (newUser) => {
    editedUser.value = { ...newUser };
  }
);

const submitForm = () => {
  isFormSubmitted.value = true;

  if (
    isNameValid.value &&
    isDobValid.value &&
    isEmailValid.value &&
    isPhoneValid.value
  ) {
    emit("update", editedUser.value);
    emit("close");
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-dialog {
  background-color: white;
  border-radius: 5px;
  max-width: 500px;
  width: 100%;
  padding: 20px;
}

.is-valid {
  border-color: #28a745;
}

.is-invalid {
  border-color: #dc3545;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
