<template>
  <svg
    v-if="step && step.tree && step.tree.length > 0"
    width="100%"
    :height="height"
    :viewBox="`0 0 ${svgWidth} ${height}`"
    class="rounded-xl bg-surface-light border border-slate-700/50"
  >
    <!-- Edges -->
    <line
      v-for="edge in edges"
      :key="edge.key"
      :x1="edge.from.x"
      :y1="edge.from.y"
      :x2="edge.to.x"
      :y2="edge.to.y"
      :stroke="COLORS.edge"
      stroke-width="2"
      class="transition-all duration-300 ease-in-out"
    />

    <!-- Nodes -->
    <g v-for="node in step.tree" :key="node.id">
      <circle
        :cx="nodePositions[node.id].x"
        :cy="nodePositions[node.id].y"
        :r="NODE_RADIUS"
        :fill="getNodeColor(node.id)"
        :stroke="highlighted.includes(node.id) ? COLORS.highlighted : 'transparent'"
        :stroke-width="highlighted.includes(node.id) ? 3 : 0"
        class="transition-all duration-300 ease-in-out"
      />
      <text
        :x="nodePositions[node.id].x"
        :y="nodePositions[node.id].y + 5"
        text-anchor="middle"
        font-size="13"
        font-family="'JetBrains Mono', monospace"
        font-weight="700"
        :fill="COLORS.text"
        class="transition-all duration-300 ease-in-out"
      >
        {{ node.value }}
      </text>
    </g>
  </svg>
  <svg
    v-else
    width="100%"
    :height="height"
    :viewBox="`0 0 600 ${height}`"
    class="rounded-xl bg-surface-light border border-slate-700/50"
  >
    <text
      x="300"
      :y="height / 2"
      text-anchor="middle"
      fill="#64748b"
      font-size="14"
      font-family="'JetBrains Mono', monospace"
    >
      Drzewo puste
    </text>
  </svg>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  step: { type: Object, default: null },
  height: { type: Number, default: 450 },
});

const COLORS = {
  node: "#3b82f6",
  highlighted: "#f59e0b",
  path: "#6366f1",
  found: "#10b981",
  edge: "#475569",
  text: "#f1f5f9",
};

const NODE_RADIUS = 22;

const tree = computed(() => props.step?.tree ?? []);
const highlighted = computed(() => props.step?.highlighted ?? []);
const path = computed(() => props.step?.path ?? []);

const paddingX = 40;
const paddingY = 50;

const maxDepth = computed(() => {
  if (tree.value.length === 0) return 0;
  return Math.max(...tree.value.map((n) => n.depth));
});

const svgWidth = computed(() => {
  return Math.max(tree.value.length * (NODE_RADIUS * 2 + 10) + paddingX * 2, 600);
});

const levelHeight = computed(() => {
  return Math.min(
    (props.height - paddingY * 2) / (maxDepth.value + 1),
    80
  );
});

const xStep = computed(() => {
  return (svgWidth.value - paddingX * 2) / (tree.value.length + 1);
});

const nodePositions = computed(() => {
  const positions = {};
  tree.value.forEach((node) => {
    const x = paddingX + (node.inOrderPos + 1) * xStep.value;
    const y = paddingY + node.depth * levelHeight.value + NODE_RADIUS;
    positions[node.id] = { x, y, ...node };
  });
  return positions;
});

const edges = computed(() => {
  const result = [];
  tree.value.forEach((node) => {
    const from = nodePositions.value[node.id];
    if (node.leftId != null && nodePositions.value[node.leftId]) {
      const to = nodePositions.value[node.leftId];
      result.push({ from, to, key: `${node.id}-${node.leftId}` });
    }
    if (node.rightId != null && nodePositions.value[node.rightId]) {
      const to = nodePositions.value[node.rightId];
      result.push({ from, to, key: `${node.id}-${node.rightId}` });
    }
  });
  return result;
});

function getNodeColor(nodeId) {
  if (highlighted.value.includes(nodeId)) {
    const type = props.step?.type ?? "";
    if (type.includes("place") || type.includes("found") || type.includes("done")) {
      return COLORS.found;
    }
    return COLORS.highlighted;
  }
  if (path.value.includes(nodeId)) return COLORS.path;
  return COLORS.node;
}
</script>
