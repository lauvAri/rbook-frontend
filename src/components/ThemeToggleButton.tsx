import { useThemeStore } from '@/stores/theme';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

export function ThemeToggleButton() {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  return (
    <button
      onClick={toggleTheme}
      title={theme === 'dark' ? '切换为亮色模式' : '切换为暗色模式'}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 6,
        borderRadius: 6,
        fontSize: 20,
        display: 'flex',
        alignItems: 'center',
        color: 'var(--primary)',
      }}
    >
      {theme === 'dark' ? <MdLightMode size={22} /> : <MdDarkMode size={22} />}
    </button>
  );
}
