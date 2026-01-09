import { getUserInfo } from "@/api/user";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    userInfos: {} as Record<number, any>,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchUsersByIds(ids: number[]) {
      this.loading = true;
      this.error = null;

      try {
        const results = await Promise.allSettled(
          ids.map((id) => getUserInfo(id))
        );

        results.forEach((res, i) => {
          if (res.status === "fulfilled") {
            this.userInfos[ids[i]!] = res.value;
          }
        });
      } catch (e) {
        this.error = "Nie udało się pobrać informacji o użytkownikach";
      } finally {
        this.loading = false;
      }
    },
  },
});
