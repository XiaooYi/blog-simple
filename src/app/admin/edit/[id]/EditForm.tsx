'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { updatePost } from '@/app/actions';

export default function EditForm({ post, categories, tags }: { post: any, categories: any[], tags: any[] }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [published, setPublished] = useState(post.published);
  const [categoryId, setCategoryId] = useState(post.categoryId || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(post.tags.map((t: any) => t.id));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updatePost(post.id, { 
        title, 
        content, 
        published,
        categoryId: categoryId || null,
        tagIds: selectedTags
      });
      router.push('/admin');
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300">分类</label>
              <select 
                value={categoryId} 
                onChange={e => setCategoryId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white p-2"
              >
                <option value="">未分类</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300">状态</label>
              <label className="inline-flex items-center mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-indigo-600 rounded bg-gray-800 border-gray-600"
                />
                <span className="ml-2 text-white text-sm">是否发布（前端可见）</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">标签</label>
            <div className="flex flex-wrap gap-2">
              {tags.map(t => (
                <label key={t.id} className="inline-flex items-center bg-gray-800 border border-gray-700 rounded px-3 py-1 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selectedTags.includes(t.id)}
                    onChange={() => handleTagToggle(t.id)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-300">{t.name}</span>
                </label>
              ))}
              {tags.length === 0 && <span className="text-gray-500 text-sm">暂无标签</span>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">内容 (Markdown)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={20}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? '保存中...' : '保存修改'}
          </button>
        </form>
      </div>
      <div className="bg-[#fcfaf2] text-gray-800 border border-[#e8dfc8] p-6 rounded-lg shadow-sm overflow-y-auto max-h-[800px]">
        <h2 className="text-lg font-bold mb-4 border-b border-[#e8dfc8] pb-2">预览</h2>
        <div className="prose max-w-none">
          {title && <h1>{title}</h1>}
          <MarkdownRenderer content={content || '*(暂无内容)*'} />
        </div>
      </div>
    </div>
  );
}