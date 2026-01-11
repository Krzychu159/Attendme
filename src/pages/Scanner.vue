<template>
  <div class="flex flex-col gap-8 p-8 items-center">
    <img src="/logo-noname.png" alt="Logo" class="w-32 mx-auto" />

    <div class="relative w-full max-w-md aspect-square bg-black rounded-xl">
      <qrcode-stream
        @init="onInit"
        @detect="onDetect"
        :paused="paused"
        :constraints="{ facingMode: 'environment' }"
        class="absolute inset-0"
      />

      <div
        v-if="scanner.message"
        class="absolute inset-0 flex items-center justify-center text-center text-white p-4"
        :class="
          scanner.messageType === 'success' ? 'bg-green-600' : 'bg-red-600'
        "
      >
        {{ scanner.message }}
      </div>
    </div>

    <div class="text-center text-sm">Zbliż kod QR do kamery.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useScannerStore } from "@/store/scanner";

const route = useRoute();
const scanner = useScannerStore();

const paused = ref(false);
const courseSessionId = Number(route.params.sessionId);

// start skanera
onMounted(() => {
  scanner.initScanner(courseSessionId);
});

const onDetect = async (result: any) => {
  if (paused.value || !result?.[0]?.rawValue) return;

  paused.value = true;

  const attenderToken = result[0].rawValue;

  await scanner.scanQr(attenderToken);

  // po chwili wracamy do skanowania
  setTimeout(() => {
    paused.value = false;
  }, 3000);
};

const onInit = async (promise: Promise<void>) => {
  try {
    await promise;
  } catch (error: any) {
    console.error("Camera error:", error);
  }
};
</script>
