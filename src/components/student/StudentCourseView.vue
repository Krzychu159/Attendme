<template>
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

  <div v-else class="text-gray-500">Brak danych sesji.</div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useCourseSessionStore } from "@/store/courseSession";
import { useCoursesStore } from "@/store/courses";
import { useAuthStore } from "@/store/auth";

const props = defineProps<{
  sessionId: number;
  groupId: number;
}>();

const courseSessionStore = useCourseSessionStore();
const coursesStore = useCoursesStore();
const auth = useAuthStore();

const { session } = storeToRefs(courseSessionStore);

const trySetSessionFromCourses = () => {
  const found = coursesStore.courses.find(
    (c: any) =>
      c.courseSessionId === props.sessionId && c.courseGroupId === props.groupId
  );

  if (found) {
    courseSessionStore.setSession(found);
  }
};

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
