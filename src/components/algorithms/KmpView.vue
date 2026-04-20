<template>
  <div v-if="step">
    <!-- Input -->
    <div class="bg-surface-light border border-slate-700/50 rounded-xl p-4 space-y-3">
      <div class="flex flex-col sm:flex-row gap-2">
        <div class="flex-1">
          <label class="block text-xs text-slate-500 mb-1 font-display">Tekst</label>
          <input
            type="text"
            :value="text"
            @input="text = $event.target.value.toUpperCase()"
            class="w-full px-3 py-2 rounded-lg bg-surface text-slate-100 text-sm font-display border border-slate-600 focus:border-primary-500 focus:outline-none"
          />
        </div>
        <div class="flex-1">
          <label class="block text-xs text-slate-500 mb-1 font-display">Wzorzec</label>
          <input
            type="text"
            :value="pattern"
            @input="pattern = $event.target.value.toUpperCase()"
            class="w-full px-3 py-2 rounded-lg bg-surface text-slate-100 text-sm font-display border border-slate-600 focus:border-primary-500 focus:outline-none"
          />
        </div>
        <div class="flex items-end">
          <button
            @click="handleSearch"
            class="px-4 py-2 rounded-lg text-sm bg-primary-600 text-white hover:bg-primary-500"
          >
            Szukaj
          </button>
        </div>
      </div>
      <p v-if="error" class="text-xs text-red-400">{{ error }}</p>
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
        <KmpVisualizationSVG :step="step" :height="450" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
import { kmpSearchSteps } from "@/lib/algorithms/kmp";
import { useVisualizationStore } from "@/stores/visualizationStore";
import KmpVisualizationSVG from "@/components/algorithms/KmpVisualizationSVG.vue";
import StepList from "@/components/ui/StepList.vue";

const DEFAULT_TEXT = "ABABDABACDABABCABAB";
const DEFAULT_PATTERN = "ABABCABAB";

const store = useVisualizationStore();

const text = ref(DEFAULT_TEXT);
const pattern = ref(DEFAULT_PATTERN);
const error = ref(null);
let timer = null;

onMounted(() => {
  const generated = kmpSearchSteps(DEFAULT_TEXT, DEFAULT_PATTERN);
  store.loadAlgorithm({ text: DEFAULT_TEXT, pattern: DEFAULT_PATTERN }, generated);
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

function handleSearch() {
  error.value = null;
  if (text.value.length === 0) { error.value = "Wpisz tekst."; return; }
  if (pattern.value.length === 0) { error.value = "Wpisz wzorzec."; return; }
  if (pattern.value.length > text.value.length) { error.value = "Wzorzec dłuższy od tekstu."; return; }

  const generated = kmpSearchSteps(text.value, pattern.value);
  store.loadAlgorithm({ text: text.value, pattern: pattern.value }, generated);
}

const step = computed(() => store.steps[store.currentStep]);
</script>
