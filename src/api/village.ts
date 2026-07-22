import request from './request'
import type { VillageInfo } from '@/types'

export const villageApi = {
  getAll(): Promise<VillageInfo[]> {
    return request.get('/village-info')
  },
  getBySection(section: string): Promise<VillageInfo> {
    return request.get(`/village-info/${section}`)
  }
}
