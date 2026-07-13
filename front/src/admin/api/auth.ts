import apiClient from './client';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string | null;
  roles: string[];
}

export const authApi = {
  login: async (dto: LoginDto): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', dto);
    return data;
  },

  register: async (dto: RegisterDto): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/register', dto);
    return data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email });
  },

  resetPassword: async (dto: { email: string; token: string; newPassword: string }): Promise<void> => {
    await apiClient.post('/auth/reset-password', dto);
  },
};
