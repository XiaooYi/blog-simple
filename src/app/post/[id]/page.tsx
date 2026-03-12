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
    <article className="max-w-4xl mx-auto px-4 py-12">
      {!post.published && (
        <div className="bg-yellow-900/50 text-yellow-500 p-3 rounded-md mb-6 border border-yellow-700">
          ⚠️ 当前文章为草稿状态，仅管理员可见。
        </div>
      )}
      <h1 className="text-4xl font-extrabold text-white mb-4">{post.title}</h1>
      
      <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-8 border-b border-gray-800 pb-4">
        <time>
          {format(new Date(post.createdAt), 'yyyy年MM月dd日 HH:mm')}
        </time>
        {post.category && (
          <span className="bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded text-sm">
            {post.category.name}
          </span>
        )}
        {post.tags.length > 0 && (
          <div className="flex gap-2">
            {post.tags.map(tag => (
              <span key={tag.id} className="text-gray-400 bg-gray-800 px-2 py-1 rounded text-sm">
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-[#fcfaf2] text-gray-800 border border-[#e8dfc8] shadow-sm rounded-lg p-8">
        <MarkdownRenderer content={post.content} />
      </div>
    </article>
  );
}