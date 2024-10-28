<template>
  <table class="table table-striped">
    <thead>
      <tr>
        <th>#</th>
        <th @click="sortByColumn('name')" style="cursor: pointer">
          Name
          <span>{{ sortBy === 'name' ? sortDirectionEmoji : '' }}</span>
        </th>
        <th @click="sortByColumn('dob')" style="cursor: pointer">
          Date of Birth
          <span>{{ sortBy === 'dob' ? sortDirectionEmoji : '' }}</span>
        </th>
        <th>Email</th>
        <th>Phone number</th>
        <th>Edit</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(user, index) in users" :key="user.email">
        <td>{{ index + 1 }}</td>
        <td>
          <router-link :to="`/users/${user.id}`">{{ user.name }}</router-link>
        </td>

        <td>{{ user.dob }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.phone }}</td>
        <td>
          <button class="btn btn-primary" @click="editUser(user)">Edit</button>
        </td>
        <td>
          <button class="btn btn-danger" @click="deleteUser(user)">
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps(['users'])
const emit = defineEmits(['edit-user', 'delete-user', 'sort'])

// Track the current sorting state
const sortBy = ref('') // This will hold the current sorted column ('name' or 'dob')
const sortDirection = ref('asc') // This will toggle between 'asc' and 'desc'

// Computed property to determine the correct emoji to display based on sort direction
const sortDirectionEmoji = computed(() => {
  return sortDirection.value === 'asc' ? '⬆️' : '⬇️'
})

// Function to sort the column and toggle the sorting direction
const sortByColumn = criteria => {
  if (sortBy.value === criteria) {
    // If already sorting by the same column, toggle the direction
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    // If sorting by a new column, set the new column and reset to ascending
    sortBy.value = criteria
    sortDirection.value = 'asc' // Default to ascending for a new column
  }

  // Emit the sort event to the parent component with the sorting criteria and direction
  emit('sort', { criteria, direction: sortDirection.value })
}

const editUser = user => {
  emit('edit-user', user)
}

const deleteUser = user => {
  emit('delete-user', user)
}
</script>

<style scoped>
/* Styling for the sorting arrow emoji */
span {
  margin-left: 5px;
}
</style>
