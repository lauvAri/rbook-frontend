/**
 * 新建脚本页面
 */

import { useNavigate } from '@tanstack/react-router';
import { useChapters, useCreateScript } from '@/features/code-runner/hooks';
import { ScriptForm } from '@/features/code-runner/components';
import type { CreateScriptRequest } from '@/features/code-runner/types';
import styles from './new.module.css';

export function NewScriptPage() {
  const navigate = useNavigate();
  const createMutation = useCreateScript();
  const { data: chapters } = useChapters();

  const chapterOptions = chapters
    ? [...chapters]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((ch) => ch.name)
    : [];

  const handleSubmit = (data: CreateScriptRequest) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        navigate({ to: '/admin/scripts', search: { page: 1 } });
      },
    });
  };

  const handleCancel = () => {
    navigate({ to: '/admin/scripts', search: { page: 1 } });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>新建脚本</h1>
      <ScriptForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={createMutation.isPending}
        error={createMutation.error?.message}
        chapterOptions={chapterOptions}
      />
    </div>
  );
}
