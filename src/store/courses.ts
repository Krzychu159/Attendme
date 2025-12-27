import { defineStore } from "pinia";
import { getStudentSessions } from "../api/course";
import { useAuthStore } from "./auth";
import { getTeacherSessions } from "../api/teacher";

// student courses store
export const useCoursesStore = defineStore("courses", {
  state: () => ({
    courses: [] as any[],
    loading: false,
    error: "",
    filters: {
      query: "",
      range: "month",
    },
  }),

  getters: {
    filteredCourses: (state) => {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfYear = new Date(now.getFullYear(), 0, 1);

      return state.courses.filter((c) => {
        // nazwa kursu lub lokalizacja
        const q = state.filters.query.toLowerCase();
        const matchesQuery =
          c.courseName?.toLowerCase().includes(q) ||
          c.locationName?.toLowerCase().includes(q);

        // zakres dat
        const date = new Date(c.dateStart);
        let matchesRange = true;

        switch (state.filters.range) {
          case "week":
            matchesRange = date >= startOfWeek;
            break;
          case "month":
            matchesRange = date >= startOfMonth;
            break;
          case "year":
            matchesRange = date >= startOfYear;
            break;
        }

        return matchesQuery && matchesRange;
      });
    },
  },

  actions: {
    setFilters(newFilters: Partial<{ query: string; range: string }>) {
      this.filters = { ...this.filters, ...newFilters };
    },

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

        const data = await getStudentSessions();
        this.courses = Array.isArray(data?.items) ? data.items : [];
      } catch (err: any) {
        console.error(" fetchCourses error:", err);
        this.error = "Nie udało się pobrać zajęć.";
      } finally {
        this.loading = false;
      }
    },
  },
});

// teacher courses store

export const useTeacherCoursesStore = defineStore("teacherCourses", {
  state: () => ({
    courses: [] as any[],
    loading: false,
    error: "",
    filters: {
      query: "",
      range: "month",
    },
  }),

  getters: {
    filteredCourses: (state) => {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfYear = new Date(now.getFullYear(), 0, 1);

      return state.courses.filter((c) => {
        const q = state.filters.query.toLowerCase();
        const matchesQuery =
          c.courseName?.toLowerCase().includes(q) ||
          c.locationName?.toLowerCase().includes(q);

        const date = new Date(c.dateStart);
        let matchesRange = true;

        switch (state.filters.range) {
          case "week":
            matchesRange = date >= startOfWeek;
            break;
          case "month":
            matchesRange = date >= startOfMonth;
            break;
          case "year":
            matchesRange = date >= startOfYear;
            break;
        }

        return matchesQuery && matchesRange;
      });
    },
  },

  actions: {
    setFilters(newFilters: Partial<{ query: string; range: string }>) {
      Object.assign(this.filters, newFilters);
    },

    async fetchCourses() {
      try {
        this.loading = true;
        this.error = "";

        const auth = useAuthStore();

        if (!auth.user) {
          await auth.fetchUser();
        }

        if (!auth.user?.teacherId) {
          this.error = "Brak ID wykładowcy (teacherId).";
          return;
        }

        const data = await getTeacherSessions();
        this.courses = Array.isArray(data?.items) ? data.items : [];

        console.log(" Teacher sessions:", this.courses.length);
      } catch (err: any) {
        console.error(" fetchCourses error:", err);
        this.error = "Nie udało się pobrać zajęć.";
      } finally {
        this.loading = false;
      }
    },
  },
});
