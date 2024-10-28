<template>
  <form @submit.prevent="submitForm">
    <InputField v-model="newUser.name" label="Name" :isValid="isNameValid" />
    <InputField
      v-model="newUser.dob"
      label="Date of Birth"
      type="date"
      :isValid="isDobValid"
    />
    <InputField
      v-model="newUser.email"
      label="Email"
      type="email"
      :isValid="isEmailValid"
    />
    <InputField
      v-model="newUser.phone"
      label="Phone Number"
      :isValid="isPhoneValid"
    />
    <Button type="submit">Save</Button>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import InputField from './InputField.vue'
import Button from './AppButton.vue'

const newUser = ref({
  name: '',
  dob: '',
  email: '',
  phone: '',
})

const emit = defineEmits(['add-user'])

const isNameValid = computed(() => /^[a-zA-Z\s]+$/.test(newUser.value.name))
const isDobValid = computed(() => {
  const dob = new Date(newUser.value.dob)
  return dob <= new Date() && newUser.value.dob !== ''
})
const isEmailValid = computed(() =>
  /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(newUser.value.email),
)
const isPhoneValid = computed(() =>
  /^\+?(\d{1,3})?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    newUser.value.phone,
  ),
)

const submitForm = () => {
  if (
    isNameValid.value &&
    isDobValid.value &&
    isEmailValid.value &&
    isPhoneValid.value
  ) {
    emit('add-user', { ...newUser.value })
    newUser.value = { name: '', dob: '', email: '', phone: '' }
  }
}
</script>

<style scoped></style>
