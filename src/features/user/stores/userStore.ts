/**
 * 用户状态管理 Store
 * 使用 zustand 进行全局状态管理
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import * as userApi from '../api';
import axios from '@/lib/axios';

interface UserState {
  // 状态
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (
    username: string,
    password: string,
    captchaKey: string,
    captchaCode: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // 初始状态
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // 登录
      login: async (username, password, captchaKey, captchaCode) => {
        set({ isLoading: true });
        try {
          const user = await userApi.login({
            username,
            password,
            captchaKey,
            captchaCode,
          });

          // 设置 axios 默认 header
          if (user.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
          }

          set({
            user,
            token: user.token || null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // 登出
      logout: async () => {
        try {
          await userApi.logout();
        } catch {
          // 即使请求失败也要清除本地状态
        } finally {
          // 清除 axios header
          delete axios.defaults.headers.common['Authorization'];
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      // 设置用户
      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      // 清除认证状态
      clearAuth: () => {
        delete axios.defaults.headers.common['Authorization'];
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'user-storage',
      // 只持久化必要的字段
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      // 恢复时设置 axios header
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
        }
      },
    }
  )
);

// 辅助 hooks
export const useUser = () => useUserStore((state) => state.user);
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated);
export const useIsAdmin = () =>
  useUserStore((state) => state.user?.userType === 'ADMIN');
