<template>
  <div class="mb-3">
    <label>{{ label }}</label>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :type="type"
      class="form-control"
      :class="{ 'is-valid': isValid, 'is-invalid': !isValid && modelValue }"
    />
    <div v-if="!isValid && modelValue" class="invalid-feedback">
      Please provide a valid {{ label }}.
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  label: String,
  type: {
    type: String,
    default: 'text',
  },
  isValid: {
    type: Boolean,
    default: true,
  },
})
</script>

<style scoped></style>
