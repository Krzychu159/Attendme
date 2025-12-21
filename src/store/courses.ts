import { defineStore } from "pinia";
import { getStudentSessions } from "../api/course";
import { useAuthStore } from "./auth";

export const useCoursesStore = defineStore("courses", {
  state: () => ({
    courses: [] as any[],
    loading: false,
    error: "",
  }),

  actions: {
    async fetchCourses() {
      try {
        this.loading = true;
        this.error = "";

        const auth = useAuthStore();
        if (!auth.user) await auth.fetchUser();

        const studentId = auth.user?.studentId;
        if (!studentId) {
          this.error = "Brak ID studenta.";
          return;
        }

        const data = await getStudentSessions(studentId);
        console.log("📦 API response:", data);

        this.courses = Array.isArray(data?.items) ? data.items : [];
        console.log("✅ courses zapisane:", this.courses.length);
      } catch (err: any) {
        console.error("❌ fetchCourses error:", err);
        this.error = "Nie udało się pobrać zajęć.";
      } finally {
        this.loading = false;
      }
    },
  },
});
