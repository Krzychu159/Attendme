<template>
  <div class="mx-5">
    <Filters />

    <CourseList :courses="courses" :loading="loading" :error="error" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useTeacherCoursesStore } from "../../store/courses";
import { useAuthStore } from "../../store/auth";
import Filters from "../shared/Filters.vue";
import CourseList from "../shared/CourseList.vue";

const teacherCoursesStore = useTeacherCoursesStore();
const auth = useAuthStore();
const { courses, loading, error } = storeToRefs(teacherCoursesStore);

onMounted(async () => {
  if (!auth.token) return;
  await teacherCoursesStore.fetchCourses();
});
</script>
