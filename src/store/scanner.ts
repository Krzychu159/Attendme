import { defineStore } from "pinia";
import { registerAttendance } from "@/api/attendance";

export const useScannerStore = defineStore("scanner", {
  state: () => ({
    cameraError: "" as string,
    loading: false,
    message: "" as string,
    messageType: "" as "success" | "error" | "",
    scannerToken: "" as string,
  }),

  actions: {
    setScannerToken(token: string) {
      this.scannerToken = (token || "").trim();
    },

    async scanQr(attenderToken: string) {
      const token = (attenderToken || "").trim();

      if (!this.scannerToken) {
        this.message = "Brak tokenu skanera w adresie URL.";
        this.messageType = "error";
        return;
      }

      if (!token) {
        this.message = "Nieprawidłowy kod QR.";
        this.messageType = "error";
        return;
      }

      this.loading = true;

      try {
        const user = await registerAttendance(token, this.scannerToken);
        this.message = `Obecność zarejestrowana: ${user.name} ${user.surname}`;
        this.messageType = "success";
      } catch (err: any) {
        if (err?.response?.status === 409) {
          this.message = "Ten student ma już zarejestrowaną obecność.";
        } else {
          this.message =
            err?.response?.data?.detail ||
            "Nie udało się zarejestrować obecności.";
        }
        this.messageType = "error";
      } finally {
        this.loading = false;
      }
    },

    clearMessage() {
      this.message = "";
      this.messageType = "";
    },
  },
});
