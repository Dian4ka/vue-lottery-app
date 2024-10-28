<script setup>
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <main>
    <div class="welcome">
      <TheWelcome />
    </div>
  </main>
</template>

<style scoped>
@media (min-width: 1060px) {
  .welcome {
    min-height: 100vh;
  }
}
</style>
