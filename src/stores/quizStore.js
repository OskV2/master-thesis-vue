import { defineStore } from "pinia";

export const useQuizStore = defineStore("quiz", {
  state: () => ({
    isActive: false,
    currentQuestionIndex: 0,
    questions: [],
    answers: [],
    score: null,
    selectedAlgorithms: [],
    questionCount: 10,
  }),

  actions: {
    setSelectedAlgorithms(algorithms) {
      this.selectedAlgorithms = algorithms;
    },
    setQuestionCount(count) {
      this.questionCount = count;
    },
    startQuiz(questions) {
      this.isActive = true;
      this.questions = questions;
      this.answers = new Array(questions.length).fill(null);
      this.currentQuestionIndex = 0;
      this.score = null;
    },
    answerQuestion(questionIndex, answer) {
      this.answers[questionIndex] = answer;
    },
    nextQuestion() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      }
    },
    prevQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
      }
    },
    goToQuestion(index) {
      this.currentQuestionIndex = index;
    },
    finishQuiz() {
      let correct = 0;
      this.questions.forEach((q, i) => {
        if (this.answers[i] === q.correctAnswer) correct++;
      });
      this.isActive = false;
      this.score = {
        correct,
        total: this.questions.length,
        percentage: Math.round((correct / this.questions.length) * 100),
      };
    },
    resetQuiz() {
      this.isActive = false;
      this.currentQuestionIndex = 0;
      this.questions = [];
      this.answers = [];
      this.score = null;
    },
  },
});
