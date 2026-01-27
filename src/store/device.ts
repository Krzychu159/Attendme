import {
  getDeviceToken,
  registerDeviceForStudent,
  resetDevice,
} from "@/api/device";
import { defineStore } from "pinia";

export const useDeviceStore = defineStore("device", {
  state: () => ({
    deviceTokens: {} as Record<number, string>, // userId → token
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // Pobiera istniejące tokeny dla listy studentów
    async fetchTokensByIds(ids: number[]) {
      this.loading = true;
      this.error = null;

      try {
        const results = await Promise.allSettled(
          ids.map((id) => getDeviceToken(id)),
        );

        results.forEach((res, i) => {
          if (res.status === "fulfilled" && res.value?.token) {
            this.deviceTokens[ids[i]!] = res.value.token;
          }
        });
      } catch (e) {
        this.error = "Nie udało się pobrać tokenów urządzeń.";
      } finally {
        this.loading = false;
      }
    },

    // Rejestruje własne urządzenie studenta i zwraca token rejestracyjny
    async registerDeviceWithToken(
      token: string,
      data: {
        deviceName: string;
        studentName: string;
        studentSurname: string;
        albumIdNumber: number;
      },
    ) {
      this.loading = true;
      this.error = null;

      try {
        const res = await registerDeviceForStudent(token, data);

        if (res?.token) {
          localStorage.setItem("deviceToken", res.token);
        }

        return res;
      } catch (err: any) {
        this.error =
          err.response?.data?.detail ||
          "Nie udało się zarejestrować urządzenia.";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // Resetuje zarejestrowane urządzenie studenta
    async resetRegisteredDevice() {
      this.loading = true;
      this.error = null;

      try {
        const deviceUserId = localStorage.getItem("deviceUserId");

        if (!deviceUserId) {
          this.error = "Brak deviceUserId w pamięci lokalnej.";
          return;
        }

        await resetDevice(Number(deviceUserId));

        //  Czyścimy wszystko lokalnie
        localStorage.removeItem("deviceToken");
        localStorage.removeItem("deviceUserId");
        localStorage.removeItem("deviceRegistered");
      } catch (e) {
        console.error("Błąd podczas resetowania urządzenia:", e);
        this.error = "Nie udało się zresetować urządzenia.";
      } finally {
        this.loading = false;
      }
    },

    // Resetujemy urządzenie studenta o podanym ID (używane przez nauczyciela)
    async resetStudentDevice(studentId: number) {
      this.loading = true;
      this.error = null;

      try {
        await resetDevice(studentId);

        //  Po sukcesie usuwamy token z lokalnego cache (żeby tabela się odświeżyła)
        delete this.deviceTokens[studentId];
      } catch (e) {
        console.error("Błąd resetowania urządzenia:", e);
        this.error = "Nie udało się zresetować urządzenia studenta.";
      } finally {
        this.loading = false;
      }
    },
  },
});
