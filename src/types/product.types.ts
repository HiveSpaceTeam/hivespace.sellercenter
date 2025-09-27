
// Product-related types
export interface ProductVariantOption {
  optionId: string
  value: string
}

export interface ProductVariant {
  id: string
  name: string
  options: ProductVariantOption[]
}

export interface ProductSku {
  id: string
  skuVariants: {
    variantId: string
    value: string
    optionId: string
  }[]
  price?: number | string
  quantity?: number | string
  skuNo?: string
}

export interface Product {
  id?: string
  name: string
  category: string
  description?: string
  productVariants: ProductVariant[]
  productSkus: ProductSku[]
  // Add more fields as needed
}

export interface CreateProductRequest {
  name: string
  category: string
  description?: string
  productVariants: ProductVariant[]
  productSkus: ProductSku[]
  // Add more fields as needed
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
