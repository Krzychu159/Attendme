import { getDeviceToken, registerDeviceForStudent } from "@/api/device";
import { defineStore } from "pinia";

export const useDeviceStore = defineStore("device", {
  state: () => ({
    deviceTokens: {} as Record<number, string>, // userId → token
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // Pobiera istniejące tokeny dla listy studentów (jeśli urządzenie już zarejestrowane)
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

    // Generuje nowy token rejestracyjny, jeśli student nie ma jeszcze urządzenia
    async generateRegisterToken(student: {
      attenderUserId: number;
      userName: string;
      userSurname: string;
      studentAlbumIdNumber: number;
    }) {
      this.loading = true;
      this.error = null;

      try {
        const res = await registerDeviceForStudent({
          deviceName: "Telefon studenta",
          studentName: student.userName,
          studentSurname: student.userSurname,
          albumIdNumber: student.studentAlbumIdNumber,
        });

        if (res?.token) {
          this.deviceTokens[student.attenderUserId] = res.token;
          return res.token;
        }
      } catch (e) {
        this.error = "Nie udało się wygenerować tokena rejestracyjnego.";
      } finally {
        this.loading = false;
      }

      return null;
    },
  },
});
