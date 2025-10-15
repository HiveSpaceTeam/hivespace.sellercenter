import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RegisterStoreRequest, RegisterStoreResponse } from '@/types'
import { storeService } from '@/services/store.service'

export const useStoreStore = defineStore('store', () => {
    const currentStore = ref<RegisterStoreResponse | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const registerStore = async (request: RegisterStoreRequest) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await storeService.registerStore(request)
            currentStore.value = response
            return response
        } finally {
            isLoading.value = false
        }
    }

    return {
        currentStore,
        isLoading,
        error,
        registerStore
    }
})