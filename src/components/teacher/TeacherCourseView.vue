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
        <button @click="refreshPage">Odśwież</button>
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
        class="absolute top-8 left-1/2 -translate-x-1/2 bg-white border p-4 rounded shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto"
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
                {{ userStore.userInfos[s.attenderUserId]?.deviceName || "---" }}
                <div v-if="userStore.userInfos[s.attenderUserId]?.deviceName">
                  <div
                    class="text-red-500 hover:underline cursor-pointer"
                    @click="resetDevice(s.attenderUserId)"
                  >
                    Delete
                  </div>
                </div>
              </td>

              <td class="p-2">
                <button
                  class="bg-blue-500 border-blue-500 text-white"
                  @click="copyDeviceLink(s)"
                >
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
        class="absolute top-20 left-1/2 -translate-x-1/2 bg-white border p-4 rounded shadow-lg flex flex-col"
      >
        <div class="flex justify-between items-center border-b pb-2">
          <div class="font-bold">Skaner obecności</div>
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

        <div class="my-4 text-gray-700">
          <p>
            Do sprawdzania obecności wymagane jest urządzenie wyposażone w
            kamerę (tablet lub telefon). Zeskanuj na nim poniższy kod QR lub
            otwórz adres url, który możesz skopiować poniższym przyciskiem.
            Sprawdzenie obecności polega na umieszczeniu w polu widzenia kamery
            skanera kodu QR wygnerowanego na ekranie telefonu uczestnika.
          </p>
        </div>

        <div class="flex flex-col items-center gap-4">
          <div v-if="store.loading">Generowanie kodu QR...</div>
          <div v-else-if="store.error" class="text-red-600">
            {{ store.error }}
          </div>
          <img
            v-else-if="store.qrUrl"
            :src="store.qrUrl"
            alt="Kod QR"
            class="w-64 h-64"
          />
          <button
            v-if="store.url"
            class="bg-blue-500 text-white px-4 py-2 rounded"
            @click="copyLink"
          >
            {{ copied ? "Skopiowano ✓" : "Skopiuj link" }}
          </button>

          <button
            v-if="!store.qrUrl"
            class="bg-blue-500 text-white px-4 py-2 rounded"
            @click="store.generateQrForSession"
          >
            Generuj QR
          </button>
        </div>
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
import { useUserStore } from "@/store/user";
import { useDeviceStore } from "@/store/device";

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

const refreshPage = () => {
  if (props.sessionId) {
    store.setSessionFromTeacherCourses(props.sessionId, props.groupId);
    store.fetchAttendanceList(props.sessionId);
  }
};

const toogleAttendance = (
  studentId: number,
  courseSessionId: number,
  addOrRemove: boolean
) => {
  store.toogleAttendance(studentId, courseSessionId, addOrRemove);
};

const resetDevice = async (studentId: number) => {
  try {
    await deviceStore.resetStudentDevice(studentId);
    if (userStore.userInfos[studentId]) {
      userStore.userInfos[studentId].deviceName = null;
    }
    alert(" Urządzenie zostało zresetowane pomyślnie.");
  } catch (err) {
    alert(" Nie udało się zresetować urządzenia.");
  }
};

const userStore = useUserStore();
watch(
  students,
  async (newStudents) => {
    if (!newStudents.length) return;

    const ids = newStudents.map((s) => s.attenderUserId);
    await userStore.fetchUsersByIds(ids);
  },
  { immediate: true }
);

const deviceStore = useDeviceStore();
watch(
  students,
  async (newStudents) => {
    if (!newStudents.length) return;

    const ids = newStudents.map((s) => s.attenderUserId);
    await deviceStore.fetchTokensByIds(ids);
  },
  { immediate: true }
);

const copyDeviceLink = async (student: any) => {
  let token = deviceStore.deviceTokens[student.attenderUserId];

  const url = `${window.location.origin}/device/register?token=${token}`;
  await navigator.clipboard.writeText(url);
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

const copied = ref(false);

const copyLink = async () => {
  if (!store.url) return;

  await navigator.clipboard.writeText(store.url);
  copied.value = true;

  setTimeout(() => {
    copied.value = false;
  }, 1500);
};

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
