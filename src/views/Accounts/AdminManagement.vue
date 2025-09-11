<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard :title="$t('pages.listOfAdmins')">
        <!-- Table Content -->
        <div
          class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <!-- Search and Filter Controls -->
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <!-- Search Input -->
              <div class="flex items-center justify-end gap-2">
                <div class="w-full sm:w-64">
                  <Input type="text" :value="searchQuery" @input="tableHandleSearchInput"
                    :placeholder="$t('table.searchPlaceholder')" autocomplete="off" />
                </div>

                <!-- Status Filter -->
                <div class="sm:w-48">
                  <Select v-model="statusFilter" :options="statusOptions"
                    :buttonClass="'w-full text-left px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white flex justify-between items-center'" />
                </div>

                <!-- Admin Type Filter -->
                <div class="sm:w-48" v-if="currentUser?.isSystemAdmin()">
                  <Select v-model="adminTypeFilter" :options="adminTypeOptions"
                    :buttonClass="'w-full text-left px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white flex justify-between items-center'" />
                </div>
              </div>

              <div class="flex items-center justify-end">
                <div class="flex items-center gap-2">
                  <Button :onClick="openAddAdminModal" :startIcon="BigPlusIcon" variant="primary">
                    {{ $t('admins.addNewAdmin') }}
                  </Button>
                  <Button :startIcon="RefreshIcon" variant="outline" @click="refreshAdmins">
                    {{ $t('actions.refresh') }}
                  </Button>
                </div>
              </div>

            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="p-8 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('table.loading') }}</p>
          </div>

          <!-- Table -->
          <div v-else class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.emailAddress')
                      }}</p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.fullName') }}
                    </p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.status') }}</p>
                  </th>
                  <th class="px-5 py-3 text-center w-1/8 sm:px-6" v-if="currentUser?.isSystemAdmin()">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.isSystemAdmin')
                      }}</p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.createdDate')
                      }}</p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.lastLoginDate')
                      }}</p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{
                      $t('table.lastUpdatedDate') }}</p>
                  </th>
                  <th class="px-5 py-3 text-center w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('table.actions') }}
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="admin in filteredAdmins" :key="admin.id"
                  class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/[0.05]">
                  <!-- Email Address -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-full object-cover"
                          :src="admin.avatar || '/images/user/default-avatar.jpg'" :alt="admin.email" />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">{{ admin.email }}</div>
                      </div>
                    </div>
                  </td>

                  <!-- Full Name -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm text-gray-900 dark:text-white">{{ admin.fullName }}</div>
                  </td>

                  <!-- Status -->
                  <td class="px-5 py-4 sm:px-6">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="admin.status === 'Active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'">{{ admin.status }}</span>
                  </td>

                  <!-- Is System Admin -->
                  <td class="px-5 py-4 sm:px-6" v-if="currentUser?.isSystemAdmin()">
                    <div class="flex items-center justify-center">
                      <svg v-if="admin.isSystemAdmin" class="w-5 h-5 text-green-500" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"></path>
                      </svg>
                    </div>
                  </td>

                  <!-- Created Date -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm text-gray-900 dark:text-white">{{ admin.createdDate }}</div>
                  </td>

                  <!-- Last Login Date -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm text-gray-900 dark:text-white">{{ admin.lastLoginDate }}</div>
                  </td>

                  <!-- Last Updated Date -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm text-gray-900 dark:text-white">{{ admin.lastUpdatedDate }}</div>
                  </td>

                  <!-- Actions -->
                  <td class="px-5 py-4 sm:px-6 text-center">
                    <DropdownMenu>
                      <template #icon>
                        <HorizontalDots />
                      </template>

                      <template #menu>
                        <button @click="tableHandleDelete(admin)"
                          class="flex items-center w-full px-3 py-2 text-sm text-red-700 hover:bg-gray-50 dark:text-red-400 dark:hover:bg-gray-600">
                          <TrashRedIcon />
                          {{ actionText.delete }}
                        </button>

                        <button @click="tableHandleToggleStatus(admin)"
                          class="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700">
                          <ToggleOffIcon v-if="admin.status === 'Active'" />
                          <ToggleOnIcon v-else />
                          {{ admin.status === 'Active' ? actionText.deactivate : actionText.activate }}
                        </button>
                      </template>
                    </DropdownMenu>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Footer -->
        <template #footer>
          <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{{ $t('admins.showingResults', { count: filteredAdminsCount, total: admins.length }) }}</span>
            <span>{{ $t('admins.lastUpdated') }} {{ lastUpdated }}</span>
          </div>
        </template>
      </ComponentCard>
    </div>

    <!-- Add Admin Modal moved to global modal system -->
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import Button from "@/components/common/Button.vue";
import Select from "@/components/common/Select.vue";
import DropdownMenu from "@/components/common/DropdownMenu.vue";
import Input from '@/components/common/Input.vue';
import { useModal } from '@/composables/useModal'
import AdminDetailModal from './Popups/AdminDetailModal.vue'

import { HorizontalDots, TrashRedIcon, ToggleOffIcon, ToggleOnIcon, BigPlusIcon, RefreshIcon } from '@/icons'
import { getCurrentUser } from "@/auth/user-manager";
import type { AppUser } from "@/types/app-user";
const { t } = useI18n();

const currentPageTitle = computed(() => t('pages.adminManagement'));

// Options for the filter selects (i18n-backed)
const statusOptions = computed(() => [
  { value: 'all', label: t('table.filter.allStatus') },
  { value: 'active', label: t('table.filter.active') },
  { value: 'inactive', label: t('table.filter.inactive') }
]);

const adminTypeOptions = computed(() => [
  { value: 'all', label: t('table.filter.allAdmins') },
  { value: 'regular', label: t('table.filter.regularAdmin') },
  { value: 'system', label: t('table.filter.systemAdmin') }
]);

// State management
const loading = ref(false);
const searchQuery = ref('');
const statusFilter = ref('all');
const adminTypeFilter = ref('all');
const lastUpdated = ref('');

// Global modal handler
const { openModal } = useModal()

// Current User (simulate current admin user)
const currentUser = ref<AppUser | null>(null);


// Sample admins data - in real app this would come from API
const admins = ref([
  {
    id: 1,
    email: 'admin.system@hivespace.com',
    fullName: 'System Administrator',
    adminType: 'System Admin',
    status: 'Active',
    isSystemAdmin: true,
    createdDate: '2023-11-01',
    lastLoginDate: '2024-03-22',
    lastUpdatedDate: '2024-03-22',
    avatar: '/images/user/user-01.jpg'
  },
  {
    id: 2,
    email: 'john.admin@hivespace.com',
    fullName: 'John Anderson',
    adminType: 'Regular Admin',
    status: 'Active',
    isSystemAdmin: false,
    createdDate: '2024-01-15',
    lastLoginDate: '2024-03-21',
    lastUpdatedDate: '2024-03-21',
    avatar: '/images/user/user-02.jpg'
  },
  {
    id: 3,
    email: 'sarah.manager@hivespace.com',
    fullName: 'Sarah Johnson',
    adminType: 'Regular Admin',
    status: 'Active',
    isSystemAdmin: false,
    createdDate: '2024-01-20',
    lastLoginDate: '2024-03-20',
    lastUpdatedDate: '2024-03-20',
    avatar: '/images/user/user-03.jpg'
  },
  {
    id: 4,
    email: 'mike.supervisor@hivespace.com',
    fullName: 'Mike Thompson',
    adminType: 'System Admin',
    status: 'Active',
    isSystemAdmin: true,
    createdDate: '2023-12-05',
    lastLoginDate: '2024-03-19',
    lastUpdatedDate: '2024-03-19',
    avatar: '/images/user/user-04.jpg'
  },
  {
    id: 5,
    email: 'lisa.admin@hivespace.com',
    fullName: 'Lisa Wilson',
    adminType: 'Regular Admin',
    status: 'Inactive',
    isSystemAdmin: false,
    createdDate: '2024-02-10',
    lastLoginDate: '2024-03-05',
    lastUpdatedDate: '2024-03-15',
    avatar: '/images/user/user-05.jpg'
  },
  {
    id: 6,
    email: 'david.tech@hivespace.com',
    fullName: 'David Rodriguez',
    adminType: 'System Admin',
    status: 'Active',
    isSystemAdmin: true,
    createdDate: '2023-10-15',
    lastLoginDate: '2024-03-22',
    lastUpdatedDate: '2024-03-22',
    avatar: '/images/user/user-06.jpg'
  },
  {
    id: 7,
    email: 'emma.support@hivespace.com',
    fullName: 'Emma Davis',
    adminType: 'Regular Admin',
    status: 'Active',
    isSystemAdmin: false,
    createdDate: '2024-02-25',
    lastLoginDate: '2024-03-18',
    lastUpdatedDate: '2024-03-18',
    avatar: '/images/user/user-07.jpg'
  }
]);

// Computed properties
const filteredAdminsCount = computed(() => {
  let filtered = admins.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(admin =>
      admin.email.toLowerCase().includes(query)
    );
  }

  if (statusFilter.value !== 'all') {
    const status = statusFilter.value === 'active' ? 'Active' : 'Inactive';
    filtered = filtered.filter(admin => admin.status === status);
  }

  if (adminTypeFilter.value !== 'all') {
    const adminType = adminTypeFilter.value === 'system' ? 'System Admin' : 'Regular Admin';
    filtered = filtered.filter(admin => admin.adminType === adminType);
  }

  return filtered.length;
});

// Removed local password strength and validation computation; handled in modal

// Table: filtered list + local menu state
const filteredAdmins = computed(() => {
  let filtered = admins.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(admin =>
      admin.email.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value !== 'all') {
    const status = statusFilter.value === 'active' ? 'Active' : 'Inactive'
    filtered = filtered.filter(admin => admin.status === status)
  }

  // Admin type filter
  if (adminTypeFilter.value !== 'all') {
    const adminType = adminTypeFilter.value === 'system' ? 'System Admin' : 'Regular Admin'
    filtered = filtered.filter(admin => admin.adminType === adminType)
  }

  return filtered
})


const actionText = {
  delete: t('table.delete'),
  activate: t('table.activate'),
  deactivate: t('table.deactivate')
}

// lightweight Admin type for handlers
type Admin = {
  id: number;
  email: string;
  fullName?: string;
  adminType?: string;
  status?: string;
  isSystemAdmin?: boolean;
  createdDate?: string;
  lastLoginDate?: string;
  lastUpdatedDate?: string;
  avatar?: string;
}

const tableHandleDelete = (admin: Admin) => {
  handleDeleteAdmin(admin.id)
}

const tableHandleToggleStatus = (admin: Admin) => {
  handleToggleStatus(admin.id)
}

const tableHandleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  handleSearch(target.value)
}


// Dropdown menu is handled by DropdownMenu component which manages its own outside clicks

// Event handlers
const handleDeleteAdmin = (adminId: number) => {
  loading.value = true;
  // Simulate API call
  setTimeout(() => {
    admins.value = admins.value.filter(admin => admin.id !== adminId);
    loading.value = false;
    updateLastUpdated();
    console.log('Admin deleted:', adminId);
  }, 500);
};

const handleToggleStatus = (adminId: number) => {
  loading.value = true;
  // Simulate API call
  setTimeout(() => {
    const admin = admins.value.find(a => a.id === adminId);
    if (admin) {
      admin.status = admin.status === 'Active' ? 'Inactive' : 'Active';
      admin.lastUpdatedDate = new Date().toISOString().split('T')[0];
    }
    loading.value = false;
    updateLastUpdated();
    console.log('Status toggled for admin:', adminId);
  }, 500);
};

const handleSearch = (query: string) => {
  searchQuery.value = query;
  console.log('Search query:', query);
};

// Filters are bound via v-model on Select; no manual handlers required here.

const refreshAdmins = () => {
  loading.value = true;
  // Simulate API refresh
  setTimeout(() => {
    loading.value = false;
    updateLastUpdated();
    console.log('Admins refreshed');
  }, 1000);
};

const updateLastUpdated = () => {
  lastUpdated.value = new Date().toLocaleString();
};

// Open global AdminDetail modal and handle result
type AdminModalResult = { action?: 'create' | 'cancel', data?: { email: string, isSystemAdmin: boolean } } | undefined
const openAddAdminModal = async () => {
  const existing = admins.value.map(a => a.email)
  const result = await openModal(AdminDetailModal, {
    title: t('admins.addNewAdmin'),
    currentUserIsSystemAdmin: currentUser.value?.isSystemAdmin(),
    existingEmails: existing
  }) as AdminModalResult
  if (result?.action === 'create' && result.data) {
    const email = result.data.email
    const isSystem = !!result.data.isSystemAdmin
    const newAdminData = {
      id: admins.value.length + 1,
      email,
      fullName: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      adminType: isSystem ? 'System Admin' : 'Regular Admin',
      status: 'Active',
      isSystemAdmin: isSystem,
      createdDate: new Date().toISOString().split('T')[0],
      lastLoginDate: 'Never',
      lastUpdatedDate: new Date().toISOString().split('T')[0],
      avatar: '/images/user/user-default.jpg'
    }
    admins.value.unshift(newAdminData)
    updateLastUpdated()
    alert(t('admins.adminCreatedSuccess', { email: newAdminData.email }))
  }
}

// Lifecycle
onMounted(async () => {
  currentUser.value = await getCurrentUser();
  updateLastUpdated();
  console.log('AdminManagement component mounted');
});
</script>
