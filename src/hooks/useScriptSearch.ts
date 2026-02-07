/**
 * 脚本搜索 Hook
 * 管理搜索框的状态和 URL 同步
 */

import { useState, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';

interface UseScriptSearchProps {
  initialSearch?: string;
  chapter?: string;
}

export function useScriptSearch({ initialSearch, chapter }: UseScriptSearchProps) {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(initialSearch || '');

  // 执行搜索
  const handleSearch = useCallback(() => {
    const trimmedSearch = searchInput.trim();
    navigate({
      to: '/',
      search: {
        page: 1,
        chapter,
        search: trimmedSearch || undefined,
      },
    });
  }, [searchInput, chapter, navigate]);

  // 清除搜索
  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    navigate({
      to: '/',
      search: {
        page: 1,
        chapter,
        search: undefined,
      },
    });
  }, [chapter, navigate]);

  // 更新搜索输入
  const handleSearchInputChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  return {
    searchInput,
    setSearchInput: handleSearchInputChange,
    handleSearch,
    handleClearSearch,
  };
}
