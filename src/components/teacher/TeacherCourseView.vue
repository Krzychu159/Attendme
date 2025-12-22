<template>
  <div v-if="loading">Ładowanie...</div>

  <div v-else-if="error" class="text-red-500">
    {{ error }}
  </div>

  <div v-else-if="session">
    <h1 class="text-xl font-bold mb-4">
      {{ session.courseName }}
    </h1>

    <p class="mb-4">
      {{ formattedDate }} | {{ formattedStartTime }} – {{ formattedEndTime }} |
      {{ session.locationName }}
    </p>

    <h2 class="font-semibold mb-2">Lista studentów</h2>

    <table class="w-full border text-sm">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 text-left">Student</th>
          <th class="p-2 text-left">Album</th>
          <th class="p-2 text-left">Obecność</th>
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
        </tr>
      </tbody>
    </table>
  </div>

  <div v-else class="text-gray-500">Brak danych sesji.</div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCourseSessionStore } from "@/store/courseSession";

const props = defineProps<{
  sessionId: number;
  groupId: number;
}>();

const store = useCourseSessionStore();
const { session, students, loading, error } = storeToRefs(store);

// 🔥 STABILNIE: reagujemy na sessionId
watch(
  () => props.sessionId,
  (id) => {
    if (!id || Number.isNaN(id)) return;

    // 1️⃣ dane sesji z listy nauczyciela
    store.setSessionFromTeacherCourses(id, props.groupId);

    // 2️⃣ lista obecności z backendu
    store.fetchAttendanceList(id);
  },
  { immediate: true }
);

// ---- FORMATOWANIE ----
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
