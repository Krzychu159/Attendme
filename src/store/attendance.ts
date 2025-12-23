import { defineStore } from "pinia";
import { getStudentAttendance } from "../api/attendance";

export const useAttendanceStore = defineStore("attendance", {
  state: () => ({
    status: "" as "Present" | "Absent" | "",
    loading: false,
    error: "",
  }),

  actions: {
    async fetchAttendance(sessionId: number, groupId: number) {
      try {
        this.loading = true;
        this.error = "";
        this.status = "";

        const res = await getStudentAttendance(groupId);

        const found = Array.isArray(res)
          ? res.find((a) => a.courseSessionId === sessionId)
          : null;

        if (found) {
          this.status = "Present";
        } else {
          this.status = "Absent";
        }
      } catch (err: any) {
        console.error(" Błąd pobierania obecności:", err);
        this.error = "Nie udało się pobrać obecności.";
      } finally {
        this.loading = false;
      }
    },
  },
});
