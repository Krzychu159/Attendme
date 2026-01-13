<template>
  <div class="flex flex-col gap-8 p-8 items-center">
    <img src="/logo-noname.png" alt="Logo" class="w-32 mx-auto" />

    <div
      class="relative w-full max-w-md aspect-square bg-black rounded-xl overflow-hidden"
    >
      <qrcode-stream
        :key="scannerKey"
        @init="onInit"
        @detect="onDetect"
        :constraints="{ facingMode: 'environment' }"
        class="absolute inset-0 w-full h-full object-cover"
      />

      <!-- błąd kamery -->
      <div
        v-if="scanner.cameraError"
        class="absolute inset-0 flex items-center justify-center text-center text-white p-4 rounded-xl bg-red-600"
      >
        {{ scanner.cameraError }}
      </div>

      <!-- komunikat -->
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

const scanner = useScannerStore()!;
const scannerKey = ref(0);
let resetTimeout: number | null = null;

function extractAttenderToken(raw: string): string | null {
  if (!raw) return null;

  if (!raw.includes("http")) return raw.trim();

  try {
    const url = new URL(raw);
    return url.searchParams.get("token")?.trim() ?? null;
  } catch {
    return null;
  }
}

const onDetect = async (result: any) => {
  if (!result?.[0]?.rawValue) return;

  const raw = result[0].rawValue;
  const token = extractAttenderToken(raw);

  if (!token) {
    scanner.message = "Nieprawidłowy kod QR.";
    scanner.messageType = "error";
  } else {
    await scanner.scanQr(token);
  }

  // 🔥 PEWNY reset kamery
  if (resetTimeout) clearTimeout(resetTimeout);

  resetTimeout = window.setTimeout(() => {
    scanner.clearMessage();
    scannerKey.value++; // ⬅️ restart qrcode-stream
    resetTimeout = null;
  }, 3000);
};

const onInit = async (promise: Promise<void>) => {
  try {
    await promise;
    scanner.cameraError = "";
  } catch {
    scanner.cameraError = "Nie udało się uzyskać dostępu do kamery.";
  }
};
</script>
