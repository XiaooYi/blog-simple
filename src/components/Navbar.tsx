'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white text-[#1d2129] shadow-sm border-b border-[#e4e6eb] mb-8 sticky top-0 z-50">
      <div className="max-w-[880px] mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-wider hover:text-[#1a7af8] transition-colors">
          极简博客
        </Link>
        <div className="space-x-6 flex items-center text-sm font-medium">
          <Link href="/" className="text-[#86909c] hover:text-[#1a7af8] transition-colors">
            首页
          </Link>
          {session ? (
            <>
              <Link href="/admin" className="text-[#86909c] hover:text-[#1a7af8] transition-colors">
                文章管理
              </Link>
              <Link href="/admin/taxonomies" className="text-[#86909c] hover:text-[#1a7af8] transition-colors">
                分类与标签
              </Link>
              <Link href="/admin/publish" className="bg-[#1a7af8] text-white px-4 py-2 rounded-md hover:bg-[#1664c0] transition-colors shadow-sm font-medium">
                发布文章
              </Link>
              <button
                onClick={() => signOut()}
                className="text-[#eb5757] hover:bg-[#fceeee] px-3 py-1.5 rounded-md transition-colors"
              >
                退出
              </button>
            </>
          ) : (
            <Link href="/api/auth/signin" className="text-[#86909c] hover:text-[#1a7af8] transition-colors">
              登录
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}