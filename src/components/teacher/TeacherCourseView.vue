<template>
  <div v-if="loading">Ładowanie...</div>

  <div v-else-if="error" class="text-red-500">
    {{ error }}
  </div>

  <div v-else-if="session">
    <div class="md:flex justify-between">
      <div>
        <h1 class="text-xl font-bold mb-3">
          {{ session.courseName }}
        </h1>

        <div class="flex flex-col gap-3 mb-10">
          <p><b>Termin</b> {{ formattedDate }}</p>
          <p>
            <b>Godziny</b>
            {{ formattedStartTime }} – {{ formattedEndTime }}
          </p>
          <p><b>Lokalizacja</b> {{ session.locationName }}</p>
        </div>
      </div>
      <div class="flex flex-col gap-5 mb-8 md:mb-0">
        <button class="bg-blue-500 border-blue-500 text-white">
          Skaner obecności
        </button>
        <button>Rejestracja urządzenia</button>
      </div>
    </div>

    <h2 class="font-semibold mb-2">Lista studentów</h2>

    <table class="w-full border text-sm">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 text-left">Student</th>
          <th class="p-2 text-left">Album</th>
          <th class="p-2 text-left">Obecność</th>
          <th class="p-2 text-left">Akcja</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="s in students" :key="s.attenderUserId" class="border-t">
          <td class="p-2">{{ s.userName }} {{ s.userSurname }}</td>
          <td class="p-2">
            {{ s.studentAlbumIdNumber }}
          </td>
          <td class="p-2">
            <span :class="s.wasUserPresent ? 'text-green-600' : 'text-red-600'">
              {{ s.wasUserPresent ? "Obecny" : "Nieobecny" }}
            </span>
          </td>
          <td>
            <button
              class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded"
              v-if="s.wasUserPresent"
            >
              Odznacz obecność
            </button>
            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
              v-else
            >
              Zaznacz obecność
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-else class="text-gray-500">Brak danych sesji.</div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCourseSessionStore } from "@/store/courseSession";
import { useTeacherCoursesStore } from "@/store/courses";

const props = defineProps<{
  sessionId: number;
  groupId: number;
}>();

const store = useCourseSessionStore();
const { session, students, loading, error } = storeToRefs(store);

const teacherCoursesStore = useTeacherCoursesStore();
const didPrefetch = ref(false);

watch(
  () => props.sessionId,
  async (id) => {
    if (!id || Number.isNaN(id)) return;

    if (!teacherCoursesStore.courses.length && !didPrefetch.value) {
      didPrefetch.value = true;
      await teacherCoursesStore.fetchCourses();
    }

    store.setSessionFromTeacherCourses(id, props.groupId);
    store.fetchAttendanceList(id);
  },
  { immediate: true }
);

const formattedDate = computed(() =>
  session.value
    ? new Date(session.value.dateStart).toLocaleDateString("pl-PL")
    : ""
);

const formattedStartTime = computed(() =>
  session.value
    ? new Date(session.value.dateStart).toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : ""
);

const formattedEndTime = computed(() =>
  session.value
    ? new Date(session.value.dateEnd).toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : ""
);
</script>
