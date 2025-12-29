import { defineStore } from "pinia";
import { getStudentAttendance } from "../api/attendance";

export const useAttendanceStore = defineStore("attendance", {
  state: () => ({
    status: "" as "Present" | "Absent" | "",
    attendanceList: [] as any[],
    loading: false,
    error: "",
  }),

  getters: {
    totalAttendance: (state) => state.attendanceList.length,
    attendanceRate: (state) => {
      if (!state.attendanceList.length) return 0;
      const presentCount = state.attendanceList.filter(
        (a) => !!a.courseSessionId
      ).length;
      return presentCount;
    },
  },

  actions: {
    async fetchAttendance(sessionId: number, groupId: number) {
      try {
        this.loading = true;
        this.error = "";
        this.status = "";

        const res = await getStudentAttendance(groupId);

        this.attendanceList = res || [];

        const found = Array.isArray(res)
          ? res.find((a) => a.courseSessionId === sessionId)
          : null;

        this.status = found ? "Present" : "Absent";
      } catch (err: any) {
        console.error("❌ Błąd pobierania obecności:", err);
        this.error = "Nie udało się pobrać obecności.";
      } finally {
        this.loading = false;
      }
    },
  },
});
