// ========== Auth ==========
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  userInfo: AdminUser
}

export interface AdminUser {
  id: number
  username: string
  nickname: string
  avatarUrl: string
}

// ========== Common ==========
export interface PageResult<T> {
  total: number
  pages: number
  current: number
  size: number
  records: T[]
}

export interface PageParams {
  page?: number
  size?: number
}

// ========== Banner ==========
export interface Banner {
  id: number
  title: string
  subtitle: string
  imageUrl: string
  linkUrl: string
  sortOrder: number
  status: number
  createdAt: string
}

// ========== Village Info ==========
export interface VillageInfo {
  id: number
  section: string
  title: string
  content: string
  imageUrl: string
  updatedAt: string
}

// ========== Product ==========
export interface Product {
  id: number
  name: string
  category: string
  summary: string
  description: string
  priceRef: number
  unit: string
  coverImage: string
  images: string
  isFeatured: number
  status: number
  sortOrder: number
  createdAt: string
}

// ========== Spot ==========
export interface Spot {
  id: number
  name: string
  summary: string
  description: string
  coverImage: string
  images: string
  tags: string
  status: number
  sortOrder: number
  createdAt: string
}

// ========== Article ==========
export interface Article {
  id: number
  categoryId: number
  categoryName?: string
  categoryCode?: string
  title: string
  summary: string
  content: string
  coverImage: string
  author: string
  viewCount: number
  isPinned: number
  status: number
  publishedAt: string
  createdAt: string
}

export interface ArticleCategory {
  id: number
  name: string
  code: string
  sortOrder: number
}

// ========== Dashboard Stats ==========
export interface DashboardStat {
  id: number
  statKey: string
  statLabel: string
  statValue: string
  statUnit: string
  chartType: string
  chartData: string
  updatedAt: string
}
