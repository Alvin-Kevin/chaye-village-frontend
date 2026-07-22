import request from './request'
import type { LoginRequest, LoginResponse } from '@/types'

export const authApi = {
  login(data: LoginRequest): Promise<LoginResponse> {
    return request.post('/admin/auth/login', data)
  }
}
