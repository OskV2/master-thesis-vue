<template>
  <SortingAlgorithmView :generate-steps="mergeSortSteps" />
</template>

<script setup>
import { mergeSortSteps } from "@/lib/algorithms/mergeSort";
import SortingAlgorithmView from "@/components/algorithms/SortingAlgorithmView.vue";
</script>
