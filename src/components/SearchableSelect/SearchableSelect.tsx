/**
 * SearchableSelect 组件
 * 仅允许从指定选项中选择
 */

import { useMemo, useState } from 'react';
import { Input } from '../Input';
import styles from './SearchableSelect.module.css';

interface SearchableSelectProps {
  value: string;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export function SearchableSelect({
  value,
  options,
  placeholder,
  disabled,
  onChange,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    const keyword = query.trim().toLowerCase();
    return options.filter((option) => option.toLowerCase().includes(keyword));
  }, [options, query]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setQuery('');
  };

  const handleBlur = () => {
    window.setTimeout(() => {
      setIsOpen(false);
      setQuery('');
    }, 100);
  };

  const handleFocus = () => {
    if (!disabled) {
      setIsOpen(true);
      setQuery('');
    }
  };

  const displayValue = isOpen ? query : value;

  return (
    <div className={styles.wrapper}>
      <Input
        value={displayValue}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
      />
      {isOpen && (
        <div className={styles.dropdown}>
          {filteredOptions.length === 0 ? (
            <div className={styles.empty}>无匹配章节</div>
          ) : (
            filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={styles.option}
                onMouseDown={() => handleSelect(option)}
              >
                {option}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
