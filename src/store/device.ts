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
          ids.map((id) => getDeviceToken(id))
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
      }
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
        const token = localStorage.getItem("deviceToken");
        const userIdStr = localStorage.getItem("deviceUserId");

        if (!token || !userIdStr)
          throw new Error("Brak danych urządzenia do resetu.");

        const deviceUserId = Number(userIdStr);

        await resetDevice(deviceUserId, token);

        localStorage.removeItem("deviceToken");
        localStorage.removeItem("deviceUserId");
      } catch (err: any) {
        this.error =
          err.response?.data?.detail || "Nie udało się zresetować urządzenia.";
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
