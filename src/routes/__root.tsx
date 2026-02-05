/**
 * 根路由布局
 */

import { Link, Outlet, useNavigate } from '@tanstack/react-router';
import { useUserStore, useUser, useIsAuthenticated, useIsAdmin } from '@/features/user';
import styles from './__root.module.css';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';

export function RootLayout() {
  const navigate = useNavigate();
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const isAdmin = useIsAdmin();
  const logout = useUserStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/login' });
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.navLinks}>
            <Link to="/" search={{ page: 1, chapter: undefined }} className={styles.navLink} activeProps={{ className: styles.active }}>
              代码执行器
            </Link>
            {isAuthenticated && (
              <Link to="/admin/scripts" search={{ page: 1, chapter: undefined }} className={styles.navLink} activeProps={{ className: styles.active }}>
                脚本管理
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin/chapters" className={styles.navLink} activeProps={{ className: styles.active }}>
                章节管理
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin/users" className={styles.navLink} activeProps={{ className: styles.active }}>
                用户管理
              </Link>
            )}
          </div>
          <div className={styles.userSection}>
            <ThemeToggleButton />
            {isAuthenticated ? (
              <>
                <span className={styles.username}>
                  {user?.username}
                  <span className={styles.userType}>
                    ({user?.userType === 'ADMIN' ? '管理员' : '操作员'})
                  </span>
                </span>
                <Link to="/change-password" className={styles.logoutBtn}>
                  修改密码
                </Link>
                <button className={styles.logoutBtn} onClick={handleLogout}>
                  退出
                </button>
              </>
            ) : (
              <Link to="/login" className={styles.loginLink}>
                登录
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
