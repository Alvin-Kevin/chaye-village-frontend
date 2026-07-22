import request from './request'
import type { Spot } from '@/types'

export const spotApi = {
  getList(): Promise<Spot[]> {
    return request.get('/spots')
  },
  getDetail(id: number): Promise<Spot> {
    return request.get(`/spots/${id}`)
  }
}
