import { ref } from 'vue';

const status = ref<number>(0)

export function usePageLoading() {
  return {
    status,
    start() {
      status.value = 0
      setTimeout(() => {
        status.value = 1
      })
    },
    end() {
      setTimeout(() => {
        status.value = 2
      })
    },
    isLoading() {
      return status.value === 0 || status.value === 1
    }
  }
}
