<template>
  <Menu />
  <div class="max-w-[1240px] mx-auto my-5">
    <div class="mx-10">
      <component
        :is="isTeacher ? TeacherCourseView : StudentCourseView"
        :session-id="sessionId"
        :group-id="groupId"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../store/auth";

import StudentCourseView from "@/components/student/StudentCourseView.vue";
import TeacherCourseView from "@/components/teacher/TeacherCourseView.vue";
import Menu from "../components/shared/Menu.vue";

const route = useRoute();
const auth = useAuthStore();

const sessionId = Number(route.params.sessionId);
const groupId = Number(route.params.groupId);

const isTeacher = computed(() => auth.role === "teacher");
</script>
