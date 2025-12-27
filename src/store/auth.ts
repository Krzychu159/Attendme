import { defineStore } from "pinia";
import { login, getCurrentUser } from "../api/auth";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: sessionStorage.getItem("token") || "",
    user: null as any,
    role: "",
  }),

  actions: {
    async login(loginName: string, password: string) {
      const data = await login(loginName, password);
      this.token = data.token;
      sessionStorage.setItem("token", this.token);
      await this.fetchUser();
    },

    async fetchUser() {
      const userData = await getCurrentUser();
      this.user = userData;

      if (userData.isTeacher) {
        this.role = "teacher";
      } else if (userData.isStudent) {
        this.role = "student";
      } else {
        this.role = "guest";
      }
    },

    logout() {
      this.token = "";
      this.user = null;
      this.role = "";
      sessionStorage.removeItem("token");
    },
  },
});
