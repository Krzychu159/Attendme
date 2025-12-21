<template>
  <div
    class="flex flex-col gap-2 border rounded-lg p-4 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
  >
    <div
      class="text-xs w-fit px-3 py-[2px] rounded-xl font-bold uppercase"
      :class="{
        'bg-blue-500 text-white': new Date(course.dateEnd) >= new Date(),
        'bg-gray-200 text-gray-800': new Date(course.dateEnd) < new Date(),
      }"
    >
      {{
        new Date(course.dateStart).toLocaleDateString("pl-PL", {
          weekday: "long",
        })
      }}
      {{
        new Date(course.dateStart).toLocaleTimeString("pl-PL", {
          hour: "2-digit",
          minute: "2-digit",
        })
      }}
      –
      {{
        new Date(course.dateEnd).toLocaleTimeString("pl-PL", {
          hour: "2-digit",
          minute: "2-digit",
        })
      }}
    </div>

    <div class="flex justify-between">
      <h2 class="font-semibold text-lg">{{ course.courseName }}</h2>
      <p class="text-gray-500 text-sm">{{ course.locationName }}</p>
    </div>

    <p class="text-gray-500 text-sm">
      {{ course.courseGroupName }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  course: any;
}>();
</script>
