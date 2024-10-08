<template>
  <div class="registration-form card mb-4">
    <div class="card-body">
      <h3>Register Form</h3>
      <form
        novalidate
        @submit.prevent="registerUser"
        @keyup="handleKeyUp"
      >
        <p class="text-muted spacing">
          Please fill in all the fields.
        </p>

        <div class="mb-3">
          <label
            for="name"
            class="form-label"
          >Name</label>
          <input
            v-model="newUser.name"
            type="text"
            class="form-control"
            :class="{
              'is-invalid': !isNameValid && isFormSubmitted,
              'is-valid': isNameValid && newUser.name && isFormSubmitted,
            }"
            required
            placeholder="Enter your name"
          >
          <div
            v-if="!isNameValid && isFormSubmitted"
            class="invalid-feedback"
          >
            Please enter a valid name.
          </div>
        </div>

        <div class="mb-3">
          <label
            for="dob"
            class="form-label"
          >Date of Birth</label>
          <input
            v-model="newUser.dob"
            type="date"
            class="form-control"
            :class="{
              'is-invalid': !isDobValid && isFormSubmitted,
              'is-valid': isDobValid && newUser.dob && isFormSubmitted,
            }"
            required
            :max="currentDate"
            placeholder="Select your date of birth"
          >
          <div
            v-if="!isDobValid && isFormSubmitted"
            class="invalid-feedback"
          >
            Please select a valid date.
          </div>
        </div>

        <div class="mb-3">
          <label
            for="email"
            class="form-label"
          >Email</label>
          <input
            v-model="newUser.email"
            type="email"
            class="form-control"
            :class="{
              'is-invalid': (!isEmailValid && isFormSubmitted) || emailError,
              'is-valid':
                isEmailValid && newUser.email && isFormSubmitted && !emailError,
            }"
            required
            placeholder="Enter your email"
          >
          <div
            v-if="!isEmailValid && isFormSubmitted"
            class="invalid-feedback"
          >
            Please enter a valid email.
          </div>
          <div
            v-if="emailError"
            class="invalid-feedback"
          >
            {{ emailError }}
          </div>
        </div>

        <div class="mb-3">
          <label
            for="phone"
            class="form-label"
          >Phone Number</label>
          <input
            v-model="newUser.phone"
            type="tel"
            class="form-control"
            :class="{
              'is-invalid': !isPhoneValid && isFormSubmitted,
              'is-valid': isPhoneValid && newUser.phone && isFormSubmitted,
            }"
            required
            placeholder="Enter your phone number"
          >
          <div
            v-if="!isPhoneValid && isFormSubmitted"
            class="invalid-feedback"
          >
            Please enter a valid phone number.
          </div>
        </div>

        <div class="mb-3 text-center">
          <button
            type="submit"
            class="btn btn-success mx-auto"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const users = ref([]);

const props = defineProps({
  users: Array,
});
const emit = defineEmits(["user-registered"]);

const currentDate = new Date().toISOString().split("T")[0];
const newUser = ref({
  name: "",
  dob: "",
  email: "",
  phone: "",
});
const emailError = ref("");
const isFormSubmitted = ref(false);

// Перевірки валідності
const isNameValid = computed(() => /^[a-zA-Z\s]+$/.test(newUser.value.name));
const isDobValid = computed(() => {
  const dob = new Date(newUser.value.dob);
  return dob <= new Date() && newUser.value.dob !== "";
});
const isEmailValid = computed(() =>
  /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(newUser.value.email)
);
const isPhoneValid = computed(() =>
  /^\+?(\d{1,3})?[-. \(\)]?\(?\d{1,4}\)?[-. \(\)]?\d{1,4}[-. \(\)]?\d{1,9}$/.test(
    newUser.value.phone
  )
);

watch(props.users, (newVal) => {
  users.value = newVal || [];
});

const registerUser = () => {
  isFormSubmitted.value = true;
  emailError.value = "";

  const emailExists = users.value.some(
    (user) => user.email === newUser.value.email
  );

  if (emailExists) {
    emailError.value = "User with this email already exists.";
    return;
  }

  if (
    isNameValid.value &&
    isDobValid.value &&
    isEmailValid.value &&
    isPhoneValid.value
  ) {
    const userId = Date.now().toString();
    const userToRegister = { ...newUser.value, id: userId };

    users.value.push(userToRegister);

    emit("user-registered", userToRegister);

    newUser.value = { name: "", dob: "", email: "", phone: "" };
    isFormSubmitted.value = false;
  }
};

const handleKeyUp = (event) => {
  if (event.key === "Enter") {
    registerUser();
  }
};
</script>

<style scoped>
.is-valid {
  border-color: #28a745;
}

.is-invalid {
  border-color: #dc3545;
}

.spacing {
  margin-bottom: 20px;
}
</style>
