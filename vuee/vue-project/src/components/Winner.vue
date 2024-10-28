<template>
  <div class="winner">
    <span>{{ winner.name }}</span>
    <button @click="removeWinner">Remove</button>
  </div>
</template>

<script setup>
const props = defineProps(['winner'])
const emit = defineEmits(['remove-winner'])

const removeWinner = () => {
  emit('remove-winner', winner.email)
}
</script>

<style scoped>
/* Styling for each winner badge */
</style>
