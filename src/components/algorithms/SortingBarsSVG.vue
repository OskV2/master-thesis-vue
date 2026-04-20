<template>
  <svg
    v-if="array.length > 0"
    width="100%"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    class="rounded-xl bg-surface-light border border-slate-700/50"
  >
    <g v-for="(value, index) in array" :key="index">
      <!-- Animated bar -->
      <rect
        :x="getBarX(index)"
        :y="getBarY(value)"
        :width="barWidth"
        :height="getBarHeight(value)"
        :fill="getBarColor(index)"
        rx="2"
        class="transition-all duration-250 ease-in-out"
      />

      <!-- Glow effect when comparing -->
      <rect
        v-if="comparing.includes(index)"
        :x="getBarX(index) - 2"
        :y="getBarY(value) - 2"
        :width="barWidth + 4"
        :height="getBarHeight(value) + 4"
        rx="4"
        fill="none"
        :stroke="COLORS.comparing"
        stroke-width="2"
        class="animate-pulse"
      />

      <!-- Dot indicator when sorted -->
      <circle
        v-if="sorted.includes(index)"
        :cx="getBarX(index) + barWidth / 2"
        :cy="height - padding + 12"
        r="4"
        :fill="COLORS.sorted"
        class="transition-all duration-250 ease-in-out"
      />

      <!-- Value label -->
      <text
        :x="getBarX(index) + barWidth / 2"
        :y="getTextY(value)"
        text-anchor="middle"
        :font-size="Math.min(barWidth * 0.5, 14)"
        font-family="'JetBrains Mono', monospace"
        font-weight="600"
        :fill="COLORS.text"
        class="transition-all duration-250 ease-in-out"
      >
        {{ value }}
      </text>
    </g>
  </svg>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  array: { type: Array, default: () => [] },
  comparing: { type: Array, default: () => [] },
  sorted: { type: Array, default: () => [] },
  width: { type: Number, default: 600 },
  height: { type: Number, default: 300 },
});

const COLORS = {
  default: "#3b82f6",
  comparing: "#f59e0b",
  sorted: "#10b981",
  text: "#f1f5f9",
};

const padding = 20;

const n = computed(() => props.array.length);
const maxVal = computed(() => (n.value > 0 ? Math.max(...props.array) : 1));
const usableWidth = computed(() => props.width - padding * 2);
const usableHeight = computed(() => props.height - padding * 2);
const gap = 2;
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
  return barH > 24 ? getBarY(value) + 18 : getBarY(value) - 6;
}

function getBarColor(index) {
  if (props.sorted.includes(index)) return COLORS.sorted;
  if (props.comparing.includes(index)) return COLORS.comparing;
  return COLORS.default;
}
</script>
