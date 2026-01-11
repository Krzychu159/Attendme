import { defineStore } from "pinia";
import { registerAttendance } from "@/api/attendance";

export const useScannerStore = defineStore("scanner", {
  state: () => ({
    cameraError: "" as string,
    loading: false,
    message: "" as string,
    messageType: "" as "success" | "error" | "",
  }),

  actions: {
    async scanQr(attenderToken: string) {
      this.loading = true;

      try {
        const user = await registerAttendance(attenderToken);
        this.message = `Obecność zarejestrowana: ${user.name} ${user.surname}`;
        this.messageType = "success";
      } catch (err: any) {
        if (err.response?.status === 409) {
          this.message = "Ten student ma już zarejestrowaną obecność.";
        } else {
          this.message =
            err.response?.data?.detail ||
            "Nie udało się zarejestrować obecności.";
        }
        this.messageType = "error";
      } finally {
        this.loading = false;
        setTimeout(() => {
          this.message = "";
          this.messageType = "";
        }, 3000);
      }
    },
  },
});
