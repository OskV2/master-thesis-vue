import { createRouter, createWebHistory } from "vue-router";
import RootLayout from "@/components/layout/RootLayout.vue";
import HomePage from "@/pages/HomePage.vue";
import AlgorithmPage from "@/pages/AlgorithmPage.vue";
import QuizPage from "@/pages/QuizPage.vue";

const routes = [
  {
    path: "/",
    component: RootLayout,
    children: [
      { path: "", name: "home", component: HomePage },
      { path: "algorithm/:slug", name: "algorithm", component: AlgorithmPage, props: true },
      { path: "quiz", name: "quiz", component: QuizPage },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
