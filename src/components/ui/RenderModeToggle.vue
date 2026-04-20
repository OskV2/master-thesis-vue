<template>
  <div class="inline-flex items-center bg-surface-light border border-slate-700/50 rounded-lg p-1">
    <button
      v-for="mode in ['svg', 'canvas']"
      :key="mode"
      @click="store.setRenderMode(mode)"
      :class="[
        'px-3 py-1.5 rounded-md text-xs font-display font-medium uppercase tracking-wide transition-colors',
        store.renderMode === mode
          ? 'bg-primary-600/20 text-primary-400'
          : 'text-slate-500 hover:text-slate-300',
      ]"
    >
      {{ mode }}
    </button>
  </div>
</template>

<script setup>
import { useVisualizationStore } from "@/stores/visualizationStore";
const store = useVisualizationStore();
</script>
