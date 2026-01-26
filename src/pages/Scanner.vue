<template>
  <div class="flex flex-col gap-8 p-8 items-center">
    <img src="/logo-noname.png" alt="Logo" class="w-32 mx-auto" />

    <div
      class="relative w-full max-w-md aspect-square bg-black rounded-xl overflow-hidden"
    >
      <qrcode-stream
        :paused="paused"
        :constraints="{ facingMode: 'environment' }"
        @detect="onDetect"
        @camera-on="onCameraOn"
        @error="onCameraError"
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

      <div
        v-if="scanner.loading"
        class="absolute inset-0 flex items-center justify-center bg-black/40 text-white"
      >
        <div
          class="w-8 h-8 border-4 border-white/40 border-t-white rounded-full animate-spin"
        ></div>
      </div>
    </div>

    <div class="text-center text-sm">Zbliż kod QR do kamery.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import { useScannerStore } from "@/store/scanner";

const scanner = useScannerStore();
const paused = ref(false);
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

const onDetect = async (detectedCodes: any[]) => {
  if (paused.value) return;

  const raw = detectedCodes?.[0]?.rawValue;
  if (!raw) return;

  paused.value = true;

  const token = extractAttenderToken(raw);

  if (!token) {
    scanner.message = "Nieprawidłowy kod QR.";
    scanner.messageType = "error";
  } else {
    await scanner.scanQr(token);
  }

  if (resetTimeout) clearTimeout(resetTimeout);

  resetTimeout = window.setTimeout(() => {
    scanner.clearMessage();
    paused.value = false;
    resetTimeout = null;
  }, 3000);
};

const onCameraOn = async (
  capabilitiesPromise: Promise<MediaTrackCapabilities>
) => {
  try {
    await capabilitiesPromise;
    scanner.cameraError = "";
  } catch {
    scanner.cameraError = "Nie udało się uruchomić kamery.";
  }
};

const onCameraError = () => {
  scanner.cameraError = "Nie udało się uzyskać dostępu do kamery.";
};

onUnmounted(() => {
  if (resetTimeout) clearTimeout(resetTimeout);
});
</script>
