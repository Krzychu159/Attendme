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
        <button
          class="bg-blue-500 border-blue-500 text-white"
          @click="openScanner = !openScanner"
        >
          Skaner obecności
        </button>
        <button @click="openRegister = !openRegister">
          Rejestracja urządzenia
        </button>
      </div>
    </div>

    <!-- OVERLAY -->
    <div
      v-if="openRegister || openScanner"
      class="fixed inset-0 z-40 bg-black/40"
      @click.self="
        openRegister = false;
        openScanner = false;
      "
    >
      <!-- REGISTER -->
      <div
        v-if="openRegister"
        class="absolute top-8 left-1/2 -translate-x-1/2 bg-white border p-4 rounded shadow-lg"
      >
        <div class="flex justify-between items-center border-b pb-2 mb-5">
          <div class="font-bold">Rejestracja urządzenia</div>
          <div
            class="cursor-pointer text-2xl"
            @click.self="
              openRegister = false;
              openScanner = false;
            "
          >
            &times;
          </div>
        </div>

        <table class="w-full border text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-2 text-left">Student</th>
              <th class="p-2 text-left">Album</th>
              <th class="p-2 text-left">Urządzenie</th>
              <th class="p-2 text-left">Link Rejestracyjny</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="s in students"
              :key="s.attenderUserId"
              class="border-t even:bg-gray-50 odd:bg-white"
            >
              <td class="p-2">{{ s.userName }} {{ s.userSurname }}</td>
              <td class="p-2">
                {{ s.studentAlbumIdNumber }}
              </td>
              <td class="p-2">
                <div>brak</div>
              </td>
              <td class="p-2">
                <button class="bg-blue-500 border-blue-500 text-white">
                  Skopiuj Link
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- SCANNER -->
      <div
        v-if="openScanner"
        class="absolute top-40 left-1/2 -translate-x-1/2 bg-white border p-4 rounded shadow-lg flex flex-col gap-4"
      >
        <div class="flex justify-between items-center border-b pb-2">
          <div class="font-bold">Skaner obescności</div>
          <div
            class="cursor-pointer text-2xl"
            @click.self="
              openRegister = false;
              openScanner = false;
            "
          >
            &times;
          </div>
        </div>
        <div>
          Do sprawdzania obecności wymagane jest urządzenie wyposażone w kamerę
          (tablet lub telefon). Zeskanuj na nim poniższy kod QR lub otwórz adres
          url, który możesz skopiować poniższym przyciskiem. Sprawdzenie
          obecności polega na umieszczeniu w polu widzenia kamery skanera kodu
          QR wygnerowanego na ekranie telefonu uczestnika.
        </div>
        <div>Kod QR</div>
        <button class="bg-blue-500 border-blue-500 text-white">
          Skopiuj Link
        </button>
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
        <tr
          v-for="s in students"
          :key="s.attenderUserId"
          class="border-t even:bg-gray-50 odd:bg-white"
        >
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
              @click="
                toogleAttendance(
                  s.attenderUserId,
                  session.courseSessionId,
                  false
                )
              "
            >
              Odznacz obecność
            </button>
            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
              v-else
              @click="
                toogleAttendance(
                  s.attenderUserId,
                  session.courseSessionId,
                  true
                )
              "
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

const openRegister = ref(false);
const openScanner = ref(false);

const toogleAttendance = (
  studentId: number,
  courseSessionId: number,
  addOrRemove: boolean
) => {
  store.toogleAttendance(studentId, courseSessionId, addOrRemove);
};

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
