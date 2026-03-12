'use client';

import { useTransition } from 'react';
import { deleteCategory, deleteTag } from '@/app/actions';

export default function DeleteTaxonomyBtn({ id, type }: { id: string, type: 'category' | 'tag' }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`确定要删除这个${type === 'category' ? '分类' : '标签'}吗？`)) {
      startTransition(async () => {
        if (type === 'category') {
          await deleteCategory(id);
        } else {
          await deleteTag(id);
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-400 hover:text-red-300 text-sm disabled:opacity-50"
    >
      {isPending ? '删除中...' : '删除'}
    </button>
  );
}