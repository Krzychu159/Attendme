<template>
  <div v-if="session">
    <h1 class="text-xl font-bold mb-3">
      {{ session.courseName }}
    </h1>

    <div class="flex flex-col gap-3">
      <p><span class="font-bold">Termin</span> {{ formattedDate }}</p>
      <p>
        <span class="font-bold">Godziny</span> {{ formattedStartTime }} –
        {{ formattedEndTime }}
      </p>
      <p>
        <span class="font-bold">Lokalizacja</span> {{ session.locationName }}
      </p>
    </div>
  </div>

  <div v-else class="text-gray-500">Nie znaleziono sesji.</div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useCourseSessionStore } from "@/store/courseSession";
import { computed } from "vue";

const props = defineProps<{
  sessionId: number;
  groupId: number;
}>();

const courseSessionStore = useCourseSessionStore();
const { session } = storeToRefs(courseSessionStore);

onMounted(() => {
  courseSessionStore.setSessionFromList(props.sessionId, props.groupId);
});

watch(
  () => [props.sessionId, props.groupId],
  ([s, g]) => {
    if (s == null || g == null) return;
    courseSessionStore.setSessionFromList(s, g);
  }
);

const formattedDate = computed(() => {
  if (!session.value) return "";
  return new Date(session.value.dateStart).toLocaleDateString("pl-PL");
});

const formattedStartTime = computed(() => {
  if (!session.value) return "";
  return new Date(session.value.dateStart).toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  });
});

const formattedEndTime = computed(() => {
  if (!session.value) return "";
  return new Date(session.value.dateEnd).toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  });
});
</script>
