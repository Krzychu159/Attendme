import { defineStore } from "pinia";
import { getStudentAttendance, getAttendanceTicket } from "@/api/attendance";

export const useAttendanceStore = defineStore("attendance", {
  state: () => ({
    status: "" as "Present" | "Absent" | "",
    attendanceList: [] as any[],
    loading: false,
    error: "",

    ticket: null as string | null,
    ticketExpires: null as string | null,
    ticketLoading: false,
    ticketError: "",
    pollingId: null as number | null,
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

    isDeviceRegistered: () => {
      return !!localStorage.getItem("deviceToken");
    },

    hasValidTicket: (state) => {
      return !!state.ticket;
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
        console.error(" Błąd pobierania obecności:", err);
        this.error = "Nie udało się pobrać obecności.";
      } finally {
        this.loading = false;
      }
    },

    async fetchAttendanceTicket() {
      this.ticketLoading = true;
      this.ticketError = "";

      try {
        const res = await getAttendanceTicket();

        this.ticket = res.token;
        this.ticketExpires = res.expires;
      } catch (err: any) {
        console.error("Błądddsds pobierania ticketu:", err);

        //  token urządzenia nieważny / zresetowany
        if (err.response?.status === 401) {
          localStorage.removeItem("deviceToken");
          this.ticket = null;
          this.ticketExpires = null;
        }

        this.ticketError = "Nie można pobrać kodu obecności.";
      } finally {
        this.ticketLoading = false;
      }
    },

    startTicketPolling() {
      if (this.pollingId) return;

      this.fetchAttendanceTicket();

      this.pollingId = window.setInterval(() => {
        this.fetchAttendanceTicket();
      }, 2000);
    },

    stopTicketPolling() {
      if (this.pollingId) {
        clearInterval(this.pollingId);
        this.pollingId = null;
      }
    },

    resetTicketState() {
      this.ticket = null;
      this.ticketExpires = null;
      this.ticketError = "";
      this.stopTicketPolling();
    },
  },
});
