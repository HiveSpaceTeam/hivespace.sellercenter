import { apiService } from './api'
import { buildApiUrl } from '@/config'
import type { PresignUrlRequest, PresignUrlResponse } from '@/types'
import axios from 'axios'

const MEDIA_ENDPOINTS = {
  PRESIGN_URL: '/media/presign-url',
  CONFIRM_UPLOAD: (id: string) => `/media/${id}/confirm`,
} as const

class MediaService {
  /**
   * Get a presigned URL for uploading a file
   */
  async presignUrl(request: PresignUrlRequest): Promise<PresignUrlResponse> {
    const url = buildApiUrl(MEDIA_ENDPOINTS.PRESIGN_URL)
    return await apiService.post<PresignUrlResponse>(url, request)
  }

  /**
   * Confirm that a file has been uploaded
   */
  async confirmUpload(id: string, entityId: string): Promise<void> {
    const url = buildApiUrl(MEDIA_ENDPOINTS.CONFIRM_UPLOAD(id))
    return await apiService.post<void>(url, { entityId })
  }

  /**
   * Upload file to blob storage using presigned URL
   */
  async uploadToBlob(url: string, file: File): Promise<void> {
    await axios.put(url, file, {
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': file.type,
      },
    })
  }
}

export const mediaService = new MediaService()
