<template>
  <template v-if="step">
    <!-- LPS Phase -->
    <svg
      v-if="isLpsPhase"
      width="100%"
      :height="height"
      :viewBox="`0 0 ${svgWidth} ${height}`"
      class="rounded-xl bg-surface-light border border-slate-700/50"
    >
      <!-- Title -->
      <text x="20" y="30" :fill="COLORS.textChar" font-size="14" font-family="'JetBrains Mono', monospace" font-weight="600">
        Budowanie tablicy LPS
      </text>

      <!-- Pattern characters -->
      <g v-for="(char, i) in pattern.split('')" :key="'pat-' + i">
        <rect
          :x="20 + i * (CELL_SIZE + CELL_GAP)"
          y="50"
          :width="CELL_SIZE"
          :height="CELL_SIZE"
          rx="4"
          :fill="getLpsCharColor(i)"
          class="transition-all duration-200 ease-in-out"
        />
        <text
          :x="20 + i * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2"
          :y="50 + CELL_SIZE / 2 + 5"
          text-anchor="middle"
          :font-size="FONT_SIZE"
          font-family="'JetBrains Mono', monospace"
          font-weight="600"
          :fill="COLORS.textChar"
        >
          {{ char }}
        </text>
        <!-- Index -->
        <text
          :x="20 + i * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2"
          y="48"
          text-anchor="middle"
          font-size="9"
          font-family="'JetBrains Mono', monospace"
          fill="#64748b"
        >
          {{ i }}
        </text>
      </g>

      <!-- LPS values -->
      <text x="20" y="115" fill="#64748b" font-size="11" font-family="'JetBrains Mono', monospace">
        LPS:
      </text>
      <g v-for="(val, i) in lps" :key="'lps-' + i">
        <rect
          :x="20 + i * (CELL_SIZE + CELL_GAP)"
          y="125"
          :width="CELL_SIZE"
          height="24"
          rx="3"
          :fill="COLORS.lpsBg"
          stroke="#475569"
          stroke-width="1"
        />
        <text
          :x="20 + i * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2"
          y="141"
          text-anchor="middle"
          font-size="11"
          font-family="'JetBrains Mono', monospace"
          font-weight="600"
          fill="#94a3b8"
        >
          {{ val }}
        </text>
      </g>
    </svg>

    <!-- Search Phase -->
    <svg
      v-else
      width="100%"
      :height="height"
      :viewBox="`0 0 ${svgWidth} ${height}`"
      class="rounded-xl bg-surface-light border border-slate-700/50"
    >
      <!-- Title -->
      <text x="20" y="30" :fill="COLORS.textChar" font-size="14" font-family="'JetBrains Mono', monospace" font-weight="600">
        Wyszukiwanie wzorca
      </text>

      <!-- Text row -->
      <text x="20" y="52" fill="#64748b" font-size="10" font-family="'JetBrains Mono', monospace">
        Tekst:
      </text>
      <g v-for="(char, i) in text.split('')" :key="'text-' + i">
        <rect
          :x="20 + i * (CELL_SIZE + CELL_GAP)"
          y="58"
          :width="CELL_SIZE"
          :height="CELL_SIZE"
          rx="4"
          :fill="getTextCharColor(i)"
          class="transition-all duration-200 ease-in-out"
        />
        <text
          :x="20 + i * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2"
          :y="58 + CELL_SIZE / 2 + 5"
          text-anchor="middle"
          :font-size="FONT_SIZE"
          font-family="'JetBrains Mono', monospace"
          font-weight="600"
          :fill="COLORS.textChar"
        >
          {{ char }}
        </text>
        <text
          :x="20 + i * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2"
          y="56"
          text-anchor="middle"
          font-size="9"
          font-family="'JetBrains Mono', monospace"
          fill="#64748b"
        >
          {{ i }}
        </text>
      </g>

      <!-- Pattern row — offset under text -->
      <text x="20" y="115" fill="#64748b" font-size="10" font-family="'JetBrains Mono', monospace">
        Wzorzec:
      </text>
      <template v-for="(char, j) in pattern.split('')" :key="'pat-' + j">
        <g v-if="20 + (patternOffset + j) * (CELL_SIZE + CELL_GAP) >= 0">
          <rect
            :x="20 + (patternOffset + j) * (CELL_SIZE + CELL_GAP)"
            y="120"
            :width="CELL_SIZE"
            :height="CELL_SIZE"
            rx="4"
            :fill="getPatternCharColor(j)"
            class="transition-all duration-200 ease-in-out"
          />
          <text
            :x="20 + (patternOffset + j) * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2"
            :y="120 + CELL_SIZE / 2 + 5"
            text-anchor="middle"
            :font-size="FONT_SIZE"
            font-family="'JetBrains Mono', monospace"
            font-weight="600"
            :fill="COLORS.textChar"
          >
            {{ char }}
          </text>
        </g>
      </template>

      <!-- LPS table at bottom -->
      <text x="20" y="185" fill="#64748b" font-size="11" font-family="'JetBrains Mono', monospace">
        LPS: [{{ lps.join(', ') }}]
      </text>

      <!-- Matches found -->
      <text
        v-if="matches.length > 0"
        x="20"
        y="210"
        :fill="COLORS.found"
        font-size="12"
        font-family="'JetBrains Mono', monospace"
        font-weight="600"
      >
        Znaleziono na pozycjach: [{{ matches.join(', ') }}]
      </text>
    </svg>
  </template>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  step: { type: Object, default: null },
  height: { type: Number, default: 350 },
});

const COLORS = {
  default: "#334155",
  textChar: "#f1f5f9",
  comparing: "#f59e0b",
  match: "#10b981",
  mismatch: "#ef4444",
  found: "#10b981",
  patternBg: "#1e3a5f",
  lpsBg: "#1e293b",
};

const CELL_SIZE = 32;
const CELL_GAP = 2;
const FONT_SIZE = 13;

const isLpsPhase = computed(() => props.step?.type?.startsWith("lps"));

const text = computed(() => props.step?.text ?? "");
const pattern = computed(() => props.step?.pattern ?? "");
const lps = computed(() => props.step?.lps ?? []);

const svgWidth = computed(() => {
  const totalChars = Math.max(text.value.length, pattern.value.length, 1);
  return Math.max(totalChars * (CELL_SIZE + CELL_GAP) + 60, 400);
});

// LPS phase colors
function getLpsCharColor(i) {
  const s = props.step;
  const isActive = s.i === i;
  const isLen = s.len === i;
  if (isActive && isLen) return COLORS.found;
  if (isActive) return COLORS.comparing;
  if (isLen) return COLORS.patternBg;
  return COLORS.default;
}

// Search phase
const textIndex = computed(() => props.step?.textIndex ?? 0);
const patternIndex = computed(() => props.step?.patternIndex ?? 0);
const matches = computed(() => props.step?.matches ?? []);
const patternOffset = computed(() => textIndex.value - patternIndex.value);

function getTextCharColor(i) {
  for (const mStart of matches.value) {
    if (i >= mStart && i < mStart + pattern.value.length) return COLORS.found;
  }
  if (i === textIndex.value) return COLORS.comparing;
  return COLORS.default;
}

function getPatternCharColor(j) {
  const s = props.step;
  if (j === patternIndex.value && s.type === "search-compare") return COLORS.comparing;
  if (j === patternIndex.value && s.type === "search-match") return COLORS.match;
  if (j < patternIndex.value) return "#1a4a2e";
  return COLORS.patternBg;
}
</script>
