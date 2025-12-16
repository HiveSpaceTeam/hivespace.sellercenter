<template>
  <DictionaryLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div class="space-y-6">
        <ComponentCard title="Default Inputs">
          <DefaultInputs />
        </ComponentCard>
        <ComponentCard title="Select Inputs">
          <SelectInput />
        </ComponentCard>
        <ComponentCard title="TextArea Examples">
          <TextAreas />
        </ComponentCard>
        <ComponentCard title="Inputs States">
          <InputState />
        </ComponentCard>
      </div>
      <div class="space-y-6">
        <ComponentCard title="Inputs Group">
          <InputGroup />
        </ComponentCard>
        <ComponentCard title="File Input">
          <FileInput />
        </ComponentCard>
        <ComponentCard title="Check box">
          <CheckboxInput />
        </ComponentCard>
        <ComponentCard title="Radio Buttons">
          <RadioGroups />
        </ComponentCard>
        <ComponentCard title="Toggle Switch">
          <ToggleSwitches />
        </ComponentCard>
        <ComponentCard title="Dropzone">
          <Dropzone />
        </ComponentCard>
      </div>
    </div>
  </DictionaryLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PageBreadcrumb, ComponentCard, Dropzone, FileInput } from '@hivespace/shared'
import DictionaryLayout from '@/components/layout/DictionaryLayout.vue'
import ToggleSwitches from '@/views/Demo/Forms/ToggleSwitches.vue'
import CheckboxInput from './CheckboxInput.vue'
import RadioGroups from './RadioGroups.vue' // New import

const currentPageTitle = ref('Form Elements')
</script>
