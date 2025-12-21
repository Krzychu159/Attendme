<template>
  <div class="mx-10">
    <Filters />

    <CourseList :courses="courses" :loading="loading" :error="error" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useCoursesStore } from "../../store/courses";
import { useAuthStore } from "../../store/auth";
import Filters from "../shared/Filters.vue";
import CourseList from "../shared/CourseList.vue";

const coursesStore = useCoursesStore();
const auth = useAuthStore();

const { courses, loading, error } = storeToRefs(coursesStore);

onMounted(async () => {
  if (!auth.token) return;
  await coursesStore.fetchCourses();
});
</script>
