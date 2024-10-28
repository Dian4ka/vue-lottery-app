<template>
  <div class="user_det">
    <h2>User Details</h2>
    <div v-if="user">
      <p><strong>Name:</strong> {{ user.name }}</p>
      <p><strong>Date of Birth:</strong> {{ user.dob }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Phone:</strong> {{ user.phone }}</p>
      <router-link to="/">Back to Users</router-link>
    </div>
    <div v-else>
      <p>Loading user details...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const user = ref(null)

const fetchUser = async id => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${id}`,
    )
    user.value = await response.json()
  } catch (error) {
    console.error('Error fetching user:', error)
  }
}

onMounted(() => {
  const userId = route.params.id
  fetchUser(userId)
})
</script>

<style scoped>
@media (min-width: 1024px) {
  .user_det {
    min-height: 100vh;
  }
}
</style>
