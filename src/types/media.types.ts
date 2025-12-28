export interface PresignUrlRequest {
  fileName: string
  contentType: string
  fileSize: number
  entityType: string
  entityId?: string
}

export interface PresignUrlResponse {
  fileId: string
  uploadUrl: string
  storagePath: string
  expiresAt: string
}
