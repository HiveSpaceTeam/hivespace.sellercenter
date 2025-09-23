<template>
  <div class="space-y-6">
    <!-- Email Input -->
    <div>
      <Input v-model="email" label="Email" placeholder="info@gmail.com" :inputClass="'pl-[62px]'">
        <template #prepend>
          <span
            class="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400"
          >
            <MailIcon />
          </span>
        </template>
      </Input>
    </div>

    <!-- Phone Input with Prepended Country Code -->
    <div>
      <Input
        v-model="phoneNumber"
        label="Phone"
        placeholder="+1 (555) 000-0000"
        :inputClass="'pl-[84px]'"
      >
        <template #prepend>
          <div class="absolute">
            <select
              v-model="selectedCountry"
              @change="updatePhoneNumber"
              class="appearance-none rounded-l-lg border-0 border-r border-gray-200 bg-transparent bg-none py-3 pl-3.5 pr-8 leading-tight text-gray-700 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-gray-400"
            >
              <option v-for="(code, country) in countryCodes" :key="country" :value="country">
                {{ country }}
              </option>
            </select>
            <div
              class="absolute inset-y-0 flex items-center text-gray-700 pointer-events-none right-3 dark:text-gray-400"
            >
              <ChevronDownIcon class="stroke-current" />
            </div>
          </div>
        </template>
      </Input>
    </div>

    <!-- Phone Input with Appended Country Code -->
    <div>
      <Input
        v-model="phoneNumber2"
        label="Phone"
        placeholder="+1 (555) 000-0000"
        :inputClass="'pr-[84px]'"
      >
        <template #append>
          <div class="absolute right-0">
            <select
              v-model="selectedCountry2"
              @change="updatePhoneNumber2"
              class="appearance-none rounded-r-lg border-0 border-l border-gray-200 bg-transparent bg-none py-3 pl-3.5 pr-8 leading-tight text-gray-700 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-gray-400"
            >
              <option v-for="(code, country) in countryCodes" :key="country" :value="country">
                {{ country }}
              </option>
            </select>
            <div
              class="absolute inset-y-0 flex items-center text-gray-700 pointer-events-none right-3 dark:text-gray-400"
            >
              <ChevronDownIcon class="stroke-current" />
            </div>
          </div>
        </template>
      </Input>
    </div>

    <!-- URL Input -->
    <div>
      <Input v-model="url" label="URL" placeholder="www.tailadmin.com" :inputClass="'pl-[90px]'">
        <template #prepend>
          <span
            class="absolute left-0 top-1/2 inline-flex h-11 -translate-y-1/2 items-center justify-center border-r border-gray-200 py-3 pl-3.5 pr-3 text-gray-500 dark:border-gray-800 dark:text-gray-400"
          >
            http://
          </span>
        </template>
      </Input>
    </div>

    <!-- Website Input with Copy Button -->
    <div>
      <Input v-model="website" label="Website" :inputClass="'pr-[90px] pl-4'">
        <template #append>
          <button
            @click="copyWebsite"
            class="absolute right-0 top-1/2 inline-flex -translate-y-1/2 cursor-pointer items-center gap-1 border-l border-gray-200 py-3 pl-3.5 pr-3 text-sm font-medium text-gray-700 dark:border-gray-800 dark:text-gray-400"
          >
            <CopyIcon class="fill-current" />
            <div>{{ copyText }}</div>
          </button>
        </template>
      </Input>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import Input from '@/components/common/Input.vue'
import MailIcon from '@/icons/MailIcon.vue'
import ChevronDownIcon from '@/icons/ChevronDownIcon.vue'
import CopyIcon from '@/icons/CopyIcon.vue'

const email = ref('')
const selectedCountry = ref('US')
const selectedCountry2 = ref('US')
const phoneNumber = ref('')
const phoneNumber2 = ref('')
const url = ref('')
const website = ref('www.tailadmin.com')
const copyText = ref('Copy')

const countryCodes = {
  US: '+1',
  GB: '+44',
  CA: '+1',
  AU: '+61',
}

const updatePhoneNumber = () => {
  phoneNumber.value = countryCodes[selectedCountry.value as keyof typeof countryCodes]
}

const updatePhoneNumber2 = () => {
  phoneNumber2.value = countryCodes[selectedCountry2.value as keyof typeof countryCodes]
}

const copyWebsite = () => {
  navigator.clipboard.writeText(website.value)
  copyText.value = 'Copied!'
  setTimeout(() => {
    copyText.value = 'Copy'
  }, 2000)
}
</script>
