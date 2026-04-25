<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navigation -->
    <header class="border-b border-slate-700/50 bg-surface-light/80 backdrop-blur-sm sticky top-0 z-50">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-3 group">
          <div class="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center font-display font-bold text-sm text-white group-hover:bg-primary-500 transition-colors">
            AV
          </div>
          <span class="font-display font-semibold text-lg text-slate-100">
            AlgoViz
          </span>
        </router-link>

        <div class="flex items-center gap-1">
          <router-link
            to="/"
            class="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-surface-lighter/50 transition-colors flex items-center gap-2"
            active-class="!text-white !bg-surface-lighter"
            :exact="true"
          >
            <BookOpen :size="16" />
            Algorytmy
          </router-link>
          <router-link
            to="/quiz"
            class="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-surface-lighter/50 transition-colors flex items-center gap-2"
            active-class="!text-white !bg-surface-lighter"
          >
            <FlaskConical :size="16" />
            Testy
          </router-link>
        </div>
      </nav>
    </header>

    <!-- Page content -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-700/50 py-6 text-center text-sm text-slate-500">
      <p>
        Maciej Buszkiewicz, Praca magisterska
      </p>
    </footer>
  </div>
</template>

<script setup>
import { BookOpen, FlaskConical } from "lucide-vue-next";
</script>
