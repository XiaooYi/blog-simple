export const dynamic = 'force-dynamic';

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import DeleteButton from "./DeleteButton";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">文章管理</h1>
        <Link 
          href="/admin/publish" 
          className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700"
        >
          撰写新文章
        </Link>
      </div>

      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800 text-gray-300">
              <th className="p-4 border-b border-gray-700">标题</th>
              <th className="p-4 border-b border-gray-700">状态</th>
              <th className="p-4 border-b border-gray-700">发布时间</th>
              <th className="p-4 border-b border-gray-700">操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-800/50 border-b border-gray-800 last:border-0">
                <td className="p-4 font-medium text-white">{post.title}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${post.published ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                    {post.published ? '已发布' : '草稿'}
                  </span>
                </td>
                <td className="p-4 text-gray-400">
                  {format(new Date(post.createdAt), 'yyyy-MM-dd')}
                </td>
                <td className="p-4 flex gap-3">
                  <Link href={`/admin/edit/${post.id}`} className="text-indigo-400 hover:text-indigo-300">
                    编辑
                  </Link>
                  <DeleteButton id={post.id} />
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  暂无文章
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}