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
    <div className="max-w-[880px] mx-auto px-4 pb-20">
      <h1 className="text-2xl font-bold mb-6 text-[#1d2129]">最新文章</h1>
      {posts.length === 0 ? (
        <p className="text-[#86909c]">目前还没有任何文章。</p>
      ) : (
        <>
          <div className="grid gap-4">
            {posts.map((post) => (
              <Link key={post.id} href={`/post/${post.id}`}>
                <div className="bg-white border border-[#e4e6eb] rounded-lg p-6 hover:shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col h-full group">
                  <h2 className="text-[22px] font-bold text-[#1d2129] mb-3 group-hover:text-[#1a7af8] transition-colors">{post.title}</h2>
                  <p className="text-[#86909c] text-sm line-clamp-2 mb-4 leading-[1.6]">
                    {post.excerpt || post.content.replace(/[#*_~>\[\]]/g, '').slice(0, 150) + '...'}
                  </p>
                  
                  <div className="flex items-center gap-4 text-[13px] text-[#86909c] mt-auto pt-4 border-t border-[#e4e6eb] border-dashed">
                    <span className="text-[#1d2129] font-medium">技术运营</span>
                    <time>
                      {format(new Date(post.createdAt), 'yyyy-MM-dd')}
                    </time>
                    {post.category && (
                      <span className="text-[#1a7af8] bg-[#e8f3ff] px-2 py-0.5 rounded-sm">
                        {post.category.name}
                      </span>
                    )}
                    {post.tags.length > 0 && (
                        <div className="flex gap-2">
                        {post.tags.map(tag => (
                            <span key={tag.id} className="text-[#86909c] bg-[#f2f3f5] px-2 py-0.5 rounded-sm">
                            #{tag.name}
                            </span>
                        ))}
                        </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-12">
              {currentPage > 1 ? (
                <Link href={`/?page=${currentPage - 1}`} className="px-4 py-2 bg-white border border-[#e4e6eb] text-[#333333] font-medium rounded-md hover:bg-[#f2f3f5] transition-colors">
                  上一页
                </Link>
              ) : (
                <span className="px-4 py-2 bg-[#f2f3f5] text-[#c9cdd4] border border-[#e4e6eb] font-medium rounded-md cursor-not-allowed">上一页</span>
              )}
              <span className="px-4 py-2 text-[#86909c] font-medium">
                {currentPage} / {totalPages}
              </span>
              {currentPage < totalPages ? (
                <Link href={`/?page=${currentPage + 1}`} className="px-4 py-2 bg-white border border-[#e4e6eb] text-[#333333] font-medium rounded-md hover:bg-[#f2f3f5] transition-colors">
                  下一页
                </Link>
              ) : (
                <span className="px-4 py-2 bg-[#f2f3f5] text-[#c9cdd4] border border-[#e4e6eb] font-medium rounded-md cursor-not-allowed">下一页</span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
