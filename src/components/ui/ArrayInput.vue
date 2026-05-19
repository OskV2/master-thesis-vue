<template>
  <div class="bg-surface-light border border-slate-700/50 rounded-xl p-4 space-y-3">
    <label class="block text-sm text-slate-300 font-medium">
      Tablica do sortowania
    </label>

    <div class="flex gap-2">
      <input
        type="text"
        v-model="text"
        @keydown.enter="handleSubmit"
        placeholder="np. 38, 12, 45, 7, 23"
        class="flex-1 px-3 py-2 rounded-lg bg-surface text-slate-100 text-sm font-display border border-slate-600 focus:border-primary-500 focus:outline-none placeholder:text-slate-600"
      />
      <button
        @click="handleSubmit"
        class="px-4 py-2 rounded-lg text-sm bg-primary-600 text-white hover:bg-primary-500"
      >
        Sortuj
      </button>
      <button
        @click="handleRandom"
        class="px-4 py-2 rounded-lg text-sm bg-surface-lighter text-slate-300 hover:text-white"
      >
        Losuj
      </button>
    </div>

    <p v-if="error" class="text-xs text-red-400">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  defaultSize: { type: Number, default: 10 },
  maxSize: { type: Number, default: 100 },
  maxValue: { type: Number, default: 200 },
});

const emit = defineEmits(["submit"]);

const text = ref("");
const error = ref(null);

function handleSubmit() {
  error.value = null;

  const parts = text.value
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (parts.length === 0) {
    error.value = "Wpisz przynajmniej 2 liczby.";
    return;
  }

  const numbers = parts.map(Number);

  if (numbers.some((n) => isNaN(n))) {
    error.value = "Wszystkie wartości muszą być liczbami.";
    return;
  }

  if (numbers.length < 2) {
    error.value = "Potrzeba przynajmniej 2 elementów.";
    return;
  }

  if (numbers.length > props.maxSize) {
    error.value = `Maksymalnie ${props.maxSize} elementów.`;
    return;
  }

  emit("submit", numbers);
}

function handleRandom() {
  error.value = null;
  const arr = Array.from({ length: props.defaultSize }, () =>
    Math.floor(Math.random() * props.maxValue) + 1
  );
  text.value = arr.join(", ");
  emit("submit", arr);
}
</script>
