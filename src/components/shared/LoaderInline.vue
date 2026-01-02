<template>
  <span class="loader" :style="style" aria-label="Loading" />
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  size?: number;
  color?: string;
}>();

const style = computed(() => ({
  width: `${props.size ?? 16}px`,
  height: `${props.size ?? 16}px`,
  borderColor: props.color ?? "currentColor",
}));
</script>

<style scoped>
.loader {
  display: inline-block;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
