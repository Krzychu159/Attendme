<template>
  <div v-if="loading">Ładowanie kursów...</div>
  <div v-else-if="error" class="text-red-600">{{ error }}</div>

  <div v-else-if="courses.length" class="space-y-2">
    <div
      v-for="course in courses"
      :key="course.courseSessionId"
      class="flex flex-col gap-2 border rounded-lg p-4 bg-white shadow-sm"
    >
      <div
        class="text-gray-600 bg-gray-300 text-xs w-fit px-3 py-[2px] rounded-xl font-bold uppercase"
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
        }}–
        {{
          new Date(course.dateEnd).toLocaleTimeString("pl-PL", {
            hour: "2-digit",
            minute: "2-digit",
          })
        }}
      </div>

      <div class="flex justify-between">
        <h2 class="font-semibold text-lg">
          {{ course.courseName }}
        </h2>

        <p class="text-gray-500 text-sm">{{ course.locationName }}</p>
      </div>
      <div class="text-gray-500 text-sm">
        {{ new Date(course.dateStart).toLocaleDateString("sv-SE") }}
      </div>
    </div>
  </div>

  <div v-else class="text-gray-500">Brak kursów do wyświetlenia.</div>
</template>
<script setup lang="ts">
interface Course {
  courseSessionId: number;
  courseName: string;
  courseGroupName: string;
  locationName: string;
  dateStart: string;
  dateEnd: string;
}
const props = defineProps<{
  courses: Course[];
  loading: boolean;
  error: string | null;
}>();
</script>
