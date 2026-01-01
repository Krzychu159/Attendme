import { defineStore } from "pinia";
import { getStudentSessions } from "../api/course";
import { getTeacherSessions } from "../api/teacher";
import { useAuthStore } from "./auth";

// date helper
function isInRange(date: Date, start?: Date, end?: Date) {
  if (start && date < start) return false;
  if (end && date >= end) return false;
  return true;
}

// filter helper - shared between student and teacher stores
function filterCourses(courses: any[], query: string, range: string) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const day = now.getDay() || 7;

  const ranges: Record<string, [Date?, Date?]> = {
    today: [now, new Date(now.getTime() + 86400000)],
    week: [
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - day + 1),
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - day + 8),
    ],
    month: [
      new Date(now.getFullYear(), now.getMonth(), 1),
      new Date(now.getFullYear(), now.getMonth() + 1, 1),
    ],
    year: [
      new Date(now.getFullYear(), 0, 1),
      new Date(now.getFullYear() + 1, 0, 1),
    ],
    future: [new Date(), undefined],
    past: [undefined, new Date()],
    all: [],
  };

  const [start, end] = ranges[range] || [];
  const q = query.trim().toLowerCase();

  return courses.filter((c) => {
    const date = new Date(c.dateStart);

    // filters: text
    const matchesQuery =
      !q ||
      c.courseName?.toLowerCase().includes(q) ||
      c.locationName?.toLowerCase().includes(q);

    // filters: date
    const matchesRange = isInRange(date, start, end);

    return matchesQuery && matchesRange;
  });
}

// student store - courses

export const useCoursesStore = defineStore("courses", {
  state: () => ({
    courses: [] as any[],
    loading: false,
    error: "",
    filters: {
      query: "",
      range: "all",
    },
  }),

  getters: {
    filteredCourses: (state) =>
      filterCourses(state.courses, state.filters.query, state.filters.range),
  },

  actions: {
    setFilters(filters: Partial<{ query: string; range: string }>) {
      this.filters = { ...this.filters, ...filters };
    },

    async fetchCourses() {
      try {
        this.loading = true;
        this.error = "";

        const auth = useAuthStore();
        if (!auth.user) await auth.fetchUser();

        if (!auth.user?.studentId) {
          this.error = "Brak ID studenta.";
          return;
        }

        const data = await getStudentSessions();
        this.courses = Array.isArray(data?.items) ? data.items : [];
      } catch (err) {
        console.error("fetchCourses error:", err);
        this.error = "Nie udało się pobrać zajęć.";
      } finally {
        this.loading = false;
      }
    },
  },
});

// teacher store - courses

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
    filteredCourses: (state) =>
      filterCourses(state.courses, state.filters.query, state.filters.range),
  },

  actions: {
    setFilters(filters: Partial<{ query: string; range: string }>) {
      Object.assign(this.filters, filters);
    },

    async fetchCourses() {
      try {
        this.loading = true;
        this.error = "";

        const auth = useAuthStore();
        if (!auth.user) await auth.fetchUser();

        if (!auth.user?.teacherId) {
          this.error = "Brak ID wykładowcy.";
          return;
        }

        const data = await getTeacherSessions();
        this.courses = Array.isArray(data?.items) ? data.items : [];
      } catch (err) {
        console.error("fetchCourses error:", err);
        this.error = "Nie udało się pobrać zajęć.";
      } finally {
        this.loading = false;
      }
    },
  },
});
