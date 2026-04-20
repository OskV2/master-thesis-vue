<template>
  <div ref="containerRef" class="rounded-xl overflow-hidden border border-slate-700/50">
    <v-stage v-if="width > 0 && array.length > 0" :config="{ width, height }">
      <v-layer>
        <v-rect :config="{ x: 0, y: 0, width, height, fill: COLORS.background }" />

        <template v-for="(value, index) in array" :key="index">
          <!-- Glow -->
          <v-rect :config="glowConfig(index, value)" />
          <!-- Bar -->
          <v-rect :config="barConfig(index, value)" />
          <!-- Sorted dot -->
          <v-circle :config="dotConfig(index)" />
          <!-- Value text -->
          <v-text :config="textConfig(index, value)" />
        </template>
      </v-layer>
    </v-stage>
    <div v-else :style="{ height: height + 'px' }" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useContainerWidth } from "@/composables/useContainerWidth";

const props = defineProps({
  array: { type: Array, default: () => [] },
  comparing: { type: Array, default: () => [] },
  sorted: { type: Array, default: () => [] },
  height: { type: Number, default: 300 },
});

const COLORS = {
  default: "#3b82f6",
  comparing: "#f59e0b",
  sorted: "#10b981",
  text: "#f1f5f9",
  background: "#1e293b",
};

const FONT = "'JetBrains Mono', monospace";

const { containerRef, width } = useContainerWidth();

const padding = 20;
const gap = 2;

const n = computed(() => props.array.length);
const maxVal = computed(() => (n.value > 0 ? Math.max(...props.array) : 1));
const usableWidth = computed(() => width.value - padding * 2);
const usableHeight = computed(() => props.height - padding * 2);
const barWidth = computed(() =>
  n.value > 0 ? (usableWidth.value - gap * (n.value - 1)) / n.value : 0
);

function getBarX(index) {
  return padding + index * (barWidth.value + gap);
}

function getBarHeight(value) {
  return (value / maxVal.value) * usableHeight.value;
}

function getBarY(value) {
  return props.height - padding - getBarHeight(value);
}

function getTextY(value) {
  const barH = getBarHeight(value);
  return barH > 24 ? getBarY(value) + 5 : getBarY(value) - 18;
}

function getBarColor(index) {
  if (props.sorted.includes(index)) return COLORS.sorted;
  if (props.comparing.includes(index)) return COLORS.comparing;
  return COLORS.default;
}

function glowConfig(index, value) {
  return {
    x: getBarX(index) - 2,
    y: getBarY(value) - 2,
    width: barWidth.value + 4,
    height: getBarHeight(value) + 4,
    cornerRadius: 4,
    stroke: COLORS.comparing,
    strokeWidth: 2,
    opacity: props.comparing.includes(index) ? 0.8 : 0,
  };
}

function barConfig(index, value) {
  return {
    x: getBarX(index),
    y: getBarY(value),
    width: barWidth.value,
    height: getBarHeight(value),
    cornerRadius: 2,
    fill: getBarColor(index),
  };
}

function dotConfig(index) {
  const isSorted = props.sorted.includes(index);
  return {
    x: getBarX(index) + barWidth.value / 2,
    y: props.height - padding + 12,
    radius: 4,
    fill: COLORS.sorted,
    scaleX: isSorted ? 1 : 0,
    scaleY: isSorted ? 1 : 0,
    opacity: isSorted ? 1 : 0,
  };
}

function textConfig(index, value) {
  return {
    x: getBarX(index),
    y: getTextY(value),
    text: String(value),
    width: barWidth.value,
    fontSize: Math.min(barWidth.value * 0.5, 14),
    fontFamily: FONT,
    fontStyle: "600",
    fill: COLORS.text,
    align: "center",
  };
}
</script>