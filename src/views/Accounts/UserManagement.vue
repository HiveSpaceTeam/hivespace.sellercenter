<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard :title="$t('pages.listOfUsers')">
        <div
          class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <!-- Search and Filter Controls -->
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex flex-col sm:flex-row gap-4 items-center">
              <!-- Search Input -->
              <div class="w-full sm:w-64">
                <Input type="text" :value="searchQuery" @input="handleSearchInput"
                  :placeholder="$t('users.searchPlaceholder')" autocomplete="off" />
              </div>

              <!-- Status Filter -->
              <div class="sm:w-48">
                <Select v-model="statusFilter" :options="statusOptions" />
              </div>

              <!-- Seller Filter -->
              <div class="sm:w-48">
                <Select v-model="sellerFilter" :options="sellerOptions" />
              </div>
              <!-- Refresh Button -->
              <div class="sm:ml-auto">
                <Button :startIcon="RefreshIcon" variant="outline" @click="refreshUsers">
                  {{ $t('common.actions.refresh') }}
                </Button>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="p-8 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('users.loading') }}</p>
          </div>

          <!-- Table -->
          <div v-else class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      {{ $t('users.username') }}
                    </p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      {{ $t('users.fullName') }}
                    </p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      {{ $t('users.email') }}
                    </p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      {{ $t('users.status') }}
                    </p>
                  </th>
                  <th class="px-5 py-3 text-center w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      {{ $t('users.seller') }}
                    </p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      {{ $t('users.createdDate') }}
                    </p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      {{ $t('users.lastLoginDate') }}
                    </p>
                  </th>
                  <th class="px-5 py-3 text-center w-1/8 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                      {{ $t('users.actionsColumn') }}
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id"
                  class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/[0.05]">
                  <!-- Username -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img class="h-10 w-10 rounded-full object-cover"
                          :src="user.avatar || '/images/user/default-avatar.jpg'" :alt="user.username" />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ user.username }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Full Name -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm text-gray-900 dark:text-white">{{ user.fullName }}</div>
                  </td>

                  <!-- Email -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                  </td>

                  <!-- Status -->
                  <td class="px-5 py-4 sm:px-6">
                    <Badge :size="'sm'" :color="user.status === 'Active' ? 'success' : 'error'">
                      {{ user.displayStatus }}
                    </Badge>
                  </td>

                  <!-- Is Seller -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="flex items-center justify-center">
                      <CheckGreenIcon v-if="user.hasSeller" />
                    </div>
                  </td>

                  <!-- Created Date (field: createdAt) -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm text-gray-900 dark:text-white">{{ user.createdAt }}</div>
                  </td>

                  <!-- Last Login Date (field: lastLoginAt) -->
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm text-gray-900 dark:text-white">
                      {{ user.lastLoginAt }}
                    </div>
                  </td>
                  <!-- Actions -->
                  <td class="px-5 py-4 sm:px-6 text-center">
                    <DropdownMenu>
                      <template #icon>
                        <HorizontalDots />
                      </template>

                      <template #menu>
                        <button @click="handleDelete(user)"
                          class="flex items-center w-full px-3 py-2 text-sm text-red-700 hover:bg-gray-50 dark:text-red-400 dark:hover:bg-gray-600">
                          <TrashRedIcon />
                          {{ actionDelete }}
                        </button>

                        <button @click="handleToggleStatus(user)"
                          class="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700">
                          <ToggleOffIcon v-if="user.status === 'Active'" />
                          <ToggleOnIcon v-else />
                          {{ user.status === 'Active' ? actionDeactivate : actionActivate }}
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
        <div class="mt-4">
          <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{{
              $t('users.showingResults', { count: filteredUsersCount, total: users.length })
            }}</span>
            <span>{{ $t('users.lastUpdated') }} {{ lastUpdated }}</span>
          </div>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
defineOptions({ name: 'UserManagement' })
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import DropdownMenu from '@/components/common/DropdownMenu.vue'
import Select from '@/components/common/Select.vue'
import Button from '@/components/common/Button.vue'
import Badge from '@/components/common/Badge.vue'
import Input from '@/components/common/Input.vue'
import {
  RefreshIcon,
  CheckGreenIcon,
  ToggleOffIcon,
  ToggleOnIcon,
  TrashRedIcon,
  HorizontalDots,
} from '@/icons'

const { t } = useI18n()

// Options for the filter selects (i18n-backed)
const statusOptions = computed(() => [
  { value: 'all', label: t('users.allStatus') },
  { value: 'active', label: t('users.active') },
  { value: 'inactive', label: t('users.inactive') },
])

const sellerOptions = computed(() => [
  { value: 'all', label: t('users.allUsers') },
  { value: 'seller', label: t('users.sellersOnly') },
  { value: 'non-seller', label: t('users.nonSellers') },
])

const currentPageTitle = computed(() => t('pages.userManagement'))

// State management
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const sellerFilter = ref('all')
const lastUpdated = ref('')

// Sample users data - in real app this would come from API
const users = ref([
  {
    id: 1,
    username: 'johndoe',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    hasSeller: true,
    status: 'Active',
    createdAt: '2024-01-15',
    lastLoginAt: '2024-03-20',
    avatar: '/images/user/user-01.jpg',
  },
  {
    id: 2,
    username: 'janesmith',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    hasSeller: false,
    status: 'Active',
    createdAt: '2024-02-03',
    lastLoginAt: '2024-03-19',
    avatar: '/images/user/user-02.jpg',
  },
  {
    id: 3,
    username: 'mikebrown',
    fullName: 'Mike Brown',
    email: 'mike.brown@example.com',
    hasSeller: true,
    status: 'Inactive',
    createdAt: '2023-12-10',
    lastLoginAt: '2024-02-28',
    avatar: '/images/user/user-03.jpg',
  },
  {
    id: 4,
    username: 'sarahwilson',
    fullName: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    hasSeller: true,
    status: 'Active',
    createdAt: '2024-01-28',
    lastLoginAt: '2024-03-21',
    avatar: '/images/user/user-04.jpg',
  },
  {
    id: 5,
    username: 'davidlee',
    fullName: 'David Lee',
    email: 'david.lee@example.com',
    hasSeller: false,
    status: 'Active',
    createdAt: '2024-02-14',
    lastLoginAt: '2024-03-18',
    avatar: '/images/user/user-05.jpg',
  },
])

// Computed properties
const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query),
    )
  }

  if (statusFilter.value !== 'all') {
    const status = statusFilter.value === 'active' ? 'Active' : 'Inactive'
    filtered = filtered.filter((user) => user.status === status)
  }

  if (sellerFilter.value !== 'all') {
    const isSeller = sellerFilter.value === 'seller'
    filtered = filtered.filter((user) => user.hasSeller === isSeller)
  }

  // Map to display format with i18n values
  return filtered.map((user) => ({
    ...user,
    displayStatus: user.status === 'Active'
      ? t('users.values.status.active')
      : t('users.values.status.inactive'),
  }))
})

const filteredUsersCount = computed(() => filteredUsers.value.length)

// Event handlers
// Dropdown menu component used per-row (handled in template)

const actionDelete = computed(() => t('common.actions.delete'))
const actionActivate = computed(() => t('common.actions.activate'))
const actionDeactivate = computed(() => t('common.actions.deactivate'))

// Accept either an id (number) or a user object { id }
const handleDeleteUser = (userOrId: number | { id: number }) => {
  const userId = typeof userOrId === 'number' ? userOrId : userOrId.id
  loading.value = true
  // Simulate API call
  setTimeout(() => {
    users.value = users.value.filter((user) => user.id !== userId)
    loading.value = false
    updateLastUpdated()
    console.log('User deleted:', userId)
  }, 500)
}

const handleToggleStatus = (userOrId: number | { id: number }) => {
  const userId = typeof userOrId === 'number' ? userOrId : userOrId.id
  loading.value = true
  // Simulate API call
  setTimeout(() => {
    const user = users.value.find((u) => u.id === userId)
    if (user) {
      user.status = user.status === 'Active' ? 'Inactive' : 'Active'
    }
    loading.value = false
    updateLastUpdated()
    console.log('Status toggled for user:', userId)
  }, 500)
}

const handleSearch = (query: string) => {
  searchQuery.value = query
  console.log('Search query:', query)
}

function handleSearchInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  searchQuery.value = v
  handleSearch(v)
}

// Filters are bound via v-model on Select; no manual handlers required here.

const refreshUsers = () => {
  loading.value = true
  // Simulate API refresh
  setTimeout(() => {
    loading.value = false
    updateLastUpdated()
    console.log('Users refreshed')
  }, 1000)
}

const updateLastUpdated = () => {
  lastUpdated.value = new Date().toLocaleString()
}

// Lifecycle
onMounted(() => {
  updateLastUpdated()
  console.log('UserManagement component mounted')
})

// small template-facing wrappers
function handleDelete(user: { id: number }) {
  handleDeleteUser(user)
}
</script>
