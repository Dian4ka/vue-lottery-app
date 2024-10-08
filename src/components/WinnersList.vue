<template>
  <div class="winners-panel card mb-4">
    <div class="card-body text-center">
      <h3 class="winners-title">
        Winners
      </h3>
      <button
        class="btn btn-primary mb-2 d-flex justify-content-center mx-auto"
        :disabled="users.length === 0 || winners.length >= 3"
        @click="selectWinner"
      >
        New Winner
      </button>
      <div class="winner-container d-flex flex-wrap justify-content-center">
        <div
          v-for="winner in winners"
          :key="winner.id"
          class="winner-badge badge bg-primary me-2 mb-2"
        >
          {{ winner.name }}
          <button
            class="btn-close btn-close-white ms-2"
            aria-label="Close"
            @click="removeWinner(winner.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  users: Array,
  winners: Array,
});

const emit = defineEmits(["select-winner", "remove-winner"]);

const selectWinner = () => {
  emit("select-winner");
};

const removeWinner = (id) => {
  emit("remove-winner", id);
};
</script>

<style scoped>
.winner-badge {
  display: inline-block;
  margin: 5px;
  font-size: 18px;
}
</style>
