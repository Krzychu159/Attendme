<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4"
  >
    <div class="w-full max-w-sm border p-5 rounded shadow-md bg-white">
      <img src="/logo.jpg" alt="Logo" class="w-32 mx-auto mb-4" />

      <form @submit.prevent="handleLogin" class="flex flex-col gap-3">
        <label for="loginName">Login</label>
        <input
          v-model="loginName"
          id="loginName"
          placeholder="Login"
          class="border p-2 rounded"
        />

        <label for="password">Hasło</label>
        <input
          v-model="password"
          id="password"
          type="password"
          placeholder="Hasło"
          class="border p-2 rounded"
        />

        <button
          type="submit"
          class="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Zaloguj
        </button>
      </form>

      <p v-if="error" class="text-red-600 text-sm mt-3 text-center">
        {{ error }}
      </p>

      <a
        href="https://github.com/Krzychu159/Attendme"
        target="_blank"
        class="block text-xs text-gray-500 mt-4 text-center hover:underline"
      >
        @GitHub
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";

const loginName = ref("");
const password = ref("");
const error = ref("");
const auth = useAuthStore();
const router = useRouter();

async function handleLogin() {
  try {
    await auth.login(loginName.value, password.value);

    if (auth.role === "teacher") router.push("/teacher");
    else router.push("/student");
  } catch (err) {
    console.error(err);
    error.value = "Błąd logowania — sprawdź dane lub połączenie.";
  }
}
</script>
