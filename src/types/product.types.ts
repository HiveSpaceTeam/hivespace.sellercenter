
// Product-related types
export interface ProductVariantOption {
  optionId: string
  value: string
}

export interface ProductVariant {
  id: string // Using UUID string
  name: string
  options: ProductVariantOption[]
}

export interface ProductSku {
  id?: string // Keep for backward compatibility
  key?: string // New composite key based on variant combinations
  skuVariants: {
    variantId: string // Using UUID string to match ProductVariant.id
    value: string
    optionId: string
  }[]
  price: { amount: number; currency: number }
  quantity?: number | string
  skuNo?: string
}

export interface Product {
  id?: string
  name: string
  category: string
  description?: string
  variants: ProductVariant[]
  skus: ProductSku[]
  // Add more fields as needed
}

// Search/paging contracts
export interface ProductSearchRequest {
  keyword?: string
  sort?: 'ASC' | 'DESC'
  pageSize: number
  pageIndex: number
}

export interface PagedResponse<TItem> {
  // Support multiple backend shapes
  items?: TItem[]
  data?: TItem[]
  totalCount?: number
  total?: number
  pageIndex?: number
  pageSize?: number
}

// Update request shares the same payload shape as create for now
export type ProductUpsertRequest = CreateProductRequest

export interface CreateProductRequest {
  name: string
  category: string
  description?: string
  variants: ProductVariant[]
  skus: ProductSku[]
  // Add more fields as needed
  attributes?: ProductAttributeSelection[]
}

export interface CreateProductResponse {
  id: string
  name: string
  category: string
  description?: string
  productVariants: ProductVariant[]
  productSkus: ProductSku[]
  createdAt: string
  updatedAt?: string
  // Add more fields as needed
}

// Category-related types
export interface Category {
  id: string
  name: string
  displayName: string
  fileImageId: string
}

export interface CategoryAttribute {
  id: string
  name: string
  valueType: number
  inputType: number
  isMandatory: boolean
  maxValueCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string | null
  values?: CategoryAttributeValue[]
}

export interface CategoryResponse {
  categories: Category[]
  totalCount?: number
}

export interface CategoryAttributeValue {
  id: string
  attributeId: string
  name: string
  displayName: string
  parentValueId: string | null
  isActive: boolean
  sortOrder: number
}

// Payload for selected attribute values when creating/updating a product
export interface ProductAttributeSelection {
  attributeId: string
  selectedValueIds?: string[]
  freeTextValue?: string | null
}