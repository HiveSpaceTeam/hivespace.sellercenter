# Configuration Refactoring

## 🚀 API Gateway Architecture

The configuration has been refactored to support **API Gateway Architecture** - the frontend only communicates with a single gateway endpoint, not directly with individual microservices. This provides better security, centralized routing, and simplified frontend configuration.

```
src/config/
├── index.ts          # Main configuration file (replaces environment.ts + appConfig.ts)
├── constants.ts      # Environment constants and validation
└── README.md         # This documentation
```

### ✅ Migration Complete

All imports have been migrated to the new unified configuration structure. The old `environment.ts` and `appConfig.ts` files have been removed.

## 📦 New Imports

### ✅ Recommended (New Way)

```typescript
// Import the main config
import { config } from '@/config'

// Import specific sections
import { api, auth, features } from '@/config'

// Import constants and utilities
import { API_CONSTANTS, FEATURE_FLAGS } from '@/config/constants'

// Import utility functions
import { buildApiUrl, getAssetUrl, isDevelopment } from '@/config'
```

### ⚠️ Deprecated (Old Way - Still Works)

```typescript
// These still work but are deprecated - use new unified config instead
// import { environment } from '@/config/environment'  // DEPRECATED
// import appConfig from '@/config/appConfig'          // DEPRECATED
```

## 🎯 Key Improvements

### 1. **Unified Configuration**

- Single source of truth for all config
- Type-safe configuration with TypeScript interfaces
- Better organization and structure

### 2. **Enhanced Features**

- Environment validation for required variables
- Backward compatibility with existing imports
- New utility functions (`getAssetUrl`, better `buildApiUrl`)
- Environment-specific constants

### 3. **Better Type Safety**

```typescript
// Full type safety
const config: AppConfig = { ... }

// Environment is now strictly typed
type Environment = 'development' | 'staging' | 'production'
```

## 📋 Migration Guide

### Before (Old)

```typescript
// DEPRECATED - Use new unified config instead
// import { environment } from '@/config/environment'
// import appConfig from '@/config/appConfig'

// const apiUrl = environment.api.baseUrl
// const clientId = appConfig.oidc.clientId
```

### After (New)

```typescript
import { config } from '@/config'
// or
import { api, auth } from '@/config'

// Use api.baseUrl for all API calls
const apiUrl = config.api.baseUrl
const clientId = config.auth.oidc.clientId
const clientId = config.auth.oidc.clientId
// or
const clientId = auth.oidc.clientId
```

## 🔧 New Features

### 1. **Asset URL Builder**

```typescript
import { getAssetUrl } from '@/config'

const imageUrl = getAssetUrl('/images/logo.png') // Uses CDN
const fileUrl = getAssetUrl('/files/document.pdf', true) // Uses storage
```

### 2. **Environment Validation**

```typescript
import { validateEnvironment } from '@/config/constants'

// Automatically validates required env vars in production
validateEnvironment()
```

### 3. **Environment Constants**

```typescript
import { getCurrentEnvironmentConstants } from '@/config/constants'

const envConstants = getCurrentEnvironmentConstants()
// Returns different timeouts, logging levels per environment
```

### 4. **Feature Flags**

```typescript
import { FEATURE_FLAGS } from '@/config/constants'

if (FEATURE_FLAGS.enableDebug) {
  console.log('Debug mode enabled')
}
```

## 🗑️ ✅ Migration Complete

All deprecated files have been removed and imports migrated to the new unified structure. The configuration refactoring is complete!

## 🔄 Environment Variables

The new config supports both old and new environment variable names:

```bash
# API Configuration
VITE_API_BASE_URL=https://api.hivespace.com  # Preferred
VITE_API_URL=https://api.hivespace.com       # Legacy support

# App Environment
VITE_APP_ENVIRONMENT=production              # Preferred
VITE_APP_ENV=production                      # Legacy support
```

## 🌐 API Gateway Usage

The new configuration supports API Gateway architecture. Use the `buildApiUrl` helper:

```typescript
import { buildApiUrl } from '@/config'

// Build versioned API URLs through gateway
const userEndpoint = buildApiUrl('/users') // → /v1/users
const authEndpoint = buildApiUrl('/auth/login') // → /v1/auth/login
const customVersion = buildApiUrl('/admin', 'v2') // → /v2/admin
```

## ✅ Benefits

- **Type Safety**: Full TypeScript support with proper interfaces
- **API Gateway**: Centralized routing through single gateway endpoint
- **Microservices Ready**: Architecture supports microservices without frontend complexity
- **Centralized**: All configuration in one place
- **Flexible**: Easy to extend and modify
- **Validated**: Automatic validation of required environment variables
- **Backward Compatible**: Existing code continues to work
- **Better DX**: Improved developer experience with better IntelliSense
