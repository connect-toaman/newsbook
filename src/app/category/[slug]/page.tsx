import PostCard from "@/components/PostCard";
import type { PostProps } from "@/components/PostCard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getPostsByCategory(category: string): Promise<PostProps[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: "APPROVED",
        category: {
          equals: category,
          mode: "insensitive"
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return posts as PostProps[];
  } catch (error) {
    console.error(`Failed to fetch posts for category ${category}:`, error);
    return [];
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryName = decodeURIComponent(params.slug)
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
    
  const posts = await getPostsByCategory(categoryName);

  return (
    <div className="w-full">
      <div className="mb-10 border-b border-border-subtle pb-6">
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-navy">
          {categoryName}
        </h1>
        <p className="mt-3 text-lg text-text-secondary">
          Explore the latest stories in {categoryName}.
        </p>
      </div>

      <div className="space-y-12">
        {posts.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-24 text-center border border-border-subtle rounded-xl bg-surface">
            <h2 className="font-serif text-2xl font-bold text-navy mb-3">No stories found</h2>
            <p className="text-text-secondary mb-6 text-sm">There is currently no published news in the {categoryName} category.</p>
            <Link 
              href="/create" 
              className="inline-flex items-center justify-center px-6 py-2.5 bg-navy text-white text-sm font-medium rounded hover:bg-slate-800 transition-colors"
            >
              Be the first to report
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
