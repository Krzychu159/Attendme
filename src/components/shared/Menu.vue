<template>
  <div class="border-b">
    <nav
      class="flex list-none justify-between max-w-[1240px] mx-auto p-10 items-center max-h-24"
    >
      <RouterLink
        :to="auth.role === 'teacher' ? '/teacher' : '/student'"
        class="text-red-500 cursor-pointer hover:underline"
      >
        <li>
          <img src="/logo-noname.png" alt="Logo" class="w-16 mx-auto mb-4" />
        </li>
      </RouterLink>

      <div class="relative">
        <li
          @click="open = !open"
          class="bg-blue-500 p-4 rounded-full text-white font-bold cursor-pointer select-none"
        >
          {{ name.slice(0, 1) }}{{ surname.slice(0, 1) }}
        </li>

        <div
          v-if="open"
          class="absolute right-0 top-full mt-2 w-56 bg-white shadow-lg rounded-lg z-50"
        >
          <div class="p-4 text-sm">
            <div class="font-semibold">{{ name }} {{ surname }}</div>
            <div class="text-gray-500 mb-3">{{ role }}</div>

            <RouterLink
              to="/logout"
              class="text-red-500 cursor-pointer hover:underline"
            >
              Wyloguj
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <div v-if="open" class="fixed inset-0 z-40" @click="open = false"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../../store/auth";

const auth = useAuthStore();

const name = auth.user?.name || "Gość";
const surname = auth.user?.surname || "";
const role = auth.role || "guest";

const open = ref(false);
</script>
