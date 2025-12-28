/**
 * Types Index
 * Central export point for all application types
 *
 * Usage examples:
 * import type { CreateAdminRequest, AdminModalResult } from '@/types'
 * import type { UserData, TableColumn } from '@/types'
 */

// App-specific types
export type { AppUser } from '@hivespace/shared' // Keep AppUser export for convenience if heavily used, or remove and force update. Adminportal removed it.
// Adminportal says "export * from './user.types'". It does NOT export AppUser from shared.
// So I should remove it.

export * from './product.types'
export * from './account.types'
export * from './store.types'
export * from './media.types'
