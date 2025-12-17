import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Teacher from "../pages/Teacher.vue";
import Student from "../pages/Student.vue";
import { useAuthStore } from "../store/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    {
      path: "/logout",
      component: Login,
      beforeEnter: () => {
        const auth = useAuthStore();
        auth.logout();
        return "/login";
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../pages/NotFound.vue"),
    },

    { path: "/teacher", component: Teacher, meta: { requiresAuth: true } },
    { path: "/student", component: Student, meta: { requiresAuth: true } },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.token) {
    return "/login";
  }

  if (to.path === "/login" && auth.token) {
    if (auth.role === "teacher") return "/teacher";
    if (auth.role === "student") return "/student";
  }
});

export default router;
