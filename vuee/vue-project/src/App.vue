<template>
  <div id="app">
    <AppHeader />
    <div v-if="isAuthenticated">
      <button @click="logout">Logout</button>
    </div>
    <div class="container mt-5">
      <router-view></router-view>
      <WinnerList :winners="winners" @remove-winner="removeWinner" />
      <RegisterForm @add-user="addUser" />
      <SearchBar @filter-by-name="filterUsers" />
      <ParticipantsTable
        :users="users"
        @edit-user="openEditModal"
        @delete-user="openDeleteModal"
        @sort="sortUsers"
      />
      <div v-if="isAuthenticated">
        <button @click="logout">Logout</button>
      </div>
      <div class="text-center my-3">
        <button
          class="btn btn-primary"
          :disabled="users.length === 0 || winners.length >= 3"
          @click="selectWinner"
        >
          New winner
        </button>
      </div>
    </div>
    <Modal v-if="isEditModalOpen" @close="closeEditModal">
      <h3>Edit Participant</h3>
      <form @submit.prevent="updateUser" @keydown.enter="updateUser">
        <InputField v-model="editingUser.name" label="Name" />
        <InputField
          v-model="editingUser.dob"
          label="Date of Birth"
          type="date"
        />
        <InputField v-model="editingUser.email" label="Email" type="email" />
        <InputField v-model="editingUser.phone" label="Phone Number" />
        <AppButton type="submit" @click="updateUser">Update User</AppButton>
      </form>
    </Modal>
    <Modal v-if="isDeleteModalOpen" @close="closeDeleteModal">
      <h3>Delete Participant</h3>
      <p>Are you sure you want to delete {{ deletingUser.email }}?</p>
      <AppButton @click="deleteUser">Yes</AppButton>
      <AppButton @click="closeDeleteModal">No</AppButton>
    </Modal>
    <AlertModal
      v-if="isAlertModalOpen"
      :title="alertTitle"
      :message="alertMessage"
      @close="isAlertModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import AlertModal from './components/AlertModal.vue'
import WinnerList from './components/WinnerList.vue'
import RegisterForm from './components/RegisterForm.vue'
import SearchBar from './components/SearchBar.vue'
import ParticipantsTable from './components/ParticipantsTable.vue'
import InputField from './components/InputField.vue'
import Modal from './components/Modal.vue'
import AppButton from './components/AppButton.vue'
import AppHeader from './components/AppHeader.vue'
import { onMounted } from 'vue'

onMounted(() => {
  fetchUsers()
})
const isAuthenticated = ref(!!localStorage.getItem('token'))

const logout = () => {
  localStorage.removeItem('token')
  isAuthenticated.value = false
  window.location.href = '/login'
}
const users = ref(JSON.parse(localStorage.getItem('users')) || [])
const winners = ref([])
const editingUser = ref(null)
const deletingUser = ref(null)
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isAlertModalOpen = ref(false)
const alertTitle = ref('')
const alertMessage = ref('')

const addUser = user => {
  if (users.value.some(u => u.email === user.email)) {
    showAlert('Error', 'User with this email already exists!')
    return
  }
  users.value.push({ ...user, id: Math.random().toString(36).substr(2, 9) })
  localStorage.setItem('users', JSON.stringify(users.value))
}
const showAlert = (title, message) => {
  alertTitle.value = title
  alertMessage.value = message
  isAlertModalOpen.value = true
}
const fetchUsers = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await response.json()
    users.value = data.map(user => ({
      name: user.name,
      dob: user.dob,
      email: user.email,
      phone: user.phone,
      id: user.id,
    }))
    localStorage.setItem('users', JSON.stringify(users.value))
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const filterUsers = name => {
  if (!name) {
    users.value = JSON.parse(localStorage.getItem('users')) || []
    return
  }
  users.value = users.value.filter(user =>
    user.name.toLowerCase().includes(name.toLowerCase()),
  )
}

const resetForm = () => {
  newUser.value = { name: '', dob: '', email: '', phone: '' }
}

const selectWinner = () => {
  if (users.value.length === 0 || winners.value.length >= 3) return

  const availableUsers = users.value.filter(
    u => !winners.value.some(winner => winner.email === u.email),
  )

  if (availableUsers.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableUsers.length)
    winners.value.push(availableUsers[randomIndex])
  }
}

const sortUsers = ({ criteria, direction }) => {
  users.value.sort((a, b) => {
    let result = 0
    if (criteria === 'name') {
      result = a.name.localeCompare(b.name)
    } else if (criteria === 'dob') {
      result = new Date(a.dob) - new Date(b.dob)
    }
    return direction === 'asc' ? result : -result
  })
}

const removeWinner = email => {
  winners.value = winners.value.filter(winner => winner.email !== email)
  localStorage.setItem('winners', JSON.stringify(winners.value))
}

const openEditModal = user => {
  editingUser.value = { ...user }
  isEditModalOpen.value = true
}
const closeEditModal = () => {
  isEditModalOpen.value = false
}

const openDeleteModal = user => {
  deletingUser.value = { ...user }
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
}

const updateUser = () => {
  const index = users.value.findIndex(u => u.id === editingUser.value.id)
  if (
    users.value.some(
      u => u.email === editingUser.value.email && u.id !== editingUser.value.id,
    )
  ) {
    showAlert('Error', 'User with this email already exists!')
    return
  }
  users.value[index] = { ...editingUser.value }
  localStorage.setItem('users', JSON.stringify(users.value))
  closeEditModal()
}

const deleteUser = () => {
  users.value = users.value.filter(u => u.id !== deletingUser.value.id)
  localStorage.setItem('users', JSON.stringify(users.value))
  closeDeleteModal()
}
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.main-content {
  display: flex;
  flex-direction: column;
}

.logout-btn {
  text-align: right;
  margin: 10px;
}
</style>
