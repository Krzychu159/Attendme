import { defineStore } from "pinia";
import { getStudentSessions } from "../api/course";
import { useAuthStore } from "./auth";
import { getTeacherSessions } from "../api/teacher";

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
        console.log(" API response:", data);

        this.courses = Array.isArray(data?.items) ? data.items : [];
        console.log("courses zapisane:", this.courses.length);
      } catch (err: any) {
        console.error("fetchCourses error:", err);
        this.error = "Nie udało się pobrać zajęć.";
      } finally {
        this.loading = false;
      }
    },
  },
});

export const useTeacherCoursesStore = defineStore("teacherCourses", {
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

        if (!auth.user?.teacherId) {
          this.error = "Brak ID wykładowcy (teacherId).";
          return;
        }

        const data = await getTeacherSessions();
        console.log("📦 Teacher API response:", data);

        this.courses = Array.isArray(data?.items) ? data.items : [];
        console.log("✅ Teacher courses:", this.courses.length);
      } catch (err: any) {
        console.error("❌ fetchCourses (teacher) error:", err);
        this.error = "Nie udało się pobrać zajęć wykładowcy.";
      } finally {
        this.loading = false;
      }
    },
  },
});
