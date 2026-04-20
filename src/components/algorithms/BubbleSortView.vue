<template>
  <SortingAlgorithmView :generate-steps="bubbleSortSteps" />
</template>

<script setup>
import { bubbleSortSteps } from "@/lib/algorithms/bubbleSort";
import SortingAlgorithmView from "@/components/algorithms/SortingAlgorithmView.vue";
</script>
