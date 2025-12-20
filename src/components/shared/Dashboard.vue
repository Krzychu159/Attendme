<template>
  <div
    class="flex flex-col bg-gray-100 p-4 rounded-lg gap-4 mt-5 border border-gray-300"
  >
    <h2>Filtry</h2>
    <div class="flex justify-between">
      <select>
        <option value="">Bieżacy miesiąc</option>
        <option value="">Bieżacy tydzień</option>
        <option value="">Bieżacy rok</option>
      </select>
      <input type="text" placeholder="Przedmiot, lokalizacja" />
    </div>
  </div>
  <div v-if="courses.length" class="space-y-4 mt-8">
    <div
      v-for="course in courses"
      :key="course.sessionId || course.id"
      class="border rounded p-4 bg-gray-50 shadow-sm"
    >
      <h2 class="font-semibold text-lg">
        {{ course.courseName || "Brak nazwy kursu" }}
      </h2>
      <p class="text-gray-700">Prowadzący: {{ course.teacherName || "—" }}</p>
      <p class="text-gray-600 text-sm">Data: {{ course.date || "—" }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useCoursesStore } from "../../store/courses";
import { useAuthStore } from "../../store/auth";

const coursesStore = useCoursesStore();
const auth = useAuthStore();

onMounted(async () => {
  if (!auth.token) {
    console.warn("Brak tokena – użytkownik niezalogowany");
    return;
  }
  await new Promise((r) => setTimeout(r, 100)); //
  await coursesStore.fetchCourses();
});

const { courses, loading, error } = coursesStore;
</script>
