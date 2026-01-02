import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router/index";
import { useAuthStore } from "@/store/auth";
import "./style.css";
import { QrcodeStream } from "vue-qrcode-reader";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.component("qrcode-stream", QrcodeStream);

const auth = useAuthStore();
if (auth.token && !auth.user) {
  await auth.fetchUser();
}

app.use(router);
app.mount("#app");
