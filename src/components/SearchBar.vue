<template>
  <div>
    <input
      v-model="query"
      type="text"
      placeholder="Search by name..."
      class="form-control mb-3"
      @input="filter"
    >
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";

const emit = defineEmits(["filter-by-name"]);
const query = ref("");

const filter = () => {
  emit("filter-by-name", query.value);
};
</script>
