import { defineStore } from "pinia";
import { getStudentSessions } from "../api/course";

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

        const data = await getStudentSessions();
        console.log("📦 Odpowiedź backendu:", data);

        if (!data || !Array.isArray(data) || data.length === 0) {
          console.warn("Brak kursów, dodajemy mock testowy...");
          this.courses = [
            {
              id: 1,
              courseName: "Programowanie w Vue 3",
              teacherName: "Jan Kowalski",
              date: "2025-12-21 10:00",
            },
            {
              id: 2,
              courseName: "Bazy danych",
              teacherName: "Anna Nowak",
              date: "2025-12-22 08:00",
            },
          ];
        } else {
          this.courses = data;
        }
      } catch (err: any) {
        console.error("fetchCourses error:", err);
        this.error = "Nie udało się pobrać kursów.";
      } finally {
        this.loading = false;
      }
    },
  },
});
