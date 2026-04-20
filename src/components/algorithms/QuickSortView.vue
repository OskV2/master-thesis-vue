<template>
  <SortingAlgorithmView :generate-steps="quickSortSteps" />
</template>

<script setup>
import { quickSortSteps } from "@/lib/algorithms/quickSort";
import SortingAlgorithmView from "@/components/algorithms/SortingAlgorithmView.vue";
</script>
