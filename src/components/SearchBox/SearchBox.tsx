/**
 * 搜索框组件
 */

import { MdSearch, MdClear } from 'react-icons/md';
import { Input } from '@/components/Input';
import styles from './SearchBox.module.css';

interface SearchBoxProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

export function SearchBox({
  value,
  placeholder = '搜索...',
  onChange,
  onSearch,
  onClear,
}: SearchBoxProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className={styles.searchBox}>
      <div className={styles.inputWrapper}>
        <MdSearch className={styles.searchIcon} />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.input}
        />
        {value && (
          <button
            className={styles.clearBtn}
            onClick={onClear}
            aria-label="清除搜索"
            type="button"
          >
            <MdClear />
          </button>
        )}
      </div>
      <button
        className={styles.searchBtn}
        onClick={onSearch}
        type="button"
      >
        搜索
      </button>
    </div>
  );
}
