<template>
  <AdminLayout>
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
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import DefaultInputs from '@/views/Demo/Forms/DefaultInputs.vue';
import ComponentCard from '@/components/common/ComponentCard.vue';
import SelectInput from '@/views/Demo/Forms/SelectInput.vue';
import InputState from '@/views/Demo/Forms/InputState.vue';
import TextAreas from '@/views/Demo/Forms/TextAreas.vue';
import InputGroup from '@/views/Demo/Forms/InputGroup.vue';
import Dropzone from '@/components/common/Dropzone.vue';
import FileInput from '@/components/common/FileInput.vue';
import ToggleSwitches from '@/views/Demo/Forms/ToggleSwitches.vue';
import CheckboxInput from './CheckboxInput.vue';
import RadioGroups from './RadioGroups.vue'; // New import

const currentPageTitle = ref('Form Elements')
</script>
