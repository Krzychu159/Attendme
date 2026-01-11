import { defineStore } from "pinia";
import { getScannerSessionToken, registerAttendance } from "@/api/scanner";

export const useScannerStore = defineStore("scanner", {
  state: () => ({
    scannerToken: null as string | null,
    loading: false,

    cameraError: "" as string,

    message: "" as string,
    messageType: "" as "success" | "error" | "",
  }),

  actions: {
    async initScanner(courseSessionId: number) {
      this.loading = true;
      this.cameraError = "";

      try {
        const res = await getScannerSessionToken(courseSessionId);
        this.scannerToken = res.token;
      } catch {
        this.cameraError = "Nie udało się uruchomić skanera.";
      } finally {
        this.loading = false;
      }
    },

    async scanQr(attenderToken: string) {
      if (!this.scannerToken) return;

      try {
        const user = await registerAttendance(attenderToken);
        this.message = `Obecność zarejestrowana: ${user.name} ${user.surname}`;
        this.messageType = "success";
      } catch (err: any) {
        if (err.response?.status === 409) {
          this.message = "Ten student ma już zarejestrowaną obecność.";
          this.messageType = "error";
        } else {
          this.message =
            err.response?.data?.detail ||
            "Nie udało się zarejestrować obecności.";
          this.messageType = "error";
        }
      }

      setTimeout(() => {
        this.message = "";
        this.messageType = "";
      }, 3000);
    },
  },
});
