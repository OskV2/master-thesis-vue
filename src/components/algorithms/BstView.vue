<template>
  <div v-if="step">
    <!-- Input -->
    <div class="bg-surface-light border border-slate-700/50 rounded-xl p-4">
      <div class="flex flex-wrap gap-2 items-end">
        <div>
          <label class="block text-xs text-slate-500 mb-1 font-display">Wartość</label>
          <input
            type="number"
            v-model="inputValue"
            @keydown.enter="runOperation('insert')"
            placeholder="np. 25"
            class="w-28 px-3 py-2 rounded-lg bg-surface text-slate-100 text-sm font-display border border-slate-600 focus:border-primary-500 focus:outline-none"
          />
        </div>
        <button
          @click="runOperation('insert')"
          class="px-4 py-2 rounded-lg text-sm bg-primary-600 text-white hover:bg-primary-500"
        >
          Wstaw
        </button>
        <button
          @click="runOperation('search')"
          class="px-4 py-2 rounded-lg text-sm bg-amber-600 text-white hover:bg-amber-500"
        >
          Szukaj
        </button>
        <button
          @click="runOperation('delete')"
          class="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-500"
        >
          Usuń
        </button>
        <button
          @click="handleReset"
          class="px-4 py-2 rounded-lg text-sm bg-surface-lighter text-slate-300 hover:text-white"
        >
          Reset
        </button>
      </div>
      <p v-if="error" class="text-xs text-red-400 mt-2">{{ error }}</p>
    </div>

    <!-- Visualization + step list -->
    <div class="mt-3 flex flex-col lg:flex-row gap-3">
      <div class="w-full lg:w-[30%] shrink-0 order-2 lg:order-1">
        <StepList
          :steps="store.steps"
          :current-step="store.currentStep"
          @step-click="store.goToStep"
          :height="450"
        />
      </div>

      <div class="flex-1 min-w-0 order-1 lg:order-2">
        <BstVisualizationSVG :step="step" :height="450" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
import { BST } from "@/lib/algorithms/bst";
import { useVisualizationStore } from "@/stores/visualizationStore";
import BstVisualizationSVG from "@/components/algorithms/BstVisualizationSVG.vue";
import StepList from "@/components/ui/StepList.vue";

const DEFAULT_VALUES = [50, 30, 70, 20, 40, 60, 80];

const store = useVisualizationStore();
let bst = null;
let timer = null;

const inputValue = ref("");
const error = ref(null);

onMounted(() => {
  const result = BST.buildFromArray(DEFAULT_VALUES);
  bst = result.bst;
  store.loadAlgorithm(DEFAULT_VALUES, result.steps);
});

// Auto-play tick
watch(
  () => [store.isPlaying, store.speed],
  ([playing, speed]) => {
    if (timer) clearInterval(timer);
    if (playing) {
      timer = setInterval(() => store.stepForward(), speed);
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

function runOperation(operation) {
  error.value = null;
  const val = Number(inputValue.value);
  if (isNaN(val) || inputValue.value.trim() === "") {
    error.value = "Wpisz liczbę.";
    return;
  }

  if (!bst) return;

  let newSteps;
  switch (operation) {
    case "insert":
      newSteps = bst.insert(val);
      break;
    case "search":
      newSteps = bst.search(val);
      break;
    case "delete":
      newSteps = bst.delete(val);
      break;
    default:
      return;
  }

  const allSteps = [...store.steps, ...newSteps];
  const prevLength = store.steps.length;
  store.loadAlgorithm(null, allSteps);
  store.goToStep(prevLength);
  inputValue.value = "";
}

function handleReset() {
  const result = BST.buildFromArray(DEFAULT_VALUES);
  bst = result.bst;
  store.loadAlgorithm(DEFAULT_VALUES, result.steps);
}

const step = computed(() => store.steps[store.currentStep]);
</script>
