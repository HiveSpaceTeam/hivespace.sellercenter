<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard :title="$t('pages.productList')">
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
                    :placeholder="$t('product.searchPlaceholder')" autocomplete="off" />
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
                  <Button :onClick="addNewProduct" :startIcon="BigPlusIcon" variant="primary">
                    {{ $t('product.addProduct') }}
                  </Button>
                  <Button :startIcon="RefreshIcon" variant="outline" @click="refreshAdmins">
                    {{ $t('common.actions.refresh') }}
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
                  <th class="px-5 py-3 text-left w-1/3 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('product.productName') }}</p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/3 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('product.price') }}</p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/3 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('product.quantity') }}</p>
                  </th>
                  <th class="px-5 py-3 text-left w-1/4 sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">{{ $t('common.action') }}</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in products" :key="product.id"
                  class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/[0.05]">
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ product.name }}</div>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm text-gray-900 dark:text-white">{{ formatPriceRange(product) }}</div>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <div class="text-sm text-gray-900 dark:text-white">{{ totalQuantity(product) }}</div>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <div class="flex items-center gap-2">
                      <Button :startIcon="EditIcon" variant="outline" @click="editProduct(product)"></Button>
                      <Button :startIcon="TrashRedIcon" variant="outline" @click="removeProduct(product)"></Button>
                    </div>
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
import { useConfirmModal } from '@/composables/useConfirmModal'
import { productService } from '@/services'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import type { Product, ProductSearchRequest, PagedResponse } from '@/types'

import { BigPlusIcon, RefreshIcon, EditIcon, TrashRedIcon } from '@/icons'
import { getCurrentUser } from "@/auth/user-manager";
import type { AppUser } from "@/types/app-user";
const { t } = useI18n();

const currentPageTitle = computed(() => t('pages.productList'));

// Options for the filter selects (i18n-backed)
const statusOptions = computed(() => [
  { value: 'all', label: t('product.productStatus.allStatus') },
  { value: 'active', label: t('product.productStatus.active') },
  { value: 'inactive', label: t('product.productStatus.inactive') }
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
const products = ref<Product[]>([])
const pageIndex = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)

// Global modal handler
const { openModal } = useModal()
const { deleteConfirm } = useConfirmModal()
const router = useRouter()
const appStore = useAppStore()

// Current User (simulate current admin user)
const currentUser = ref<AppUser | null>(null);


// Admins data placeholder (current UI is admin-oriented). Typed to avoid TS 'never' inference.
const admins = ref<Admin[]>([]);

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

// Helpers for product display
const totalQuantity = (product: Product): number => {
  if (!product?.skus?.length) return 0
  return product.skus.reduce((sum, sku) => {
    const q = typeof sku.quantity === 'string' ? Number(sku.quantity) : (sku.quantity || 0)
    return sum + (isNaN(q) ? 0 : q)
  }, 0)
}

const formatPriceRange = (product: Product): string => {
  if (!product?.skus?.length) return '-'
  const prices: number[] = []
  for (const sku of product.skus) {
    const p = sku.price
    if (p == null) continue
    if (typeof p === 'number') {
      prices.push(p)
    } else if (typeof p === 'string') {
      const n = Number(p)
      if (!isNaN(n)) prices.push(n)
    } else if (typeof p === 'object' && typeof p.amount === 'number') {
      prices.push(p.amount)
    }
  }
  if (!prices.length) return '-'
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  if (min === max) return formatCurrency(min)
  return `${formatCurrency(min)} - ${formatCurrency(max)}`
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value)
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

// Product actions
const editProduct = (product: Product) => {
  if (!product?.id) return
  router.push({ path: `/product/${product.id}` })
}

const removeProduct = async (product: Product) => {
  if (!product?.id) return

  try {
    // Show confirmation modal
    const confirmed = await deleteConfirm(
      t('product.deleteProduct'),
      t('product.deleteProductConfirm', { name: product.name })
    )

    if (!confirmed) return

    // Set loading state
    loading.value = true

    // Call delete API
    await productService.deleteProduct(product.id.toString())

    // Remove product from local list
    products.value = products.value.filter(p => p.id !== product.id)
    totalCount.value = Math.max(0, totalCount.value - 1)

    // Show success notification
    appStore.notifySuccess(
      t('product.productDeleted'),
      t('product.productDeletedMessage', { name: product.name })
    )

    // Update last updated timestamp
    updateLastUpdated()

  } catch (error) {
    console.error('Failed to delete product:', error)
    
    // Show error notification
    appStore.notifyError(
      t('product.deleteError'),
      t('product.deleteErrorMessage')
    )
  } finally {
    loading.value = false
  }
}

const fetchProducts = async () => {
  loading.value = true
  try {
    const params: ProductSearchRequest = {
      keyword: searchQuery.value || undefined,
      sort: 'ASC',
      pageIndex: pageIndex.value,
      pageSize: pageSize.value,
    }
    const result: PagedResponse<Product> = await productService.getProducts(params)
    products.value = (result.items ?? result.data) ?? []
    totalCount.value = (result.totalCount ?? result.total) ?? 0
    updateLastUpdated()
  } catch (err) {
    // Errors are centrally handled in api service; keep console for dev context
    console.error('Failed to fetch products', err)
  } finally {
    loading.value = false
  }
}

const refreshAdmins = async () => {
  await fetchProducts()
};

const updateLastUpdated = () => {
  lastUpdated.value = new Date().toLocaleString();
};

// Open global AdminDetail modal and handle result
type AdminModalResult = { action?: 'create' | 'cancel', data?: { email: string, isSystemAdmin: boolean } } | undefined

const addNewProduct = () => {
  router.push({ path: '/product/new' })
}

// Lifecycle
onMounted(async () => {
  currentUser.value = await getCurrentUser();
  await fetchProducts()
  console.log('ProductList mounted');
});
</script>
