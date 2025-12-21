<template>
  <div v-if="loading">Ładowanie zajęć...</div>

  <div v-else-if="error" class="text-red-600">
    {{ error }}
  </div>

  <div v-else-if="courses.length" class="space-y-2">
    <CourseCard
      v-for="course in courses"
      :key="course.courseSessionId"
      :course="course"
    />
  </div>

  <div v-else class="text-gray-500">Brak zajęć do wyświetlenia.</div>
</template>

<script setup lang="ts">
import CourseCard from "./CourseCard.vue";

defineProps<{
  courses: any[];
  loading: boolean;
  error: string | null;
}>();
</script>
