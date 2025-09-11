import type { User } from 'oidc-client-ts'

export interface AppUser extends User {
  isSystemAdmin: () => boolean
  isAdmin: () => boolean
  isSeller: () => boolean
}

export function toAppUser(user: User | null): AppUser | null {
  if (!user) return null
  const u = user as AppUser

  if (!u.isSystemAdmin) {
    u.isSystemAdmin = () => {
      const role = u.profile?.role || []
      return role === 'SystemAdmin'
    }
  }

  if (!u.isAdmin) {
    u.isAdmin = () => {
      const role = u.profile?.role || []
      return role === 'Admin'
    }
  }

  if (!u.isSeller) {
    u.isSeller = () => {
      const role = u.profile?.role || []
      return role === 'Seller'
    }
  }

  return u
}
