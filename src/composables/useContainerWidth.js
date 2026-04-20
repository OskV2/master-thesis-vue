import { ref, onMounted, onUnmounted } from "vue";

/**
 * useContainerWidth — measures the width of a container element via template ref.
 */
export function useContainerWidth() {
  const containerRef = ref(null);
  const width = ref(0);
  let observer = null;

  onMounted(() => {
    const el = containerRef.value;
    if (!el) return;

    observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width.value = entry.contentRect.width;
      }
    });

    observer.observe(el);
    width.value = el.getBoundingClientRect().width;
  });

  onUnmounted(() => {
    if (observer) observer.disconnect();
  });

  return { containerRef, width };
}
