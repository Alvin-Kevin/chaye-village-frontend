import request from './request'
import type { Banner } from '@/types'

export const bannerApi = {
  getList(): Promise<Banner[]> {
    return request.get('/banners')
  }
}
