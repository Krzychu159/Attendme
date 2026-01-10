<template>
  <div
    class="flex flex-col gap-4 items-center min-h-screen p-8"
    v-if="!success"
  >
    <img src="/logo.jpg" alt="Logo" class="w-32 mx-auto mb:mb-4" />
    <h1 class="text-xl font-bold">Rejestracja urządzenia</h1>
    <h2 class="text-xs">
      Rejestrujesz urządzenie, którego będziesz używać do sprawdzania obecności.
      Uzupełnij poniższe dane i naciśnij przycisk "Rejestruj".
    </h2>
    <div v-if="deviceStore.error" class="text-red-600 mt-4">
      {{ deviceStore.error }}
    </div>
    <form
      class="flex flex-col bg-gray-100 gap-2 p-6 rounded shadow-md border"
      @submit.prevent="handleSubmit"
    >
      <div class="flex flex-col gap-1">
        <label for="deviceName">Nazwa urządzenia</label>
        <input
          id="deviceName"
          type="text"
          placeholder="Nazwa urządzenia "
          class="border p-2 rounded w-64 mb-4"
          required
          v-model="deviceName"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label for="name">Imie</label>
        <input
          id="name"
          type="text"
          placeholder="Twoje imię i nazwisko"
          class="border p-2 rounded w-64 mb-4"
          required
          v-model="name"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label for="surname">Nazwisko</label>
        <input
          id="surname"
          type="text"
          placeholder="Twoje nazwisko"
          class="border p-2 rounded w-64 mb-4"
          required
          v-model="surname"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label for="index">Numer indeksu</label>
        <input
          id="index"
          type="text"
          placeholder="Twój numer indeksu"
          class="border p-2 rounded w-64 mb-4"
          required
          v-model="index"
        />
      </div>
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
        Rejestruj
      </button>
    </form>
  </div>
  <div v-if="success" class="flex flex-col gap-4 items-center min-h-screen p-8">
    <img src="/logo.jpg" alt="Logo" class="w-32 mx-auto mb:mb-4" />
    <p class="text-xl font-bold">Urządzenie zarejestrowane pomyślnie!</p>
    <p>Przejdź do skanowania objecności lub do pulpitu (wymagane logowanie).</p>
    <div class="flex flex-col gap-4 mt-4">
      <button class="bg-green-500 border-none">Skanuj obecność</button>
      <button
        class="bg-yellow-500 border-none"
        onclick="window.location.href='/'"
      >
        Wróć do pulpitu
      </button>
      <button class="bg-red-500 border-none" @click="resetDevice">
        Resetuj urządzenie
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useDeviceStore } from "@/store/device";

const deviceStore = useDeviceStore();
const route = useRoute();

const token = route.query.token as string;
const deviceName = ref("");
const name = ref("");
const surname = ref("");
const index = ref("");
const success = ref(false);

// 🔹 Pokazuj "ekran z przyciskami" tylko jeśli jesteśmy NA STRONIE REJESTRACJI
onMounted(() => {
  const registered = localStorage.getItem("deviceRegistered");

  // sprawdzamy że to faktycznie strona /device/register
  const isDeviceRegisterPage = route.path.includes("/device/register");

  if (isDeviceRegisterPage && registered === "true") {
    success.value = true;
  } else {
    success.value = false;
  }
});

const handleSubmit = async (e: Event) => {
  e.preventDefault();

  if (!token) {
    deviceStore.error = "Brak tokena w linku.";
    return;
  }

  try {
    await deviceStore.registerDeviceWithToken(token, {
      deviceName: deviceName.value,
      studentName: name.value,
      studentSurname: surname.value,
      albumIdNumber: Number(index.value),
    });

    // 🔹 zapisujemy lokalnie, że urządzenie zostało zarejestrowane
    localStorage.setItem("deviceRegistered", "true");
    success.value = true;
  } catch {
    success.value = false;
  }
};

const resetDevice = async () => {
  try {
    await deviceStore.resetRegisteredDevice();

    // 🔹 czyścimy lokalne dane
    localStorage.removeItem("deviceToken");
    localStorage.removeItem("deviceUserId");
    localStorage.removeItem("deviceRegistered");

    success.value = false;
    alert("✅ Urządzenie zostało zresetowane pomyślnie.");
  } catch (err) {
    alert("❌ Nie udało się zresetować urządzenia.");
  }
};
</script>
