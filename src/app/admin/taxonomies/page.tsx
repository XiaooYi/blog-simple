export const dynamic = 'force-dynamic';

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createCategory, createTag } from "@/app/actions";
import DeleteTaxonomyBtn from "./DeleteTaxonomyBtn";

export default async function TaxonomiesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");

  const categories = await prisma.category.findMany();
  const tags = await prisma.tag.findMany();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">分类与标签管理</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Categories Section */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-6">分类 (Categories)</h2>
          <form action={createCategory} className="flex gap-2 mb-6">
            <input 
              name="name" 
              required 
              placeholder="新分类名称" 
              className="flex-1 bg-gray-800 border border-gray-700 text-white p-2 rounded focus:border-indigo-500 focus:outline-none"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
              添加
            </button>
          </form>
          <ul className="space-y-3">
            {categories.map(c => (
              <li key={c.id} className="flex justify-between items-center bg-gray-800 p-3 rounded">
                <span>{c.name}</span>
                <DeleteTaxonomyBtn id={c.id} type="category" />
              </li>
            ))}
            {categories.length === 0 && <p className="text-gray-500">暂无分类</p>}
          </ul>
        </div>

        {/* Tags Section */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-6">标签 (Tags)</h2>
          <form action={createTag} className="flex gap-2 mb-6">
            <input 
              name="name" 
              required 
              placeholder="新标签名称" 
              className="flex-1 bg-gray-800 border border-gray-700 text-white p-2 rounded focus:border-indigo-500 focus:outline-none"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
              添加
            </button>
          </form>
          <ul className="space-y-3">
            {tags.map(t => (
              <li key={t.id} className="flex justify-between items-center bg-gray-800 p-3 rounded">
                <span>{t.name}</span>
                <DeleteTaxonomyBtn id={t.id} type="tag" />
              </li>
            ))}
            {tags.length === 0 && <p className="text-gray-500">暂无标签</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}