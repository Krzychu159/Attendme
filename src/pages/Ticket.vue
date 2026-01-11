<template>
  <div class="flex flex-col gap-4 items-center min-h-screen p-8" v-if="success">
    <img src="/logo.jpg" alt="Logo" class="w-32 mx-auto mb:mb-4" />

    <h2 class="text-xs">
      Aby zarejestorwać obecność umieść telefon w polu widzenia skanera. W razie
      wątpliwości poproś osobę prowadzącą zajęcia o pomoc.
    </h2>
    <QRCodeVue
      v-if="attendance.ticket"
      :value="attendance.ticket"
      :size="220"
      level="M"
    />
  </div>
  <div class="flex flex-col gap-4 items-center min-h-screen p-8" v-else="">
    <img src="/logo.jpg" alt="Logo" class="w-32 mx-auto mb:mb-4" />
    <div class="bg-red-200 border border-red-500 p-3 rounded-xl">
      <span class="font-bold">To urządzenie nie zostało zarejestrowane.</span>
      Aby skanować obecność skontaktuj się z wykładowcą lub administratorem
      systemu.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useAttendanceStore } from "@/store/attendance";
import QRCodeVue from "qrcode.vue";

const success = ref(false);
const attendance = useAttendanceStore();

onMounted(() => {
  if (attendance.isDeviceRegistered) {
    attendance.startTicketPolling();
  }
});

onUnmounted(() => {
  attendance.stopTicketPolling();
});

onMounted(() => {
  const token = localStorage.getItem("deviceToken");

  success.value = !!token;
});
</script>
