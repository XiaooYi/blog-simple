'use client';

import { useTransition } from 'react';
import { deletePost } from '@/app/actions';

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm('确定要删除这篇文章吗？操作不可恢复。')) {
      startTransition(async () => {
        await deletePost(id);
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-400 hover:text-red-300 disabled:opacity-50"
    >
      {isPending ? '删除中...' : '删除'}
    </button>
  );
}