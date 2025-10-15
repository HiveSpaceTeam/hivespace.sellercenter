<template>
  <div class="min-h-screen">
    <!-- Header Only -->
    <AppHeader :show-sidebar-toggle="false" />

    <!-- Main Content -->
    <div class="relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6 overflow-hidden z-1">
      <div>
        <div class="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px]">
          <img src="/images/shape/grid-01.svg" alt="grid" />
        </div>
        <div class="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px]">
          <img src="/images/shape/grid-01.svg" alt="grid" />
        </div>
      </div>

      <div class="mx-auto w-full max-w-[900px] text-center">
        <h1 class="mt-2 mb-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          {{ t('registerSeller.title') }}
        </h1>
        <p class="mb-10 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
          {{ t('registerSeller.subtitle') }}
        </p>

        <form @submit.prevent="handleSubmit" class="text-left space-y-8">
          <!-- Common/General Error -->
          <div v-if="formErrors.common.length > 0"
            class="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
            <template v-if="formErrors.common.length === 1">
              <div>{{ formErrors.common[0] }}</div>
            </template>
            <template v-else>
              <ul class="mt-2 ml-4 list-disc list-inside space-y-1">
                <li v-for="(error, index) in formErrors.common" :key="index">
                  {{ error }}
                </li>
              </ul>
            </template>
          </div>
          <!-- Store Information Section -->
          <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ t('registerSeller.storeInformation') }}
              </h2>
            </div>

            <div class="p-6 space-y-6">
              <!-- Store Name -->
              <div class="flex flex-col md:flex-row md:items-start gap-4">
                <label
                  class="text-sm font-medium text-gray-700 dark:text-gray-400 required-label md:text-right md:w-1/4 md:mt-3 md:pr-4">
                  {{ t('registerSeller.fields.storeName') }}
                </label>
                <div class="md:flex-1">
                  <Input v-model="formData.storeName" :placeholder="t('registerSeller.placeholders.storeName')"
                    :error="formErrors.storeName" required id="storeName" />
                </div>
              </div>

              <!-- Store Description -->
              <div class="flex flex-col md:flex-row md:items-start gap-4">
                <label
                  class="text-sm font-medium text-gray-700 dark:text-gray-400 md:text-right md:w-1/4 md:mt-3 md:pr-4">
                  {{ t('registerSeller.fields.storeDescription') }}
                </label>
                <div class="md:flex-1">
                  <TextArea v-model="formData.description"
                    :placeholder="t('registerSeller.placeholders.storeDescription')" :error="formErrors.description"
                    :rows="3" id="storeDescription" />
                </div>
              </div>

              <!-- Store Address -->
              <div class="flex flex-col md:flex-row md:items-start gap-4">
                <label
                  class="text-sm font-medium text-gray-700 dark:text-gray-400 required-label md:text-right md:w-1/4 md:mt-3 md:pr-4">
                  {{ t('registerSeller.fields.storeAddress') }}
                </label>
                <div class="md:flex-1">
                  <Input v-model="formData.address" :placeholder="t('registerSeller.placeholders.storeAddress')"
                    :error="formErrors.address" required id="storeAddress" />
                </div>
              </div>

              <!-- Store Logo -->
              <div class="flex flex-col md:flex-row md:items-start gap-4">
                <label
                  class="text-sm font-medium text-gray-700 dark:text-gray-400 required-label md:text-right md:w-1/4 md:mt-10 md:pr-4">
                  {{ t('registerSeller.fields.storeLogo') }}
                </label>
                <div class="md:flex-1">
                  <FileInput v-model="formData.storeLogoFileId" accept="image/*" :max-size="5 * 1024 * 1024"
                    preview-direction="right" :button-text="t('registerSeller.fileInput.chooseLogo')" preview-size="lg"
                    preview-shape="square" :help-text="t('registerSeller.fileInput.logoHelpText')"
                    @change="handleFileChange" @error="handleFileError" :error="formErrors.storeLogoFileId" />
                </div>
              </div>

              <!-- Submit Button -->
              <div class="flex justify-center w-full">
                <Button type="submit" :disabled="isSubmitting" variant="primary" class="h-11 px-6">
                  {{ t('registerSeller.actions.submit') }}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <p class="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
        © 2025 - HiveSpace
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { useStoreStore } from '@/stores'
import { useFieldValidation } from '@/composables/useFieldValidation'
import { getCurrentUser } from '@/auth/user-manager'
import refreshToken from '@/services/refresh.service'
import type { ErrorResponse } from '@/types'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
import TextArea from '@/components/common/TextArea.vue'
import FileInput from '@/components/common/FileInput.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

const router = useRouter()
const { t } = useI18n()
const appStore = useAppStore()
const storeStore = useStoreStore()
const { handleFieldValidationErrors, clearFieldErrors } = useFieldValidation()

// Form data
const formData = reactive({
  storeName: '',
  description: '',
  storeLogoFileId: null as File | null,
  address: ''
})

// Form error types
interface FormErrors {
  common: string[]
  storeName: string
  description: string
  storeLogoFileId: string
  address: string
}

// Form errors
const formErrors = reactive<FormErrors>({
  common: [], // Array for general/non-field-specific errors
  storeName: '', // Single string for field errors
  description: '',
  storeLogoFileId: '',
  address: ''
})

// Loading states
const isSubmitting = ref(false)

// Clear all form errors
const clearErrors = () => {
  formErrors.common = []
  formErrors.storeName = ''
  formErrors.description = ''
  formErrors.storeLogoFileId = ''
  formErrors.address = ''
}

// Handle file change from FileInput component
const handleFileChange = (file: File | null) => {
  formData.storeLogoFileId = file
  // Clear any previous errors when a valid file is selected
  if (file) {
    formErrors.storeLogoFileId = ''
  }
}

// Handle file upload errors from FileInput component
const handleFileError = (message: string) => {
  formErrors.storeLogoFileId = message
}

// Validate form
const validateForm = (): boolean => {
  clearErrors()
  let isValid = true

  if (!formData.storeName.trim()) {
    formErrors.storeName = t('registerSeller.errors.storeNameRequired')
    isValid = false
  }

  if (!formData.storeLogoFileId) {
    formErrors.storeLogoFileId = t('registerSeller.errors.storeLogoRequired')
    isValid = false
  }

  if (!formData.address.trim()) {
    formErrors.address = t('registerSeller.errors.storeAddressRequired')
    isValid = false
  }

  return isValid
}

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    appStore.notifyError(
      t('registerSeller.messages.error'),
      t('registerSeller.messages.validationFailed')
    )
    return
  }

  isSubmitting.value = true

  try {
    // Clear any previous errors
    clearFieldErrors(formErrors)

    // Submit store registration with just the filename for the logo
    await storeStore.registerStore({
      storeName: formData.storeName,
      description: formData.description || null,
      storeLogoFileId: formData.storeLogoFileId instanceof File ? formData.storeLogoFileId.name : '',
      address: formData.address
    })
    // Refresh token after successful registration
    const currentUser = await getCurrentUser()
    await refreshToken(currentUser, true)
    appStore.notifySuccess(
      t('registerSeller.messages.success'),
      t('registerSeller.messages.registrationSuccess')
    )

    // Redirect to account/user-management
    await router.push('/account/user-management')
  } catch (error) {
    console.error('Failed to register seller:', error)

    // Handle API error response
    const errorData = error as ErrorResponse

    // Try to handle field-specific validation errors first
    const hasFieldErrors = handleFieldValidationErrors(errorData, formErrors)

    // If no field errors, show general error notification
    if (!hasFieldErrors) {
      const errorMessage = error instanceof Error ? error.message : t('errors.UNKNOWN_ERROR')
      appStore.notifyError(
        t('registerSeller.messages.error'),
        errorMessage as string
      )
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
