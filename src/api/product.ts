import request from './request'
import type { Product, PageResult } from '@/types'

export const productApi = {
  getList(params?: { category?: string; page?: number; size?: number }): Promise<PageResult<Product>> {
    return request.get('/products', { params })
  },
  getDetail(id: number): Promise<Product> {
    return request.get(`/products/${id}`)
  },
  getFeatured(): Promise<Product[]> {
    return request.get('/products/featured')
  }
}
