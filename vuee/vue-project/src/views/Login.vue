<template>
  <form @submit.prevent="submitForm" class="login-form">
    <div class="form-group">
      <label for="email">Email</label>
      <input id="email" v-model="userEmail" type="email" class="input-field" />
      <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        class="input-field"
      />
      <span v-if="errors.password" class="error-msg">{{
        errors.password
      }}</span>
    </div>
    <button type="submit" class="btn-submit">Login</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { required, email as emailRule } from '@vee-validate/rules'
import { defineRule, useForm } from 'vee-validate'

defineRule('required', required)
defineRule('email', emailRule)

const router = useRouter()
const userEmail = ref('')
const password = ref('')
const errors = ref({})

const { handleSubmit } = useForm({
  initialValues: {
    email: '',
    password: '',
  },
  validate: {
    email: value => {
      const isValid = emailRule(value)
      if (!isValid) {
        errors.value.email = 'Email is required and must be valid.'
      } else {
        delete errors.value.email
      }
      return !isValid
    },
    password: value => {
      const isValid = value && value.length >= 6
      if (!isValid) {
        errors.value.password =
          'Password is required and must be at least 6 characters long.'
      } else {
        delete errors.value.password
      }
      return !isValid
    },
  },
})

const submitForm = handleSubmit(values => {
  console.log('Submitted values:', values)
  router.push('/')
})
</script>

<style scoped>
.form-group {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
@media (min-width: 1024px) {
  .login-form {
    min-height: 100vh;
  }
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.error-msg {
  color: red;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

.btn-submit {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-submit:hover {
  background-color: #0056b3;
}

@media (min-width: 1024px) {
  .login-form {
    padding: 40px;
  }
}
</style>
