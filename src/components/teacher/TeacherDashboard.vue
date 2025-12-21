<template>
  <div class="mx-10">
    <Filters />
    <div v-if="loading">Ładowanie zajęć...</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>

    <div v-else-if="courses.length" class="space-y-2">
      <div
        v-for="course in courses"
        :key="course.courseSessionId"
        class="flex flex-col gap-2 border rounded-lg p-4 bg-white shadow-sm"
      >
        <div
          class="text-xs w-fit px-3 py-[2px] rounded-xl font-bold uppercase"
          :class="{
            'bg-blue-500 text-white': new Date(course.dateEnd) >= new Date(),
            'bg-gray-200 text-gray-800': new Date(course.dateEnd) < new Date(),
          }"
        >
          {{
            new Date(course.dateStart).toLocaleDateString("pl-PL", {
              weekday: "long",
            })
          }}
          {{
            new Date(course.dateStart).toLocaleTimeString("pl-PL", {
              hour: "2-digit",
              minute: "2-digit",
            })
          }}
          –
          {{
            new Date(course.dateEnd).toLocaleTimeString("pl-PL", {
              hour: "2-digit",
              minute: "2-digit",
            })
          }}
        </div>

        <div class="flex justify-between">
          <h2 class="font-semibold text-lg">{{ course.courseName }}</h2>
          <p class="text-gray-500 text-sm">{{ course.locationName }}</p>
        </div>
        <p class="text-gray-500 text-sm">{{ course.courseGroupName }}</p>
      </div>
    </div>

    <div v-else class="text-gray-500">Brak zajęć do wyświetlenia.</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useTeacherCoursesStore } from "../../store/courses";
import { useAuthStore } from "../../store/auth";
import Filters from "../shared/Filters.vue";

const teacherCoursesStore = useTeacherCoursesStore();
const auth = useAuthStore();
const { courses, loading, error } = storeToRefs(teacherCoursesStore);

onMounted(async () => {
  if (!auth.token) return;
  await teacherCoursesStore.fetchCourses();
});
</script>
