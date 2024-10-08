<template>
  <div
    class="wrapper container mt-4"
    @keyup="handleKeyUp"
  >
    <WinnersList
      :users="users"
      :winners="winners"
      @select-winner="selectWinner"
      @remove-winner="removeWinner"
    />

    <SearchBar @filter-by-name="handleFilterByName" />

    <RegisterForm />
    <div class="registration-form card mb-4">
      <div class="card-body">
        <h3>Register Form</h3>
        <form
          novalidate
          @submit.prevent="registerUser"
          @keyup="handleKeyUp"
        />
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
                'is-invalid': (!isEmailValid && isFormSubmitted) || emailError,
                'is-valid':
                  isEmailValid &&
                  newUser.email &&
                  isFormSubmitted &&
                  !emailError,
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
          <div
            v-if="emailError"
            class="mb-3 text-danger"
          >
            {{ emailError }}
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
                <th>ID</th>
                <th>
                  Name
                  <button
                    class="btn btn-link"
                    @click="sortByName"
                  >
                    <i
                      :class="
                        sortOrder.name === 1
                          ? 'bi bi-sort-alpha-down'
                          : 'bi bi-sort-alpha-up'
                      "
                    />
                  </button>
                </th>
                <th>
                  Date of Birth
                  <button
                    class="btn btn-link"
                    @click="sortByDob"
                  >
                    <i
                      :class="
                        sortOrder.dob === 1
                          ? 'bi bi-sort-down'
                          : 'bi bi-sort-up'
                      "
                    />
                  </button>
                </th>

                <th>Email</th>
                <th>Phone number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(user, index) in sortedUsers"
                :key="user.id"
                class="participant-row"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.dob }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.phone }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-warning me-2"
                    @click="openEditModal(user)"
                  >
                    Edit
                  </button>
                  <button
                    class="btn btn-sm btn-danger"
                    @click="openDeleteModal(user)"
                  >
                    Видалити
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <EditModal
      v-if="isModalOpen"
      :user="selectedUser"
      @close="isModalOpen = false"
      @update="updateUser"
    />
    <DeleteModal
      v-if="isDeleteModalOpen"
      :participant-to-delete="participantToDelete"
      @close="isDeleteModalOpen = false"
      @delete="deleteParticipant"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import EditModal from "./EditModal.vue";
import DeleteModal from "./DeleteModal.vue";
import SearchBar from "./SearchBar.vue";
import WinnersList from "./WinnersList.vue";

const props = defineProps({
  user: Object,
});

const isDeleteModalOpen = ref(false);
const participantToDelete = ref(null);
const editedUser = ref({ ...props.user });
const selectedUser = ref(null);
const isModalOpen = ref(false);
const currentDate = new Date().toISOString().split("T")[0];
const users = ref([]);
const winners = ref([]);
const newUser = ref({
  name: "",
  dob: "",
  email: "",
  phone: "",
});

const query = ref("");
const emailError = ref("");
const isFormSubmitted = ref(false);

const filteredUsers = computed(() => {
  return users.value.filter((user) =>
    user.name.toLowerCase().includes(query.value.toLowerCase())
  );
});

const handleFilterByName = (searchQuery) => {
  query.value = searchQuery;
};

const submitForm = () => {
  if (
    editedUser.value.name &&
    editedUser.value.dob &&
    editedUser.value.email &&
    editedUser.value.phone
  ) {
    emit("update", editedUser.value);
    emit("close");
  }
};

const openEditModal = (user) => {
  selectedUser.value = user;
  isModalOpen.value = true;
};

const updateUser = (updatedUser) => {
  const index = users.value.findIndex((user) => user.id === updatedUser.id);
  if (index !== -1) {
    users.value[index] = { ...updatedUser };
    saveUsersToLocalStorage();
    isModalOpen.value = false;
  }
};

const emit = defineEmits(["update", "close"]);

const openDeleteModal = (user) => {
  participantToDelete.value = user;
  isDeleteModalOpen.value = true;
  console.log("delete");
};

const deleteParticipant = () => {
  if (participantToDelete.value) {
    const index = users.value.findIndex(
      (user) => user.id === participantToDelete.value.id
    );
    if (index !== -1) {
      users.value.splice(index, 1);
      saveUsersToLocalStorage();
      isDeleteModalOpen.value = false;
      participantToDelete.value = null;
    }
  }
};

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

const saveUsersToLocalStorage = () => {
  localStorage.setItem("users", JSON.stringify(users.value));
};

const loadUsersFromLocalStorage = () => {
  const storedUsers = localStorage.getItem("users");
  if (storedUsers) {
    users.value = JSON.parse(storedUsers);
  }
};

const registerUser = () => {
  isFormSubmitted.value = true;
  emailError.value = "";

  const emailExists = users.value.some(
    (user) => user.email === newUser.value.email
  );
  if (emailExists) {
    emailError.value = "Учасник з такою електронною поштою вже існує.";
    return;
  }
  if (
    isNameValid.value &&
    isDobValid.value &&
    isEmailValid.value &&
    isPhoneValid.value
  ) {
    const userId = Date.now().toString();
    users.value.push({ ...newUser.value, id: userId });

    newUser.value = { name: "", dob: "", email: "", phone: "" };

    saveUsersToLocalStorage();

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

const removeWinner = (id) => {
  winners.value = winners.value.filter((winner) => winner.id !== id);
};
const handleKeyUp = (event) => {
  if (event.key === "Enter") {
    registerUser();
  } else if (event.key === "Escape") {
    isModalOpen.value = false;
    isDeleteModalOpen.value = false;
  }
};
const sortOrder = ref({
  name: 1,
  dob: 1,
});
const sortedUsers = computed(() => {
  const usersCopy = [...filteredUsers.value];

  usersCopy.sort((a, b) => {
    if (sortOrder.value.name !== 0) {
      const nameComparison =
        sortOrder.value.name === 1
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);

      if (nameComparison !== 0) return nameComparison;
    }

    if (sortOrder.value.dob !== 0) {
      return sortOrder.value.dob === 1
        ? new Date(a.dob) - new Date(b.dob)
        : new Date(b.dob) - new Date(a.dob);
    }

    return 0;
  });

  return usersCopy;
});

const sortByName = () => {
  sortOrder.value.name *= -1;

  sortOrder.value.dob = 0;
};

const sortByDob = () => {
  sortOrder.value.dob *= -1;
  sortOrder.value.name = 0;
};

onMounted(() => {
  const storedUsers = localStorage.getItem("users");
  if (storedUsers) {
    users.value = JSON.parse(storedUsers);
  }
});
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
.btn-link {
  color: inherit;
  text-decoration: none;
}

.btn-link:hover {
  color: #007bff;
}
</style>
