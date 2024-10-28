<template>
  <div class="winners-list">
    <h3>Winners</h3>
    <div class="d-flex flex-wrap">
      <div
        v-for="winner in winners"
        :key="winner.email"
        class="badge bg-primary me-2 mb-2"
      >
        {{ winner.name }}
        <button
          class="btn-close btn-close-white ms-2"
          aria-label="Close"
          @click="removeWinner(winner.email)"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['winners'])
const emit = defineEmits(['remove-winner'])

const removeWinner = email => {
  emit('remove-winner', email)
}
</script>

<style scoped>
.badge {
  padding: 10px;
  font-size: 16px;
}
</style>
