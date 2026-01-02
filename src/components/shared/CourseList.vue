<template>
  <div v-if="loading"><Loader size="18" color="#4f46e5" /></div>

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

  <div
    v-else
    class="text-gray-500 p-5 flex flex-col items-center justify-center"
  >
    <div class="font-bold text-xl">Brak zajęć do wyświetlenia.</div>
    <div class="text-blue-500 text-xs">Zmień filtry aby zobaczyc zajęcia.</div>
  </div>
</template>

<script setup lang="ts">
import CourseCard from "./CourseCard.vue";

defineProps<{
  courses: any[];
  loading: boolean;
  error: string | null;
}>();
</script>
