<template>
  <div class="flex flex-col gap-8 p-8 overflow-hidden items-center">
    <img src="/logo-noname.png" alt="Logo" class="w-32 mx-auto mb-4" />

    <div
      class="relative w-full max-w-md mx-auto aspect-square bg-black rounded-xl overflow-hidden"
    >
      <qrcode-stream
        @init="onInit"
        :paused="false"
        :constraints="{ facingMode: 'environment' }"
        class="absolute inset-0 w-full h-full object-cover"
      />

      <div
        v-if="errorMessage"
        class="absolute inset-0 flex items-center justify-center text-red-600 text-center p-4 bg-black"
      >
        Błąd: {{ errorMessage }}
      </div>
    </div>

    <div>
      Aby zarejestorwać obecność umieść telefon w polu widzenia skanera. W razie
      wątpliwości poproś osobę prowadzącą zajęcia o pomoc.
    </div>

    <div class="flex flex-wrap w-64 overflow-hidden">token: {{ token }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const token = route.query.token as string;

const errorMessage = ref<string | null>(null);

const onInit = async (promise: Promise<void>) => {
  try {
    await promise;
  } catch (error: any) {
    if (error.name === "NotAllowedError") {
      errorMessage.value =
        "Brak dostępu do kamery. Zezwól na użycie kamery w przeglądarce.";
    } else if (error.name === "NotFoundError") {
      errorMessage.value = "Nie wykryto kamery w tym urządzeniu.";
    } else if (error.name === "NotSupportedError") {
      errorMessage.value = "Twoja przeglądarka nie obsługuje kamery.";
    } else if (error.name === "NotReadableError") {
      errorMessage.value = "Kamera jest już używana przez inną aplikację.";
    } else if (error.name === "OverconstrainedError") {
      errorMessage.value =
        "Nie można uruchomić kamery (ograniczenia sprzętowe).";
    } else {
      errorMessage.value = "Nie udało się uruchomić kamery.";
    }
  }
};
</script>
