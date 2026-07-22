import request from './request'
import type { DashboardStat } from '@/types'

export const statsApi = {
  getAll(): Promise<DashboardStat[]> {
    return request.get('/dashboard/stats')
  }
}
