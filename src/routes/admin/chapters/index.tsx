/**
 * 章节管理页面
 */

import { useMemo, useState } from 'react';
import { Card, Button, Input } from '@/components';
import {
  useAdminChapters,
  useCreateChapter,
  useUpdateChapter,
  useDeleteChapter,
} from '@/features/code-runner/hooks';
import type { AdminChapter } from '@/features/code-runner/types';
import styles from './index.module.css';

const EMPTY_FORM = {
  name: '',
  sortOrder: '',
};

export function AdminChaptersPage() {
  const { data, isLoading, error } = useAdminChapters();
  const createMutation = useCreateChapter();
  const updateMutation = useUpdateChapter();
  const deleteMutation = useDeleteChapter();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const chapters = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      return a.name.localeCompare(b.name, 'zh-Hans-CN');
    });
  }, [data]);

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setFormError(null);
  };

  const handleEdit = (chapter: AdminChapter) => {
    setEditingId(chapter.id);
    setFormData({
      name: chapter.name,
      sortOrder: String(chapter.sortOrder ?? ''),
    });
    setFormError(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const name = formData.name.trim();
    if (!name) {
      setFormError('请输入章节名称');
      return;
    }

    const sortOrderValue = formData.sortOrder.trim();
    const sortOrder = sortOrderValue ? Number(sortOrderValue) : undefined;
    if (sortOrderValue && Number.isNaN(sortOrder)) {
      setFormError('排序值需要是数字');
      return;
    }

    const payload = { name, sortOrder };
    if (editingId) {
      updateMutation.mutate(
        { id: editingId, data: payload },
        {
          onSuccess: resetForm,
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: resetForm,
      });
    }
  };

  const handleDelete = (chapter: AdminChapter) => {
    if (window.confirm(`确定要删除章节「${chapter.name}」吗？此操作不可恢复。`)) {
      deleteMutation.mutate(chapter.id);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>章节管理</h1>
          <p className={styles.subtitle}>维护章节名称与排序，脚本列表会自动按此排序</p>
        </div>
      </div>

      <Card className={styles.formCard}>
        <h2 className={styles.formTitle}>{editingId ? '编辑章节' : '新建章节'}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <Input
              label="章节名称"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="如：第一章 描述性统计"
              required
              maxLength={100}
            />
            <Input
              label="排序权重"
              name="sortOrder"
              value={formData.sortOrder}
              onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: e.target.value }))}
              placeholder="排序权重（数字）"
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
            />
          </div>
          {(formError || createMutation.error || updateMutation.error) && (
            <div className={styles.formError}>
              {formError || createMutation.error?.message || updateMutation.error?.message}
            </div>
          )}
          <div className={styles.formActions}>
            {editingId && (
              <Button type="button" variant="ghost" onClick={resetForm}>
                取消
              </Button>
            )}
            <Button
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editingId ? '保存修改' : '创建章节'}
            </Button>
          </div>
        </form>
      </Card>

      {isLoading && <div className={styles.loading}>加载中...</div>}
      {error && <div className={styles.error}>加载失败: {error.message}</div>}

      {!isLoading && !error && (
        <div className={styles.list}>
          {chapters.length === 0 ? (
            <Card className={styles.emptyCard}>
              <p className={styles.emptyText}>暂无章节，请先创建章节</p>
            </Card>
          ) : (
            chapters.map((chapter) => (
              <Card key={chapter.id} className={styles.chapterCard}>
                <div className={styles.chapterRow}>
                  <div className={styles.chapterInfo}>
                    <h3 className={styles.chapterName}>{chapter.name}</h3>
                    <div className={styles.chapterMeta}>
                      <span>排序：{chapter.sortOrder ?? '-'}</span>
                      <span>脚本数：{chapter.scriptCount ?? 0}</span>
                    </div>
                  </div>
                  <div className={styles.actions}>
                    <Button
                      variant="secondary"
                      onClick={() => handleEdit(chapter)}
                      disabled={updateMutation.isPending || createMutation.isPending}
                    >
                      编辑
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(chapter)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? '删除中...' : '删除'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
