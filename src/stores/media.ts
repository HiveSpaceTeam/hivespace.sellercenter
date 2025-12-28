import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PresignUrlRequest, PresignUrlResponse } from '@/types'
import { mediaService } from '@/services/media.service'

export const useMediaStore = defineStore('media', () => {
  const isLoading = ref(false)

  const presignUrl = async (request: PresignUrlRequest): Promise<PresignUrlResponse> => {
    isLoading.value = true

    try {
      const response = await mediaService.presignUrl(request)
      return response
    } finally {
      isLoading.value = false
    }
  }

  const confirmUpload = async (id: string, entityId: string): Promise<void> => {
    isLoading.value = true

    try {
      await mediaService.confirmUpload(id, entityId)
    } finally {
      isLoading.value = false
    }
  }

  const uploadMedia = async (
    file: File,
    entityType: string,
    entityId?: string,
  ): Promise<PresignUrlResponse> => {
    isLoading.value = true

    try {
      // 1. Get Presign URL
      const presignResponse = await mediaService.presignUrl({
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
        entityType,
        entityId,
      })

      // 2. Upload to Blob
      await mediaService.uploadToBlob(presignResponse.uploadUrl, file)

      return presignResponse
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    presignUrl,
    confirmUpload,
    uploadMedia,
  }
})
