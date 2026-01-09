<template>
  <div class="flex flex-col gap-8 items-center min-h-screen p-8">
    <img src="/logo.jpg" alt="Logo" class="w-32 mx-auto mb-4" />
    <h1 class="text-xl font-bold">Rejestracja urządzenia</h1>
    <h2 class="text-xs">
      Rejestrujesz urządzenie, którego będziesz używać do sprawdzania obecności.
      Uzupełnij poniższe dane i naciśnij przycisk "Rejestruj".
    </h2>
    <form class="flex flex-col bg-gray-100 gap-2 p-6 rounded shadow-md border">
      <div class="flex flex-col gap-1">
        <label for="deviceName">Nazwa urządzenia</label>
        <input
          id="deviceName"
          type="text"
          placeholder="Nazwa urządzenia "
          class="border p-2 rounded w-64 mb-4"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label for="name">Imie</label>
        <input
          id="name"
          type="text"
          placeholder="Twoje imię i nazwisko"
          class="border p-2 rounded w-64 mb-4"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label for="surname">Nazwisko</label>
        <input
          id="surname"
          type="text"
          placeholder="Twoje nazwisko"
          class="border p-2 rounded w-64 mb-4"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label for="index">Numer indeksu</label>
        <input
          id="index"
          type="text"
          placeholder="Twój numer indeksu"
          class="border p-2 rounded w-64 mb-4"
        />
      </div>
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
        Rejestruj
      </button>
    </form>
    <div class="w-32 overflow-hidden">{{ token }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const error = ref<string | null>(null);
const token = route.query.token as string;

onMounted(async () => {
  const token = route.query.token as string | undefined;
  console.log("Device registration token:", token);

  if (!token) {
    error.value = "Brak tokena rejestracyjnego w adresie URL.";
    return;
  }
});
</script>
