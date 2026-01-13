<template>
  <div class="flex flex-col gap-8 p-8 items-center">
    <img src="/logo-noname.png" alt="Logo" class="w-32 mx-auto" />

    <div
      class="relative w-full max-w-md aspect-square bg-black rounded-xl overflow-hidden"
    >
      <qrcode-stream
        @init="onInit"
        @detect="onDetect"
        :paused="paused"
        :constraints="{ facingMode: 'environment' }"
        class="absolute inset-0 w-full h-full object-cover"
      />

      <div
        v-if="scanner.cameraError"
        class="absolute inset-0 flex items-center justify-center text-center text-white p-4 rounded-xl bg-red-600"
      >
        {{ scanner.cameraError }}
      </div>

      <div
        v-if="scanner.message"
        class="absolute bottom-4 left-4 right-4 text-center text-white p-3 rounded-xl text-lg font-semibold pointer-events-none"
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
import { ref } from "vue";
import { useScannerStore } from "@/store/scanner";

const scanner = useScannerStore()!; // ⬅️ TO JEST FIX
const paused = ref(false);

const onDetect = async (result: any) => {
  if (paused.value || !result?.[0]?.rawValue) return;

  paused.value = true;

  try {
    await scanner.scanQr(result[0].rawValue);
  } finally {
    setTimeout(() => {
      paused.value = false;
    }, 3000);
  }
};

const onInit = async (promise: Promise<void>) => {
  try {
    await promise;
    scanner.cameraError = "";
    paused.value = false;
  } catch {
    scanner.cameraError = "Nie udało się uzyskać dostępu do kamery.";
  }
};
</script>
