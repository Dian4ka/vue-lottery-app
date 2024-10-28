<!-- src/components/AppHeader.vue -->
<template>
  <header>
    <h1>My Application</h1>
    <AppNavigation />
  </header>
</template>

<script>
import AppNavigation from './AppNavigation.vue'

export default {
  name: 'AppHeader',
  components: {
    AppNavigation,
  },
}
</script>

<style scoped>
header {
  background-color: #f8f9fa;
  padding: 1rem;
  text-align: center;
}
</style>
