'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deletePost(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await prisma.post.delete({ where: { id } });

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updatePost(id: string, data: { title: string; content: string; published: boolean; categoryId?: string | null; tagIds?: string[] }) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await prisma.post.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      published: data.published,
      categoryId: data.categoryId || null,
      tags: {
        set: data.tagIds ? data.tagIds.map(id => ({ id })) : []
      }
    }
  });

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/post/${id}`);
}

// Taxonomy Actions
export async function createCategory(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const name = formData.get('name') as string;
  if (!name) return;

  try {
    await prisma.category.create({ data: { name } });
    revalidatePath("/admin/taxonomies");
  } catch (error) {
    if ((error as any).code === 'P2002') {
      // 捕获唯一约束错误 (分类已存在)
      console.error("Category already exists");
    } else {
      throw error;
    }
  }
}

export async function deleteCategory(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/taxonomies");
}

export async function createTag(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const name = formData.get('name') as string;
  if (!name) return;

  try {
    await prisma.tag.create({ data: { name } });
    revalidatePath("/admin/taxonomies");
  } catch (error) {
    if ((error as any).code === 'P2002') {
       // 捕获唯一约束错误 (标签名称重复)
      console.error("Tag already exists");
    } else {
      throw error;
    }
  }
}

export async function deleteTag(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  await prisma.tag.delete({ where: { id } });
  revalidatePath("/admin/taxonomies");
}
