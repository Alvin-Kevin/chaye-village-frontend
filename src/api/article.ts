import request from './request'
import type { Article, ArticleCategory, PageResult } from '@/types'

export const articleApi = {
  getList(params?: { categoryCode?: string; page?: number; size?: number }): Promise<PageResult<Article>> {
    return request.get('/articles', { params })
  },
  getDetail(id: number): Promise<Article> {
    return request.get(`/articles/${id}`)
  },
  getPinned(): Promise<Article[]> {
    return request.get('/articles/pinned')
  },
  getCategories(): Promise<ArticleCategory[]> {
    return request.get('/articles/categories')
  }
}
