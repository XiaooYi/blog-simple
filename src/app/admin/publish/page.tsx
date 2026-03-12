import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import PublishForm from "./PublishForm";
import { prisma } from "@/lib/prisma";

export default async function PublishPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin");
  }

  const categories = await prisma.category.findMany();
  const tags = await prisma.tag.findMany();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">发布新文章</h1>
      <PublishForm categories={categories} tags={tags} />
    </div>
  );
}