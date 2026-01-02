<template>
  <div
    class="flex flex-col bg-gray-100 p-4 rounded-lg gap-4 border border-gray-300 my-5"
  >
    <h2>Filtry</h2>

    <div class="flex justify-between gap-4 w-full">
      <select v-model="range">
        <option value="today">Dziś</option>
        <option value="week">Bieżący tydzień</option>
        <option value="month">Bieżący miesiąc</option>
        <option value="future">Przyszłe</option>
        <option value="all">Wszystkie</option>
        <option value="past">Minione</option>
      </select>

      <input
        v-model="query"
        type="text"
        placeholder="Przedmiot, sala"
        class="md:w-fit w-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

type FiltersStore = {
  filters: {
    range: string;
    query: string;
  };
  setFilters: (filters: Partial<{ range: string; query: string }>) => void;
};

const props = defineProps<{
  store: FiltersStore;
}>();

const range = ref(props.store.filters.range);
const query = ref(props.store.filters.query);

watch([range, query], ([newRange, newQuery]) => {
  props.store.setFilters({
    range: newRange,
    query: newQuery,
  });
});
</script>
