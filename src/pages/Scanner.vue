<template>
  <div class="flex flex-col gap-8 p-8 overflow-hidden items-center">
    <img src="/logo-noname.png" alt="Logo" class="w-32 mx-auto my-16" />

    <div class="w-full max-w-md mx-auto">
      <qrcode-stream></qrcode-stream>
    </div>

    <div>
      Aby zarejestorwać obecność umieść telefon w polu widzenia skanera. W razie
      wątpliwości poproś osobę prowadzącą zajęcia o pomoc.
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();
const token = route.query.token as string;
</script>
