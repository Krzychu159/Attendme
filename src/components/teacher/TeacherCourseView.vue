<script setup lang="ts">
defineProps<{
  sessionId: number;
  groupId: number;
}>();
</script>

<template>
  <div>
    <h1 class="text-xl font-bold">Kurs – widok nauczyciela</h1>

    <p>Session: {{ sessionId }}</p>
    <p>Group: {{ groupId }}</p>
  </div>
</template>
