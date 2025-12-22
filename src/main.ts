import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router/index";
import { useAuthStore } from "@/store/auth";
import "./style.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

const auth = useAuthStore();
if (auth.token && !auth.user) {
  await auth.fetchUser();
}

app.use(router);
app.mount("#app");
