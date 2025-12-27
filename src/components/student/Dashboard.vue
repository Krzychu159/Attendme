<template>
  <div class="mx-5">
    <Filters :store="coursesStore" />

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

const { filteredCourses, loading, error } = storeToRefs(coursesStore);
const courses = filteredCourses;

onMounted(async () => {
  if (!auth.token) return;
  await coursesStore.fetchCourses();
});
</script>
