/**
 * 路由树配置
 * 使用 TanStack Router 的代码分割方式
 */

import {
  createRouter,
  createRootRoute,
  createRoute,
} from '@tanstack/react-router';

// 导入路由组件
import { RootLayout } from './routes/__root';
import { HomePage } from './routes/index';
import { LoginPage } from './routes/login';
import { ScriptDetailPage } from './routes/scripts.$scriptId';
import { AdminScriptsPage } from './routes/admin/scripts/index';
import { NewScriptPage } from './routes/admin/scripts/new';
import { EditScriptPage } from './routes/admin/scripts/$scriptId.edit';
import { AdminChaptersPage } from './routes/admin/chapters/index';
import { UsersPage } from './routes/admin/users/index';
import { UserLogsPage } from './routes/admin/users/logs';
import ChangePasswordPage from './routes/change-password';
// 修改密码路由
const changePasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/change-password',
  component: ChangePasswordPage,
});

// 创建根路由
const rootRoute = createRootRoute({
  component: RootLayout,
});

// 创建子路由
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      page: Number(search.page) || 1,
      chapter: search.chapter as string | undefined,
    };
  },
});

// 登录路由
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const scriptDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/scripts/$scriptId',
  component: ScriptDetailPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      fromPage: Number(search.fromPage) || 1,
    };
  },
});

const adminScriptsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/scripts',
  component: AdminScriptsPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      page: Number(search.page) || 1,
    };
  },
});

const adminScriptsNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/scripts/new',
  component: NewScriptPage,
});

const adminScriptsEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/scripts/$scriptId/edit',
  component: EditScriptPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      fromPage: Number(search.fromPage) || 1,
    };
  },
});

const adminChaptersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/chapters',
  component: AdminChaptersPage,
});

// 用户管理路由
const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  component: UsersPage,
});

const adminUsersLogsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users/logs',
  component: UserLogsPage,
});

// 构建路由树
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  scriptDetailRoute,
  adminScriptsRoute,
  adminScriptsNewRoute,
  adminScriptsEditRoute,
  adminChaptersRoute,
  adminUsersRoute,
  adminUsersLogsRoute,
  changePasswordRoute,
]);

// 创建路由实例
export const router = createRouter({ routeTree });

// 为 TypeScript 注册路由类型
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
