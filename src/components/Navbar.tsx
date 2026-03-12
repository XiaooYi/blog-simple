'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-900 text-white shadow-md mb-8">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-wider">
          极简博客
        </Link>
        <div className="space-x-4 flex items-center">
          <Link href="/" className="hover:text-gray-300">
            首页
          </Link>
          {session ? (
            <>
              <Link href="/admin" className="hover:text-gray-300">
                文章管理
              </Link>
              <Link href="/admin/taxonomies" className="hover:text-gray-300">
                分类与标签
              </Link>
              <Link href="/admin/publish" className="bg-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                发布文章
              </Link>
              <button 
                onClick={() => signOut()} 
                className="text-red-400 hover:text-red-300 ml-4 border border-red-500/30 px-3 py-1.5 rounded-md"
              >
                退出
              </button>
            </>
          ) : (
            <Link href="/api/auth/signin" className="text-gray-400 hover:text-white">
              登录
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}