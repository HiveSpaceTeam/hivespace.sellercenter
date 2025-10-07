import type { CreateProductRequest, CreateProductResponse, Product, ProductSearchRequest, PagedResponse, ProductUpsertRequest } from '@/types'
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

  /**
   * Retrieve products list
   */
  async getProducts(params: ProductSearchRequest): Promise<PagedResponse<Product>> {
    const url = buildApiUrl(PRODUCT_ENDPOINTS.PRODUCTS)
    return await apiService.get<PagedResponse<Product>>(url, { params })
  }

  /**
   * Retrieve a single product by id
   */
  async getProductById(id: string): Promise<Product> {
    const url = buildApiUrl(`${PRODUCT_ENDPOINTS.PRODUCTS}/${id}`)
    return await apiService.get<Product>(url)
  }

  /**
   * Update a product
   */
  async updateProduct(id: string, payload: ProductUpsertRequest): Promise<void> {
    const url = buildApiUrl(`${PRODUCT_ENDPOINTS.PRODUCTS}/${id}`)
    await apiService.put<void>(url, payload)
  }
}

export const productService = new ProductService()
