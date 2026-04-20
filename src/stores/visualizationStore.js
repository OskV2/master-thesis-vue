import { defineStore } from "pinia";

export const useVisualizationStore = defineStore("visualization", {
  state: () => ({
    isPlaying: false,
    speed: 500,
    currentStep: 0,
    totalSteps: 0,
    inputData: [],
    steps: [],
    renderMode: "svg",
  }),

  actions: {
    play() {
      this.isPlaying = true;
    },
    pause() {
      this.isPlaying = false;
    },
    togglePlay() {
      if (!this.isPlaying && this.currentStep >= this.totalSteps - 1) return;
      this.isPlaying = !this.isPlaying;
    },
    reset() {
      this.isPlaying = false;
      this.currentStep = 0;
    },
    setSpeed(speed) {
      this.speed = speed;
    },
    setRenderMode(mode) {
      this.renderMode = mode;
    },
    stepForward() {
      if (this.currentStep < this.totalSteps - 1) {
        this.currentStep++;
      } else {
        this.isPlaying = false;
      }
    },
    stepBackward() {
      if (this.currentStep > 0) {
        this.currentStep--;
      }
    },
    goToStep(step) {
      this.currentStep = step;
    },
    loadAlgorithm(inputData, steps) {
      this.inputData = inputData;
      this.steps = steps;
      this.totalSteps = steps.length;
      this.currentStep = 0;
      this.isPlaying = false;
    },
  },
});
