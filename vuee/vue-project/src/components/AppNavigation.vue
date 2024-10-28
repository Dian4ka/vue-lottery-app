<!-- src/components/AppNavigation.vue -->
<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-link to="/lottery">Lottery</router-link>
    <router-link to="/login">Login</router-link>
  </nav>
</template>

<script>
export default {
  name: 'AppNavigation',
}
</script>

<style scoped>
nav {
  margin: 1rem 0;
}
nav a {
  margin: 0 1rem;
  text-decoration: none;
}
</style>
