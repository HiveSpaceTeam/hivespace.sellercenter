<template>
  <div class="w-full max-w-[700px] overflow-y-auto">
    <form class="space-y-4" @submit.prevent="onCreate">
      <!-- Full Name Field (Input component) -->
      <div>
        <Input id="adminFullName" v-model="form.fullName" type="text" :label="t('admins.fullName')"
          :placeholder="t('admins.fullNamePlaceholder')" required :error="errors.fullName" />
      </div>
      <!-- Email Field (Input component) -->
      <div>
        <Input id="adminEmail" v-model="form.email" type="email" :label="t('admins.email')"
          :placeholder="t('admins.emailPlaceholder')" required :error="errors.email" autocomplete="off" />
      </div>

      <!-- Password Field (Input component + append slot for toggle) -->
      <div>
        <Input id="adminPassword" v-model="form.password" :type="showPassword ? 'text' : 'password'"
          :label="t('admins.password')" :placeholder="t('admins.passwordPlaceholder')" inputClass="pr-10" required
          autocomplete="new-password" :error="errors.password" @update:modelValue="validatePassword">
        <template #append>
          <button type="button" @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <ShowPasswordIcon v-if="showPassword" />
            <HidePasswordIcon v-else />
          </button>
        </template>
        </Input>
        <div v-if="form.password" class="mt-1">
          <div class="flex items-center space-x-1">
            <div class="flex-1 h-2 bg-gray-200 rounded-full">
              <div :class="['h-2 rounded-full transition-all', passwordStrengthColor]"
                :style="`width: ${passwordStrength}%`">
              </div>
            </div>
            <span :class="['text-xs', passwordStrengthTextColor]">{{ passwordStrengthText }}</span>
          </div>
        </div>
      </div>

      <!-- Confirm Password Field (Input component) -->
      <div>
        <Input id="confirmPassword" v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
          :label="t('admins.confirmPassword')" :placeholder="t('admins.confirmPasswordPlaceholder')" required
          inputClass="pr-10" :error="errors.confirmPassword">
        <template #append>
          <button type="button" @click="showConfirmPassword = !showConfirmPassword"
            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <ShowPasswordIcon v-if="showConfirmPassword" />
            <HidePasswordIcon v-else />
          </button>
        </template>
        </Input>
      </div>

      <!-- Admin Type Field (only for System Admins) -->
      <div v-if="currentUserIsSystemAdmin">
        <Checkbox v-model="form.isSystemAdmin" :label="t('admins.systemAdmin')" id="is-system-admin" />
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3 pt-4">
        <Button variant="outline" type="button" :onClick="() => emit('close')">
          {{ t('common.cancel') }}
        </Button>
        <Button variant="primary" type="submit" :disabled="!isFormValid">
          {{ t('admins.createAdmin') }}
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import Checkbox from '@/components/common/Checkbox.vue'
import { ShowPasswordIcon, HidePasswordIcon } from '@/icons'
import type { CreateAdminRequest, ErrorResponse } from '@/types'
import { useAppStore } from '@/stores/app'
import { useAdminStore } from '@/stores/admin'

const { t } = useI18n()
const appStore = useAppStore()
const adminStore = useAdminStore()

defineProps<{
  currentUserIsSystemAdmin: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  isSystemAdmin: false,
})

const errors = reactive({
  email: '',
  fullName: '',
  password: '',
  confirmPassword: '',
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordStrength = computed(() => {
  const password = form.password
  if (!password) return 0
  let score = 0
  if (password.length >= 12) score += 25
  if (password.length >= 16) score += 10
  if (/[a-z]/.test(password)) score += 15
  if (/[A-Z]/.test(password)) score += 15
  if (/[0-9]/.test(password)) score += 15
  if (/[^A-Za-z0-9]/.test(password)) score += 20
  return Math.min(score, 100)
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength < 30) return t('admins.passwordWeak')
  if (strength < 60) return t('admins.passwordFair')
  if (strength < 80) return t('admins.passwordGood')
  return t('admins.passwordStrong')
})

const passwordStrengthColor = computed(() => {
  const strength = passwordStrength.value
  if (strength < 30) return 'bg-red-500'
  if (strength < 60) return 'bg-yellow-500'
  if (strength < 80) return 'bg-blue-500'
  return 'bg-green-500'
})

const passwordStrengthTextColor = computed(() => {
  const strength = passwordStrength.value
  if (strength < 30) return 'text-red-600'
  if (strength < 60) return 'text-yellow-600'
  if (strength < 80) return 'text-blue-600'
  return 'text-green-600'
})

const isFormValid = computed(() => {
  return (
    !!form.fullName &&
    !!form.email &&
    !!form.password &&
    !!form.confirmPassword &&
    !errors.fullName &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword &&
    form.password === form.confirmPassword &&
    passwordStrength.value >= 60
  )
})

const clearFieldErrors = () => {
  errors.email = ''
  errors.fullName = ''
  errors.password = ''
  errors.confirmPassword = ''
}

const handleFieldValidationErrors = (errorData: ErrorResponse): boolean => {
  if (!errorData?.errors || !Array.isArray(errorData.errors)) {
    return false
  }

  let hasFieldErrors = false

  errorData.errors.forEach((err: { code: string; source?: string }) => {
    const errorCode = err.code
    const source = err.source

    // Translate with explicit fallback if key is missing
    const key = `backendErrors.${errorCode}`
    const translated = t(key)
    const errorMessage = translated === key ? (t('errors.UNKNOWN_ERROR') as string) : (translated as string)

    // Check if the source exists in errors object (backend returns camelCase)
    if (source && source in errors) {
      (errors as Record<string, string>)[source] = errorMessage
      hasFieldErrors = true
    }
  })

  return hasFieldErrors
}

const showSuccessNotification = (email: string) => {
  appStore.notifySuccess(
    t('admins.alerts.success.title'),
    t('admins.alerts.success.message', { email }),
  )
}

const showErrorNotification = () => {
  appStore.notifyError(
    t('admins.alerts.error.title'),
    t('admins.alerts.error.message')
  )
}

const validateAllFields = (): boolean => {
  return validateFullName() && validateEmail() && validatePassword() && validateConfirmPassword()
}

const createAdminData = (): CreateAdminRequest => {
  return {
    fullName: form.fullName.trim(),
    email: form.email.toLowerCase().trim(),
    password: form.password,
    confirmPassword: form.confirmPassword,
    isSystemAdmin: form.isSystemAdmin,
  }
}

const onCreate = async () => {
  // Clear previous errors and validate all fields
  clearFieldErrors()

  if (!validateAllFields()) {
    return
  }

  const adminData = createAdminData()

  try {
    // Call the store to create admin (store handles loading)
    const createdAdmin = await adminStore.createAdmin(adminData)

    // Show success notification and close modal
    showSuccessNotification(createdAdmin.email)
    emit('close')
  } catch (error: unknown) {
    // Handle API error response (API interceptor returns ErrorResponse directly)
    const errorData = error as ErrorResponse

    // Try to handle field-specific validation errors first
    const hasFieldErrors = handleFieldValidationErrors(errorData)

    // If no field errors, show general error notification
    if (!hasFieldErrors) {
      showErrorNotification()
    }
  }
}

// Validation functions
const validateEmail = () => {
  const email = form.email
  if (!email) {
    errors.email = t('admins.emailRequired') as string
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    errors.email = t('admins.emailInvalid') as string
    return false
  }
  errors.email = ''
  return true
}

const validateFullName = () => {
  const name = form.fullName?.trim()
  if (!name) {
    errors.fullName = t('admins.fullNameRequired') as string
    return false
  }
  errors.fullName = ''
  return true
}

const validatePassword = () => {
  const password = form.password
  if (!password) {
    errors.password = t('admins.passwordRequired') as string
    return false
  }
  if (password.length < 12) {
    errors.password = t('admins.passwordTooShort') as string
    return false
  }
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)
  if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
    errors.password = t('admins.passwordComplexity') as string
    return false
  }
  errors.password = ''
  return true
}

const validateConfirmPassword = () => {
  const confirm = form.confirmPassword
  if (!confirm) {
    errors.confirmPassword = t('admins.confirmPasswordRequired') as string
    return false
  }
  if (confirm !== form.password) {
    errors.confirmPassword = t('admins.passwordMismatch') as string
    return false
  }
  errors.confirmPassword = ''
  return true
}
</script>
