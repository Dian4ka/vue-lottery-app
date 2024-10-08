<template>
  <div class="mb-3">
    <label
      :for="name"
      class="form-label"
    >{{ label }}</label>
    <input
      v-model="localValue"
      :type="type"
      class="form-control"
      :class="{
        'is-invalid': !isValid && isFormSubmitted,
        'is-valid': isValid && localValue && isFormSubmitted,
      }"
      :required="required"
      :placeholder="placeholder"
      @input="handleInput"
    >
    <div
      v-if="!isValid && isFormSubmitted"
      class="invalid-feedback"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: String,
  label: String,
  type: {
    type: String,
    default: "text",
  },
  required: {
    type: Boolean,
    default: true,
  },
  isValid: Boolean,
  isFormSubmitted: Boolean,
  errorMessage: String,
});

const localValue = ref(props.modelValue);

const emit = defineEmits(["update:modelValue"]);

const handleInput = () => {
  emit("update:modelValue", localValue.value);
};

watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue;
  }
);
</script>

<style scoped>
.is-valid {
  border-color: #28a745;
}

.is-invalid {
  border-color: #dc3545;
}
</style>
