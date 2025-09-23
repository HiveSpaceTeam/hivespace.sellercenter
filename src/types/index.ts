/**
 * Types Index
 * Central export point for all application types
 *
 * Usage examples:
 * import type { CreateAdminRequest, AdminModalResult } from '@/types'
 * import type { UserData, TableColumn } from '@/types'
 */

// Unified Admin (store-facing) types
export * from './admin.types'

// API common types (kept under api for backend contracts)
export * from './common.types'

// Utility types - Helper and common types
export * from './util.type'

// App-specific types
export type { AppUser } from './app-user'
