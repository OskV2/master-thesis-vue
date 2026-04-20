<template>
  <div v-if="step">
    <ArrayInput @submit="handleNewArray" />

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
        <SortingBarsSVG
          v-if="store.renderMode === 'svg'"
          :array="step.array"
          :comparing="step.comparing ?? []"
          :sorted="sortedIndices"
          :height="450"
        />
        <SortingBarsCanvas
          v-else
          :array="step.array"
          :comparing="step.comparing ?? []"
          :sorted="sortedIndices"
          :height="450"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch, onUnmounted, ref } from "vue";
import { useVisualizationStore } from "@/stores/visualizationStore";
import SortingBarsSVG from "@/components/algorithms/SortingBarsSVG.vue";
import SortingBarsCanvas from "@/components/algorithms/SortingBarsCanvas.vue";
import ArrayInput from "@/components/ui/ArrayInput.vue";
import StepList from "@/components/ui/StepList.vue";

const props = defineProps({
  generateSteps: { type: Function, required: true },
  defaultArray: {
    type: Array,
    default: () => [38, 12, 45, 7, 23, 56, 31, 18, 42, 9],
  },
});

const store = useVisualizationStore();
let timer = null;

onMounted(() => {
  const generated = props.generateSteps(props.defaultArray);
  store.loadAlgorithm(props.defaultArray, generated);
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

function handleNewArray(arr) {
  const generated = props.generateSteps(arr);
  store.loadAlgorithm(arr, generated);
}

const step = computed(() => store.steps[store.currentStep]);

const sortedIndices = computed(() => {
  if (!step.value) return [];
  const s = step.value;
  if (s.sorted) {
    return Array.isArray(s.sorted) ? s.sorted : [...s.sorted];
  }
  return s.merging ?? [];
});
</script>
