<template>
  <Menu />
  <div class="max-w-[1240px] mx-auto">
    <TeacherDashboard />
  </div>
</template>

<script setup lang="ts">
import TeacherDashboard from "../components/teacher/TeacherDashboard.vue";
import Menu from "../components/shared/Menu.vue";
</script>
