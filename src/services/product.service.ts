import type { CreateProductRequest, CreateProductResponse } from '@/types'
import { apiService } from './api'
import { buildApiUrl } from '@/config'

const PRODUCT_ENDPOINTS = {
  PRODUCTS: '/products',
} as const

class ProductService {
  /**
   * Create a new product
   */
  async createProduct(productData: CreateProductRequest): Promise<CreateProductResponse> {
    const url = buildApiUrl(PRODUCT_ENDPOINTS.PRODUCTS)
    return await apiService.post<CreateProductResponse>(url, productData)
  }
}

export const productService = new ProductService()
