<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <template v-if="algorithm">
      <!-- Breadcrumb / Back -->
      <router-link
        to="/"
        class="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-primary-400 transition-colors mb-6"
      >
        <ArrowLeft :size="16" />
        Wszystkie algorytmy
      </router-link>

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl font-bold text-white font-display">
            {{ algorithm.name }}
          </h1>
          <p class="text-sm text-slate-500 font-display mt-1">
            {{ algorithm.nameEn }}
          </p>
        </div>
        <RenderModeToggle />
      </div>

      <!-- Complexity info -->
      <div class="flex flex-wrap gap-3 mb-6">
        <div
          v-for="(val, key) in algorithm.complexity.time"
          :key="key"
          class="px-3 py-1.5 rounded-lg bg-surface-light border border-slate-700/50 text-xs font-display"
        >
          <span class="text-slate-500 capitalize">{{ key }}: </span>
          <span class="text-primary-400">{{ val }}</span>
        </div>
        <div class="px-3 py-1.5 rounded-lg bg-surface-light border border-slate-700/50 text-xs font-display">
          <span class="text-slate-500">Pamięć: </span>
          <span class="text-primary-400">{{ algorithm.complexity.space }}</span>
        </div>
      </div>

      <!-- Visualization area -->
      <BubbleSortView v-if="slug === 'bubble-sort'" />
      <QuickSortView v-else-if="slug === 'quicksort'" />
      <MergeSortView v-else-if="slug === 'merge-sort'" />
      <KmpView v-else-if="slug === 'kmp'" />
      <BstView v-else-if="slug === 'bst'" />

      <!-- Playback controls -->
      <div class="mt-4">
        <PlaybackControls />
      </div>

      <!-- Description -->
      <div class="mt-8 p-5 rounded-xl bg-surface-light border border-slate-700/50">
        <div class="flex items-center gap-2 mb-3">
          <Info :size="16" class="text-primary-400" />
          <h2 class="font-semibold text-slate-200">Opis algorytmu</h2>
        </div>
        <p class="text-sm text-slate-400 leading-relaxed">
          {{ algorithm.description }}
        </p>
      </div>
    </template>

    <template v-else>
      <div class="text-center py-12">
        <p class="text-slate-400">Nie znaleziono algorytmu.</p>
        <router-link to="/" class="text-primary-400 hover:underline mt-2 inline-block">
          Wróć do listy
        </router-link>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { getAlgorithmBySlug } from "@/lib/algorithms";
import PlaybackControls from "@/components/ui/PlaybackControls.vue";
import RenderModeToggle from "@/components/ui/RenderModeToggle.vue";
import BubbleSortView from "@/components/algorithms/BubbleSortView.vue";
import QuickSortView from "@/components/algorithms/QuickSortView.vue";
import MergeSortView from "@/components/algorithms/MergeSortView.vue";
import KmpView from "@/components/algorithms/KmpView.vue";
import BstView from "@/components/algorithms/BstView.vue";
import { ArrowLeft, Info } from "lucide-vue-next";

const route = useRoute();
const slug = computed(() => route.params.slug);
const algorithm = computed(() => getAlgorithmBySlug(slug.value));
</script>
