<template>
  <div class="md:flex justify-between">
    <div v-if="session">
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

    <div v-else class="text-gray-500 font-bold">Brak danych sesji.</div>
    <div class="flex flex-col gap-3 font-bold">
      <div>Obecność</div>
      <div>
        <div v-if="attendanceStore.loading">Sprawdzanie obecności...</div>
        <div v-else-if="attendanceStore.error" class="text-red-600">
          {{ attendanceStore.error }}
        </div>
        <div
          v-else
          :class="[
            'px-5 py-3 w-fit rounded-xl text-white font-semibold',
            attendanceStore.status === 'Present'
              ? 'bg-green-500'
              : 'bg-red-500',
          ]"
        >
          {{
            attendanceStore.status === "Present"
              ? "Obecny"
              : attendanceStore.status === "Absent"
                ? "Nieobecny"
                : "Brak danych"
          }}
        </div>
      </div>
      <button
        class="px-4 bg-blue-500 text-white hover:bg-blue-600 transition py-3 rounded-xl font-semibold w-fit"
        @click="refreshPage"
      >
        Odśwież
      </button>
    </div>
  </div>

  <div class="flex flex-col gap-3 mb-5">
    <div>
      <b>Frekwencja dotychczasowa:</b> {{ attendanceStore.totalAttendance }} z
      {{ coursesStore.courses.length }} ({{ attendancePercent }}%)
    </div>
    <div class="w-full bg-gray-300 h-8 rounded-2xl">
      <div
        class="bg-green-500 h-8 rounded-2xl bg-gradient-to-r from-green-400 to-green-600"
        :style="{ width: attendancePercent + '%' }"
      ></div>
    </div>
  </div>

  <div class="flex flex-col gap-3 mb-5">
    <div>
      <b>Zaawansowanie kursu:</b> {{ past }} z {{ total }} ({{ progress }}%)
    </div>
    <div class="w-full bg-gray-300 h-8 rounded-2xl">
      <div
        class="bg-blue-500 h-8 rounded-2xl bg-gradient-to-r from-blue-400 to-blue-600"
        :style="{ width: progress + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useCourseSessionStore } from "@/store/courseSession";
import { useCoursesStore } from "@/store/courses";
import { useAuthStore } from "@/store/auth";
import { useAttendanceStore } from "@/store/attendance";

const props = defineProps<{
  sessionId: number;
  groupId: number;
}>();

const courseSessionStore = useCourseSessionStore();
const coursesStore = useCoursesStore();
const auth = useAuthStore();

const { session } = storeToRefs(courseSessionStore);
const attendanceStore = useAttendanceStore();

const refreshPage = async () => {
  await coursesStore.fetchCourses();
  trySetSessionFromCourses();
  await attendanceStore.fetchAttendance(props.sessionId, props.groupId);
};

const trySetSessionFromCourses = () => {
  const found = coursesStore.courses.find(
    (c: any) =>
      c.courseSessionId === props.sessionId && c.courseGroupId === props.groupId
  );

  if (found) {
    courseSessionStore.setSession(found);
  }
};

//frekwencja i postep kursu

const past = coursesStore.courses.filter(
  (c) => new Date(c.dateStart) < new Date()
).length;
const total = coursesStore.courses.length;

const progress = computed(() => {
  return total ? Math.round((past / total) * 100) : 0;
});

const attendancePercent = computed(() => {
  const attended = attendanceStore.totalAttendance;
  return total ? Math.round((attended / total) * 100) : 0;
});

//inicjalizacja danych

onMounted(async () => {
  if (!coursesStore.courses.length) {
    if (auth.token && !auth.user) {
      await auth.fetchUser();
    }

    await coursesStore.fetchCourses();
  }

  trySetSessionFromCourses();
});

watch(
  () => [props.sessionId, props.groupId, coursesStore.courses.length],
  () => {
    if (!props.sessionId || Number.isNaN(props.sessionId)) return;
    if (!coursesStore.courses.length) return;
    trySetSessionFromCourses();
  },
  { immediate: true }
);

watch(
  () => session.value?.courseSessionId,
  async (id) => {
    if (!id) return;
    await attendanceStore.fetchAttendance(props.sessionId, props.groupId);
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
