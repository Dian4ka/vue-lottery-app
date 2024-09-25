<template>
  <div class="wrapper container mt-4">
    <div class="winners-panel card mb-4">
      <div class="card-body text-center">
        <h3 class="winners-title">
          Winners
        </h3>
        <button
          class="btn btn-primary mb-2 d-flex justify-content-center mx-auto"
          :disabled="users.length === 0 || winners.length >= 3"
          @click="selectWinner"
        >
          New Winner
        </button>

        <div class="winner-container d-flex flex-wrap justify-content-center">
          <div
            v-for="winner in winners"
            :key="winner.email"
            class="winner-badge badge bg-primary me-2 mb-2"
          >
            {{ winner.name }}
            <button
              class="btn-close btn-close-white ms-2"
              aria-label="Close"
              @click="removeWinner(winner.email)"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="registration-form card mb-4">
      <div class="card-body">
        <h3>Register Form</h3>
        <p class="text-muted spacing">
          Please fill in all the fields.
        </p>
        <form
          novalidate
          @submit.prevent="registerUser"
        >
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
                'is-invalid': !isEmailValid && isFormSubmitted,
                'is-valid': isEmailValid && newUser.email && isFormSubmitted,
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

    <div class="user-list">
      <h3>Participants</h3>
      <div class="participants-table card">
        <div class="card-body">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Date of Birth</th>
                <th>Email</th>
                <th>Phone number</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(user, index) in users"
                :key="user.email"
                class="participant-row"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.dob }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.phone }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const currentDate = new Date().toISOString().split("T")[0];
const users = ref([]);
const winners = ref([]);
const newUser = ref({
  name: "",
  dob: "",
  email: "",
  phone: "",
});

const isNameValid = computed(() => /^[a-zA-Z\s]+$/.test(newUser.value.name));
const isDobValid = computed(() => newUser.value.dob !== "");
const isEmailValid = computed(() =>
  /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(newUser.value.email)
);
const isPhoneValid = computed(() =>
  /^\+?(\d{1,3})?[-. \(\)]?\(?\d{1,4}\)?[-. \(\)]?\d{1,4}[-. \(\)]?\d{1,9}$/.test(
    newUser.value.phone
  )
);

const isFormSubmitted = ref(false);

const registerUser = () => {
  isFormSubmitted.value = true;

  if (
    isNameValid.value &&
    isDobValid.value &&
    isEmailValid.value &&
    isPhoneValid.value
  ) {
    users.value.push({ ...newUser.value });

    newUser.value = { name: "", dob: "", email: "", phone: "" };

    isFormSubmitted.value = false;
  }
};

const selectWinner = () => {
  if (users.value.length === 0 || winners.value.length >= 3) return;

  const eligibleWinners = users.value.filter(
    (user) => !winners.value.some((winner) => winner.email === user.email)
  );

  if (eligibleWinners.length === 0) return;

  const randomIndex = Math.floor(Math.random() * eligibleWinners.length);
  const selectedWinner = eligibleWinners[randomIndex];

  winners.value.push(selectedWinner);
};

const removeWinner = (email) => {
  winners.value = winners.value.filter((winner) => winner.email !== email);
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  padding: 20px;
}

.winner-badge {
  display: inline-block;
  margin: 5px;
  font-size: 18px;
}

.is-valid {
  border-color: #28a745;
}

.is-invalid {
  border-color: #dc3545;
}

.user-list {
  width: 100%;
}

.participant-row {
  border-bottom: 1px solid #0d0101;
}
input.form-control {
  background-color: #f2f2f2;
}
.spacing {
  margin-bottom: 20px;
}
</style>
