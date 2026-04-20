<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Setup -->
    <template v-if="!quizStore.isActive && !quizStore.score">
      <div class="max-w-xl mx-auto">
        <div class="text-center mb-8">
          <div class="w-14 h-14 rounded-2xl bg-primary-600/20 flex items-center justify-center mx-auto mb-4">
            <FlaskConical :size="28" class="text-primary-400" />
          </div>
          <h1 class="text-2xl font-bold text-white font-display">Test wiedzy</h1>
          <p class="text-slate-400 mt-2">
            Sprawdź swoją znajomość algorytmów i struktur danych.
          </p>
        </div>

        <div class="bg-surface-light border border-slate-700/50 rounded-xl p-5 mb-6">
          <h2 class="font-semibold text-slate-200 mb-3">Wybierz zakres testu</h2>
          <div class="grid gap-2">
            <label
              v-for="algo in ALGORITHMS"
              :key="algo.id"
              :class="[
                'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
                selected.includes(algo.id)
                  ? 'bg-primary-600/10 border border-primary-500/30'
                  : 'bg-surface-lighter/30 border border-transparent hover:border-slate-600',
              ]"
            >
              <input
                type="checkbox"
                :checked="selected.includes(algo.id)"
                @change="toggle(algo.id)"
                class="accent-primary-500"
              />
              <div class="flex-1">
                <span class="text-sm text-slate-200">{{ algo.name }}</span>
                <span class="text-xs text-slate-500 ml-2">{{ algo.nameEn }}</span>
              </div>
              <span class="text-xs text-slate-500">
                {{ allQuestions.filter((q) => q.algorithmId === algo.id).length }} pyt.
              </span>
            </label>
          </div>
        </div>

        <button
          @click="handleStart"
          :disabled="selected.length === 0 || questionCount === 0"
          class="w-full py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Rozpocznij test ({{ questionCount }}
          {{ questionCount === 1 ? 'pytanie' : questionCount < 5 ? 'pytania' : 'pytań' }})
        </button>
      </div>
    </template>

    <!-- Question -->
    <template v-else-if="quizStore.isActive">
      <div class="max-w-2xl mx-auto">
        <!-- Progress -->
        <div class="mb-6">
          <div class="flex items-center justify-between text-sm text-slate-400 mb-2">
            <span>Pytanie {{ quizStore.currentQuestionIndex + 1 }} z {{ quizStore.questions.length }}</span>
            <span>{{ quizStore.answers.filter((a) => a !== null).length }} / {{ quizStore.questions.length }} odpowiedzi</span>
          </div>
          <div class="h-1.5 bg-surface-light rounded-full overflow-hidden">
            <div
              class="h-full bg-primary-500 rounded-full transition-all duration-300"
              :style="{ width: ((quizStore.currentQuestionIndex + 1) / quizStore.questions.length) * 100 + '%' }"
            />
          </div>
        </div>

        <!-- Question card -->
        <div class="bg-surface-light border border-slate-700/50 rounded-xl p-6 mb-4">
          <p class="text-slate-100 font-medium text-base leading-relaxed mb-6">
            {{ currentQuestion.question }}
          </p>

          <div class="grid gap-2">
            <button
              v-for="(option, i) in currentQuestion.options"
              :key="option"
              @click="quizStore.answerQuestion(quizStore.currentQuestionIndex, option)"
              :class="[
                'w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg border transition-all',
                currentAnswer === option
                  ? 'border-primary-500 bg-primary-600/15 text-slate-100'
                  : 'border-slate-700/50 bg-surface-lighter/20 text-slate-300 hover:border-slate-500 hover:bg-surface-lighter/40',
              ]"
            >
              <span
                :class="[
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors',
                  currentAnswer === option
                    ? 'bg-primary-600 text-white'
                    : 'bg-surface-lighter text-slate-400',
                ]"
              >
                {{ OPTION_LETTERS[i] }}
              </span>
              <span class="text-sm">{{ option }}</span>
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex gap-3">
          <button
            @click="quizStore.prevQuestion()"
            :disabled="quizStore.currentQuestionIndex === 0"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-light border border-slate-700/50 text-slate-300 hover:bg-surface-lighter hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft :size="16" />
            Wstecz
          </button>

          <div class="flex-1" />

          <button
            v-if="isLast"
            @click="quizStore.finishQuiz()"
            :disabled="!allAnswered"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Zakończ test
            <CheckCircle2 :size="16" />
          </button>
          <button
            v-else
            @click="quizStore.nextQuestion()"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-colors"
          >
            Dalej
            <ChevronRight :size="16" />
          </button>
        </div>

        <!-- Question dots -->
        <div class="flex flex-wrap gap-1.5 mt-5 justify-center">
          <button
            v-for="(_, i) in quizStore.questions"
            :key="i"
            @click="quizStore.goToQuestion(i)"
            :class="[
              'w-7 h-7 rounded-full text-xs font-display transition-colors',
              i === quizStore.currentQuestionIndex
                ? 'bg-primary-600 text-white'
                : quizStore.answers[i] !== null
                  ? 'bg-emerald-700/60 text-emerald-300'
                  : 'bg-surface-light border border-slate-700/50 text-slate-500 hover:border-slate-500',
            ]"
          >
            {{ i + 1 }}
          </button>
        </div>
      </div>
    </template>

    <!-- Results -->
    <template v-else-if="!quizStore.isActive && quizStore.score">
      <div class="max-w-2xl mx-auto">
        <!-- Score summary -->
        <div class="text-center mb-8">
          <div
            :class="[
              'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4',
              passed ? 'bg-emerald-500/20' : 'bg-red-500/20',
            ]"
          >
            <CheckCircle2 v-if="passed" :size="40" class="text-emerald-400" />
            <XCircle v-else :size="40" class="text-red-400" />
          </div>
          <h2 class="text-3xl font-bold text-white font-display mb-1">
            {{ quizStore.score.percentage }}%
          </h2>
          <p class="text-slate-400">
            {{ quizStore.score.correct }} z {{ quizStore.score.total }} poprawnych odpowiedzi
          </p>
          <p class="text-sm text-slate-500 mt-1">
            {{ passed ? 'Dobra robota! Znasz te algorytmy.' : 'Spróbuj jeszcze raz — powtórka czyni mistrza!' }}
          </p>
        </div>

        <!-- Per-question breakdown -->
        <div class="space-y-3 mb-8">
          <div
            v-for="(q, i) in quizStore.questions"
            :key="q.id"
            :class="[
              'rounded-xl border p-4',
              quizStore.answers[i] === q.correctAnswer
                ? 'border-emerald-700/50 bg-emerald-900/10'
                : 'border-red-700/50 bg-red-900/10',
            ]"
          >
            <div class="flex items-start gap-3">
              <div class="shrink-0 mt-0.5">
                <CheckCircle2 v-if="quizStore.answers[i] === q.correctAnswer" :size="16" class="text-emerald-400" />
                <XCircle v-else :size="16" class="text-red-400" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-slate-200 mb-2">{{ q.question }}</p>
                <template v-if="quizStore.answers[i] !== q.correctAnswer">
                  <div class="space-y-1 text-xs">
                    <p class="text-red-400">Twoja odpowiedź: {{ quizStore.answers[i] ?? '—' }}</p>
                    <p class="text-emerald-400">Poprawna: {{ q.correctAnswer }}</p>
                  </div>
                </template>
                <template v-else>
                  <p class="text-xs text-emerald-400">{{ q.correctAnswer }}</p>
                </template>
              </div>
            </div>
          </div>
        </div>

        <button
          @click="quizStore.resetQuiz()"
          class="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-light border border-slate-700/50 text-slate-200 hover:bg-surface-lighter transition-colors"
        >
          <RotateCcw :size="16" />
          Spróbuj ponownie
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { ALGORITHMS } from "@/lib/algorithms";
import { useQuizStore } from "@/stores/quizStore";
import allQuestions from "@/data/quizQuestions.json";
import {
  FlaskConical,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
} from "lucide-vue-next";

const quizStore = useQuizStore();
const OPTION_LETTERS = ["A", "B", "C", "D"];

const selected = ref(
  quizStore.selectedAlgorithms.length > 0
    ? [...quizStore.selectedAlgorithms]
    : ALGORITHMS.map((a) => a.id)
);

const questionCount = computed(() =>
  allQuestions.filter((q) => selected.value.includes(q.algorithmId)).length
);

function toggle(id) {
  if (selected.value.includes(id)) {
    selected.value = selected.value.filter((s) => s !== id);
  } else {
    selected.value = [...selected.value, id];
  }
  quizStore.setSelectedAlgorithms(selected.value);
}

function handleStart() {
  const pool = allQuestions.filter((q) => selected.value.includes(q.algorithmId));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  quizStore.startQuiz(shuffled);
}

const currentQuestion = computed(() => quizStore.questions[quizStore.currentQuestionIndex]);
const currentAnswer = computed(() => quizStore.answers[quizStore.currentQuestionIndex]);
const isLast = computed(() => quizStore.currentQuestionIndex === quizStore.questions.length - 1);
const allAnswered = computed(() => quizStore.answers.every((a) => a !== null));
const passed = computed(() => quizStore.score?.percentage >= 60);
</script>
