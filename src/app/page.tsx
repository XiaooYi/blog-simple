import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

export default async function Home({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 5;

  const totalPosts = await prisma.post.count({ where: { published: true } });
  const totalPages = Math.ceil(totalPosts / pageSize);

  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    include: {
      category: true,
      tags: true,
    }
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">最新文章</h1>
      {posts.length === 0 ? (
        <p className="text-gray-400">目前还没有任何文章。</p>
      ) : (
        <>
          <div className="grid gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/post/${post.id}`}>
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-600 transition-colors cursor-pointer flex flex-col h-full">
                  <h2 className="text-2xl font-semibold text-white mb-2">{post.title}</h2>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <time>
                      {format(new Date(post.createdAt), 'yyyy-MM-dd HH:mm')}
                    </time>
                    {post.category && (
                      <span className="text-indigo-400 bg-indigo-900/20 px-2 py-0.5 rounded">
                        {post.category.name}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 line-clamp-3 mb-4 flex-grow">
                    {post.excerpt || post.content.replace(/[#*_~>\[\]]/g, '').slice(0, 150) + '...'}
                  </p>
                  {post.tags.length > 0 && (
                    <div className="flex gap-2 mt-auto pt-4 border-t border-gray-800/50">
                      {post.tags.map(tag => (
                        <span key={tag.id} className="text-xs text-gray-400 before:content-['#']">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-12">
              {currentPage > 1 ? (
                <Link href={`/?page=${currentPage - 1}`} className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700">
                  上一页
                </Link>
              ) : (
                <span className="px-4 py-2 bg-gray-800/50 text-gray-500 rounded cursor-not-allowed">上一页</span>
              )}
              <span className="px-4 py-2">
                第 {currentPage} 页 / 共 {totalPages} 页
              </span>
              {currentPage < totalPages ? (
                <Link href={`/?page=${currentPage + 1}`} className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700">
                  下一页
                </Link>
              ) : (
                <span className="px-4 py-2 bg-gray-800/50 text-gray-500 rounded cursor-not-allowed">下一页</span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
