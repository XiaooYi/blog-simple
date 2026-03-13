import { prisma } from '@/lib/prisma';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { Metadata } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    return { title: '没找到文章 - 极简博客' };
  }

  return {
    title: `${post.title} - 极简全栈博客`,
    description: post.excerpt || post.content.substring(0, 150),
  };
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      category: true,
      tags: true,
    }
  });

  if (!post) {
    notFound();
  }

  // 不是草稿或者管理员才能看草稿
  if (!post.published) {
    const session = await getServerSession(authOptions);
    if (!session) {
      notFound();
    }
  }

  return (
    <div className="w-full bg-[#f2f3f5] min-h-screen pt-8 pb-20">
      <article className="max-w-[880px] mx-auto bg-white rounded-xl shadow-sm border border-[#e4e6eb] px-6 sm:px-12 py-10">
        {!post.published && (
          <div className="bg-yellow-50 text-yellow-600 p-3 rounded-md mb-6 border border-yellow-200 text-sm">
            ⚠️ 当前文章为草稿状态，仅管理员可见。
          </div>
        )}
        <h1 className="text-3xl sm:text-[32px] sm:leading-[1.4] font-bold text-[#1d2129] mb-6">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-[#86909c] mb-10 pb-6 border-b border-[#e4e6eb] text-sm font-medium">
          <span className="text-[#1d2129]">技术运营</span>
          <time>
            {format(new Date(post.createdAt), 'yyyy-MM-dd HH:mm:ss')}
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

        <div className="text-[#333333]">
          <MarkdownRenderer content={post.content} />
        </div>
      </article>
    </div>
  );
}