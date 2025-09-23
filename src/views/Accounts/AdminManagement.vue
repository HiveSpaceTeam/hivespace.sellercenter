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
                    :placeholder="$t('admins.searchPlaceholder')" autocomplete="off" />
                </div>

                <!-- Status Filter -->
                <div class="sm:w-48">
                  <Select v-model="statusFilter" :options="statusOptions" />
                </div>

                <!-- Admin Type Filter -->
                <div class="sm:w-48" v-if="currentUser?.isSystemAdmin()">
                  <Select v-model="adminTypeFilter" :options="adminTypeOptions" />
                </div>
              </div>

              <div class="flex items-center justify-end">
                <div class="flex items-center gap-2">
                  <Button :onClick="openAddAdminModal" :startIcon="BigPlusIcon" variant="primary">
                    {{ $t('admins.addNewAdmin') }}
                  </Button>
                  <Button :startIcon="RefreshIcon" variant="outline" @click="refreshAdmins">
                    {{ $t('common.actions.refresh') }}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="appStore.isLoading" class="p-8 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('admins.loading') }}</p>
          </div>

          <!-- Table -->
          <div v-else class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      {{ $t('admins.emailAddress') }}
                    </p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      {{ $t('admins.fullName') }}
                    </p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      {{ $t('admins.status') }}
                    </p>
                  </th>
                  <th class="px-5 py-3 text-center w-1/8 sm:px-6" v-if="currentUser?.isSystemAdmin()">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      {{ $t('admins.isSystemAdmin') }}
                    </p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      {{ $t('admins.createdDate') }}
                    </p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      {{ $t('admins.lastLoginDate') }}
                    </p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      {{ $t('admins.lastUpdatedDate') }}
                    </p>
                  </th>
                  <th class="px-5 py-3 text-center w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      {{ $t('admins.actionsColumn') }}
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(admin, index) in admins" :key="admin.id"
                  class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/[0.05]">
                  <!-- Email Address -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-full object-cover"
                          :src="admin.avatarUrl || `/images/user/user-0${(index % 9) + 1}.jpg`" :alt="admin.email"
                          loading="lazy" />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ admin.email }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Full Name -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm text-gray-900 dark:text-white">{{ admin.fullName }}</div>
                  </td>

                  <!-- Status -->
                  <td class="px-5 py-4 sm:px-6">
                    <Badge :size="'sm'" :color="isAdminActive(admin) ? 'success' : 'error'">
                      {{ isAdminActive(admin) ? t('admins.values.status.active') :
                        t('admins.values.status.inactive') }}
                    </Badge>
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

                  <!-- Created Date (field: createdAt) -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm text-gray-900 dark:text-white">{{ formatDate(admin.createdAt) }}</div>
                  </td>

                  <!-- Last Login Date (field: lastLoginAt) -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm text-gray-900 dark:text-white">
                      {{ formatDate(admin.lastLoginAt) }}
                    </div>
                  </td>

                  <!-- Last Updated Date (field: updatedAt) -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm text-gray-900 dark:text-white">
                      {{ formatDate(admin.updatedAt) }}
                    </div>
                  </td>

                  <!-- Actions -->
                  <td class="px-5 py-4 sm:px-6 text-center">
                    <DropdownMenu>
                      <template #icon>
                        <HorizontalDots />
                      </template>

                      <template #menu>
                        <button @click="tableHandleDelete(admin)"
                          class="flex items-center w-full px-3 py-2 text-sm text-red-700 hover:bg-gray-50 focus:outline-none focus:ring-0 active:outline-none dark:text-red-400 dark:hover:bg-gray-600">
                          <TrashRedIcon />
                          {{ actionText.delete }}
                        </button>

                        <button @click="tableHandleToggleStatus(admin)"
                          class="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-0 active:outline-none dark:text-gray-300 dark:hover:bg-gray-700">
                          <ToggleOffIcon v-if="isAdminActive(admin)" />
                          <ToggleOnIcon v-else />
                          {{ isAdminActive(admin) ? actionText.deactivate : actionText.activate }}
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
            <span>
              {{
                $t('admins.showingResults', { count: filteredAdminsCount, total: admins.length })
              }}
            </span>
            <span>{{ $t('admins.lastUpdated') }} {{ lastUpdated }}</span>
          </div>
        </template>
      </ComponentCard>
    </div>

    <!-- Add Admin Modal moved to global modal system -->
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import Button from '@/components/common/Button.vue'
import Select from '@/components/common/Select.vue'
import DropdownMenu from '@/components/common/DropdownMenu.vue'
import Badge from '@/components/common/Badge.vue'
import Input from '@/components/common/Input.vue'
import { useModal } from '@/composables/useModal'
import { useConfirmModal } from '@/composables/useConfirmModal'
import { useAppStore } from '@/stores/app'
import AdminDetailModal from './Popups/AdminDetailModal.vue'
import { useAdminStore } from '@/stores/admin'
import type { Admin, GetAdminsParams } from '@/types'
import { RoleFilter, StatusFilter, Status } from '@/types'
import { watch } from 'vue'
import useFormatDate from '@/composables/useFormatDate'
import useDebounce from '@/composables/useDebounce'
import {
  HorizontalDots,
  TrashRedIcon,
  ToggleOffIcon,
  ToggleOnIcon,
  BigPlusIcon,
  RefreshIcon,
} from '@/icons'
import { getCurrentUser } from '@/auth/user-manager'
import type { AppUser } from '@/types/app-user'
// Local params for server queries
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const appStore = useAppStore()
const adminStore = useAdminStore()

const currentPageTitle = computed(() => t('pages.adminManagement'))

// Options for the filter selects (i18n-backed)
const statusOptions = computed(() => [
  { value: StatusFilter.All, label: t('admins.allStatus') },
  { value: StatusFilter.Inactive, label: t('admins.inactive') },
  { value: StatusFilter.Active, label: t('admins.active') },
])

const adminTypeOptions = computed(() => [
  { value: RoleFilter.All, label: t('admins.allAdmins') },
  { value: RoleFilter.RegularAdmin, label: t('admins.regularAdmin') },
  { value: RoleFilter.SystemAdmin, label: t('admins.systemAdmin') },
])

// State management
const searchQuery = ref('')
const statusFilter = ref<StatusFilter>(StatusFilter.All)
const adminTypeFilter = ref<RoleFilter>(RoleFilter.All)
const lastUpdated = ref('')

// Global modal handlers
const { openModal } = useModal()
const { deleteConfirm } = useConfirmModal()

// Current User (simulate current admin user)
const currentUser = ref<AppUser | null>(null)



const params = ref<Partial<GetAdminsParams>>({ page: 1, pageSize: 10 })

// Admin list from the store with proper reactivity
const { admins } = storeToRefs(adminStore)

// Use admins directly in template instead of filteredAdmins
const filteredAdminsCount = computed(() => admins.value.length)
// Load admins from server using current filters
const { formatDate } = useFormatDate()
const { debounce } = useDebounce()
const loadAdmins = async (paramsOverride?: Partial<GetAdminsParams>) => {
  try {
    // Merge overrides into local params
    if (paramsOverride) params.value = { ...(params.value || {}), ...paramsOverride }

    const mapped: GetAdminsParams = {
      page: params.value?.page ?? 1,
      pageSize: params.value?.pageSize ?? 10,
      status: statusFilter.value,
      role: adminTypeFilter.value,
      searchTerm: (params.value?.searchTerm ?? searchQuery.value) || undefined,
      sort: params.value?.sort,
    }

    await adminStore.fetchAdmins(mapped)
  } catch (err) {
    console.error('Failed to load admins:', err)
    appStore.notifyError(t('admins.notifications.loadFailed.title'), t('admins.notifications.loadFailed.message'))
  }
}

// Debounced search input handler will call loadAdmins (via composable)
const tableHandleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value
  // keep the search term in params and trigger a debounced load
  params.value.searchTerm = searchQuery.value
  debounce('admins-search', () => void loadAdmins({ page: 1 }), 400)
}

// Watch filters and reload when they change
watch(statusFilter, () => {
  loadAdmins({ page: 1 })
})
watch(adminTypeFilter, () => {
  loadAdmins({ page: 1 })
})

const actionText = {
  delete: t('admins.delete'),
  activate: t('admins.activate'),
  deactivate: t('admins.deactivate'),
}

// Helper to centralize active-status checks
const isAdminActive = (admin: Admin) => {
  // Admin.status matches the backend numeric status; treat `Status.Active` as active
  return admin?.status === Status.Active
}

// `formatDate` provided by composable (date-only formatter)

const tableHandleDelete = async (admin: Admin) => {
  const confirmed = await deleteConfirm(
    t('admins.actions.deleteAdmin.title'),
    t('admins.actions.deleteAdmin.message', { email: admin.email }),
  )

  if (confirmed) {
    handleDeleteAdmin(admin.id)
  }
}

const tableHandleToggleStatus = (admin: Admin) => {
  handleToggleStatus(admin.id)
}

// Event handlers
const handleDeleteAdmin = (_adminId: string) => {
  void _adminId
  // TODO: Implement delete admin API call and update store
  // This will call the backend to delete the admin and then update `adminStore.admins` accordingly.
}

const handleToggleStatus = (_adminId: string) => {
  void _adminId
  // TODO: Implement toggle status API call and update store
  // This will call the backend to toggle the admin's active status and update `adminStore.admins`.
}


const refreshAdmins = () => {
  // Simulate API refresh
  setTimeout(() => {
    updateLastUpdated()
    console.log('Admins refreshed')
  }, 1000)
}

const updateLastUpdated = () => {
  lastUpdated.value = new Date().toLocaleString()
}

// Open global AdminDetail modal and handle result
const openAddAdminModal = () => {
  openModal(AdminDetailModal, {
    title: t('admins.addNewAdmin'),
    currentUserIsSystemAdmin: currentUser.value?.isSystemAdmin(),
  })
}

// Lifecycle
onMounted(async () => {
  currentUser.value = await getCurrentUser()
  updateLastUpdated()

  // Initial load using current filters
  await loadAdmins({ page: 1 })

  console.log('AdminManagement component mounted')
})
</script>
