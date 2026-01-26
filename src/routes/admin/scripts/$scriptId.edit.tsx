/**
 * 编辑脚本页面
 */

import { Link, useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { useChapters, useAdminScript, useUpdateScript } from '@/features/code-runner/hooks';
import { ScriptForm } from '@/features/code-runner/components';
import type { UpdateScriptRequest } from '@/features/code-runner/types';
import styles from './edit.module.css';

export function EditScriptPage() {
  const { scriptId } = useParams({ from: '/admin/scripts/$scriptId/edit' });
  const { fromPage } = useSearch({ from: '/admin/scripts/$scriptId/edit' });
  const navigate = useNavigate();
  const { data: script, isLoading, error } = useAdminScript(scriptId);
  const updateMutation = useUpdateScript();
  const { data: chapters } = useChapters();

  const chapterOptions = chapters
    ? [...chapters]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((ch) => ch.name)
    : [];

  const handleSubmit = (data: UpdateScriptRequest) => {
    updateMutation.mutate(
      { id: scriptId, data },
      {
        onSuccess: () => {
          navigate({ to: '/admin/scripts', search: { page: fromPage } });
        },
      }
    );
  };

  const handleCancel = () => {
    navigate({ to: '/admin/scripts', search: { page: fromPage } });
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>加载中...</div>
      </div>
    );
  }

  if (error || !script) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          {error ? `加载失败: ${error.message}` : '脚本不存在'}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 返回按钮 */}
      <div className={styles.backNav}>
        <Link to="/admin/scripts" search={{ page: fromPage }} className={styles.backLink}>
          ← 返回列表
        </Link>
      </div>

      <h1 className={styles.title}>编辑脚本</h1>
      <ScriptForm
        initialData={script}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={updateMutation.isPending}
        error={updateMutation.error?.message}
        chapterOptions={chapterOptions}
      />
    </div>
  );
}
