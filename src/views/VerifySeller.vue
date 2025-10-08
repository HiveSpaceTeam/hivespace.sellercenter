<template>
  <div class="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
    <div>
      <div class="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px]">
        <img src="/images/shape/grid-01.svg" alt="grid" />
      </div>
      <div class="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px]">
        <img src="/images/shape/grid-01.svg" alt="grid" />
      </div>
    </div>

    <div class="mx-auto w-full max-w-[900px] text-center">
      <h1 class="mt-8 mb-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
        {{ t('verifySeller.title') }}
      </h1>
      <p class="mb-10 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
        {{ t('verifySeller.subtitle') }}
      </p>

      <form @submit.prevent="handleSubmit" class="text-left space-y-8">
        <!-- Store Information Section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ t('verifySeller.storeInformation') }}
            </h2>
          </div>

          <div class="p-6 space-y-6">
            <!-- Store Name -->
            <div class="flex flex-col md:flex-row md:items-start gap-4">
              <label
                class="text-sm font-medium text-gray-700 dark:text-gray-400 required-label md:text-right md:w-1/4 md:mt-3 md:pr-4">
                {{ t('verifySeller.fields.storeName') }}
              </label>
              <div class="md:flex-1">
                <Input v-model="formData.storeName" :placeholder="t('verifySeller.placeholders.storeName')"
                  :error="formErrors.storeName" required id="storeName" />
              </div>
            </div>

            <!-- Store Description -->
            <div class="flex flex-col md:flex-row md:items-start gap-4">
              <label
                class="text-sm font-medium text-gray-700 dark:text-gray-400 required-label md:text-right md:w-1/4 md:mt-3 md:pr-4">
                {{ t('verifySeller.fields.storeDescription') }}
              </label>
              <div class="md:flex-1">
                <TextArea v-model="formData.storeDescription"
                  :placeholder="t('verifySeller.placeholders.storeDescription')" :error="formErrors.storeDescription"
                  :rows="3" required id="storeDescription" />
              </div>
            </div>

            <!-- Store Address -->
            <div class="flex flex-col md:flex-row md:items-start gap-4">
              <label
                class="text-sm font-medium text-gray-700 dark:text-gray-400 required-label md:text-right md:w-1/4 md:mt-3 md:pr-4">
                {{ t('verifySeller.fields.storeAddress') }}
              </label>
              <div class="md:flex-1">
                <Input v-model="formData.storeAddress" :placeholder="t('verifySeller.placeholders.storeAddress')"
                  :error="formErrors.storeAddress" required id="storeAddress" />
              </div>
            </div>

            <!-- Store Logo -->
            <div class="flex flex-col md:flex-row md:items-start gap-4">
              <label
                class="text-sm font-medium text-gray-700 dark:text-gray-400 required-label md:text-right md:w-1/4 md:mt-10 md:pr-4">
                {{ t('verifySeller.fields.storeLogo') }}
              </label>
              <div class="md:flex-1">
                <FileInput v-model="formData.storeLogo" accept="image/*" :max-size="5 * 1024 * 1024"
                  preview-direction="right" button-text="Choose Logo" preview-size="lg" preview-shape="square"
                  help-text="Upload your store logo (JPG, PNG, max 5MB)" @change="handleFileChange"
                  @error="handleFileError" />
              </div>
            </div>

            <!-- Phone Number -->
            <div class="flex flex-col md:flex-row md:items-start gap-4">
              <label
                class="text-sm font-medium text-gray-700 dark:text-gray-400 required-label md:text-right md:w-1/4 md:mt-3 md:pr-4">
                {{ t('verifySeller.fields.phoneNumber') }}
              </label>
              <div class="md:flex-1">
                <div class="flex gap-2">
                  <div class="flex gap-2 flex-1">
                    <div class="w-32">
                      <Select v-model="formData.selectedCountry" :options="countryOptions" placeholder="Country"
                        max-height="max-h-40" />
                    </div>
                    <Input v-model="formData.phoneNumber" :placeholder="t('verifySeller.placeholders.phoneNumber')"
                      :error="formErrors.phoneNumber" class="flex-1" />
                  </div>
                  <Button type="button" @click="sendVerificationCode" :disabled="isSendingCode || !formData.phoneNumber"
                    variant="primary" class="h-11 px-6">
                    {{ isSendingCode ? t('verifySeller.actions.sending') : t('verifySeller.actions.sendCode') }}
                  </Button>
                </div>
                <p v-if="codeSent" class="mt-1 text-sm text-green-600 dark:text-green-400">
                  {{ t('verifySeller.messages.codeSent', { phone: formData.selectedCountry + formData.phoneNumber }) }}
                </p>
                <!-- Hidden reCAPTCHA container -->
                <div id="recaptcha-container" class="hidden"></div>
              </div>
            </div>

            <!-- Verification Code -->
            <div class="flex flex-col md:flex-row md:items-start gap-4">
              <label
                class="text-sm font-medium text-gray-700 dark:text-gray-400 md:text-right md:w-1/4 md:mt-3 md:pr-4">
                <!-- Empty label to maintain alignment -->
              </label>
              <div class="md:flex-1">
                <div class="flex gap-2">
                  <Input v-model="formData.verificationCode" type="text"
                    :placeholder="t('verifySeller.placeholders.verificationCode')" :disabled="!codeSent"
                    :error="formErrors.verificationCode"
                    :input-class="'text-center tracking-wider' + (!codeSent ? ' opacity-50 cursor-not-allowed' : '')"
                    class="flex-1" maxlength="6" />
                  <Button type="submit" :disabled="isSubmitting || !formData.verificationCode" variant="primary"
                    class="h-11 px-6">
                    {{ isSubmitting ? t('verifySeller.actions.submitting') : t('verifySeller.actions.submit') }}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    <p class="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
      © 2025 - HiveSpace
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { phoneOTPService } from '@/services/firebase.service'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
import TextArea from '@/components/common/TextArea.vue'
import FileInput from '@/components/common/FileInput.vue'
import Select from '@/components/common/Select.vue'

const router = useRouter()
const { t } = useI18n()
const appStore = useAppStore()

// Country options for phone number
const countryOptions = [
  { label: '+1 (US)', value: '+1' },
  { label: '+44 (UK)', value: '+44' },
  { label: '+33 (FR)', value: '+33' },
  { label: '+49 (DE)', value: '+49' },
  { label: '+81 (JP)', value: '+81' },
  { label: '+82 (KR)', value: '+82' },
  { label: '+84 (VN)', value: '+84' },
  { label: '+86 (CN)', value: '+86' },
  { label: '+91 (IN)', value: '+91' },
  { label: '+65 (SG)', value: '+65' }
]

// Form data
const formData = reactive({
  storeName: '',
  storeDescription: '',
  storeLogo: null as File | null,
  storeAddress: '',
  selectedCountry: '+84',
  phoneNumber: '',
  verificationCode: ''
})

// Form errors
const formErrors = reactive({
  storeName: '',
  storeDescription: '',
  storeLogo: '',
  storeAddress: '',
  phoneNumber: '',
  verificationCode: ''
})

// Loading states
const isSubmitting = ref(false)
const isSendingCode = ref(false)
const codeSent = ref(false)

// Initialize Firebase reCAPTCHA on component mount
onMounted(() => {
  try {
    phoneOTPService.initRecaptcha('recaptcha-container')
  } catch (error) {
    console.error('Failed to initialize reCAPTCHA:', error)
  }
})

// Cleanup on component unmount
onUnmounted(() => {
  phoneOTPService.cleanup()
})

// Clear all form errors
const clearErrors = () => {
  Object.keys(formErrors).forEach(key => {
    formErrors[key as keyof typeof formErrors] = ''
  })
}

// Handle file change from FileInput component
const handleFileChange = (file: File | null) => {
  formData.storeLogo = file
  // Clear any previous errors when a valid file is selected
  if (file) {
    formErrors.storeLogo = ''
  }
}

// Handle file upload errors from FileInput component
const handleFileError = (message: string) => {
  formErrors.storeLogo = message
}

// Validate form
const validateForm = (): boolean => {
  clearErrors()
  let isValid = true

  if (!formData.storeName.trim()) {
    formErrors.storeName = t('verifySeller.errors.storeNameRequired')
    isValid = false
  }

  if (!formData.storeDescription.trim()) {
    formErrors.storeDescription = t('verifySeller.errors.storeDescriptionRequired')
    isValid = false
  }

  if (!formData.storeLogo) {
    formErrors.storeLogo = t('verifySeller.errors.storeLogoRequired')
    isValid = false
  }

  if (!formData.storeAddress.trim()) {
    formErrors.storeAddress = t('verifySeller.errors.storeAddressRequired')
    isValid = false
  }

  if (!formData.phoneNumber.trim()) {
    formErrors.phoneNumber = t('verifySeller.errors.phoneNumberRequired')
    isValid = false
  } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber.trim())) {
    formErrors.phoneNumber = t('verifySeller.errors.phoneNumberInvalid')
    isValid = false
  }

  if (!formData.verificationCode.trim()) {
    formErrors.verificationCode = t('verifySeller.errors.verificationCodeRequired')
    isValid = false
  } else if (!/^\d{6}$/.test(formData.verificationCode.trim())) {
    formErrors.verificationCode = t('verifySeller.errors.verificationCodeInvalid')
    isValid = false
  }

  return isValid
}



// Send verification code using Firebase
const sendVerificationCode = async () => {
  if (!formData.phoneNumber.trim()) {
    formErrors.phoneNumber = t('verifySeller.errors.phoneNumberRequired')
    return
  }

  if (!/^[\d\s\-\(\)]+$/.test(formData.phoneNumber.trim())) {
    formErrors.phoneNumber = t('verifySeller.errors.phoneNumberInvalid')
    return
  }

  isSendingCode.value = true
  formErrors.phoneNumber = ''

  try {
    // Combine country code with phone number
    const fullPhoneNumber = formData.selectedCountry + formData.phoneNumber.trim()

    const result = await phoneOTPService.sendOTP(fullPhoneNumber)

    if (result.success) {
      codeSent.value = true
      appStore.notifySuccess(
        t('verifySeller.messages.success'),
        result.message
      )
    } else {
      formErrors.phoneNumber = result.message
      appStore.notifyError(
        t('verifySeller.messages.error'),
        result.message
      )
    }
  } catch (error) {
    console.error('Failed to send verification code:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to send verification code'
    formErrors.phoneNumber = errorMessage
    appStore.notifyError(
      t('verifySeller.messages.error'),
      errorMessage
    )
  } finally {
    isSendingCode.value = false
  }
}

// Handle form submission with Firebase OTP verification
const handleSubmit = async () => {
  if (!validateForm()) {
    appStore.notifyError(
      t('verifySeller.messages.error'),
      t('verifySeller.messages.validationFailed')
    )
    return
  }

  isSubmitting.value = true

  try {
    // Step 1: Verify OTP with Firebase
    const otpResult = await phoneOTPService.verifyOTP(formData.verificationCode)

    if (!otpResult.success) {
      formErrors.verificationCode = otpResult.message
      appStore.notifyError(
        t('verifySeller.messages.error'),
        otpResult.message
      )
      return
    }

    // Step 2: Send Firebase ID token to backend for verification
    if (otpResult.idToken) {
      const backendResult = await phoneOTPService.verifyWithBackend(otpResult.idToken)

      if (!backendResult.success) {
        appStore.notifyError(
          t('verifySeller.messages.error'),
          backendResult.message
        )
        return
      }
    }

    // Step 3: Submit seller verification data
    const formDataToSubmit = new FormData()
    formDataToSubmit.append('storeName', formData.storeName)
    formDataToSubmit.append('storeDescription', formData.storeDescription)
    formDataToSubmit.append('storeAddress', formData.storeAddress)
    formDataToSubmit.append('phoneNumber', formData.selectedCountry + formData.phoneNumber)
    formDataToSubmit.append('verificationCode', formData.verificationCode)
    formDataToSubmit.append('firebaseToken', otpResult.idToken || '')

    if (formData.storeLogo) {
      formDataToSubmit.append('storeLogo', formData.storeLogo)
    }

    // TODO: Replace with actual seller verification API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    appStore.notifySuccess(
      t('verifySeller.messages.success'),
      t('verifySeller.messages.verificationSuccess')
    )

    // Redirect to account/user-management
    await router.push('/account/user-management')
  } catch (error) {
    console.error('Failed to verify seller:', error)
    const errorMessage = error instanceof Error ? error.message : 'Verification failed'
    appStore.notifyError(
      t('verifySeller.messages.error'),
      errorMessage
    )
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style>
.required-label::after {
  content: " *";
  color: #ef4444;
}
</style>