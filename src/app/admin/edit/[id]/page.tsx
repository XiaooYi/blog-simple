export const dynamic = 'force-dynamic';

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditForm from "./EditForm";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");

  const { id } = await params;
  const post = await prisma.post.findUnique({ 
    where: { id },
    include: { tags: true } 
  });

  if (!post) {
    notFound();
  }

  const categories = await prisma.category.findMany();
  const tags = await prisma.tag.findMany();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">编辑文章: {post.title}</h1>
      <EditForm post={post} categories={categories} tags={tags} />
    </div>
  );
}