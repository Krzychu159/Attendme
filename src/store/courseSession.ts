import { defineStore } from "pinia";
import { useCoursesStore } from "@/store/courses";

export const useCourseSessionStore = defineStore("courseSession", {
  state: () => ({
    session: null as any | null,
  }),

  actions: {
    setSessionFromList(sessionId: number, groupId: number) {
      const coursesStore = useCoursesStore();

      const found = coursesStore.courses.find(
        (c: any) =>
          c.courseSessionId === sessionId && c.courseGroupId === groupId
      );

      if (!found) {
        throw new Error("Nie znaleziono sesji w liście");
      }

      this.session = found;
    },

    clear() {
      this.session = null;
    },
  },
});
