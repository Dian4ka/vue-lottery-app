<template>
  <div class="mb-3">
    <input
      type="text"
      class="form-control"
      placeholder="Search by name..."
      @input="onInput"
    />
  </div>
</template>

<script setup>
const emit = defineEmits(['filter-by-name'])

const onInput = event => {
  emit('filter-by-name', event.target.value)
}
</script>

<style scoped>
input {
  margin-bottom: 10px;
}
</style>
