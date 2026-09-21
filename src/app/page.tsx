import PostCard from "@/components/PostCard";
import type { PostProps } from "@/components/PostCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getPosts(): Promise<PostProps[]> {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return posts as PostProps[];
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

export default async function Home() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 text-center">
        <h2 className="font-serif text-3xl font-bold text-navy mb-3">Latest News</h2>
        <p className="text-text-secondary mb-8">No published stories yet.</p>
        <p className="text-sm text-text-secondary mb-6">Be the first to share a verified news update.</p>
        <a 
          href="/create" 
          className="inline-flex items-center justify-center px-6 py-2.5 bg-navy text-white text-sm font-medium rounded hover:bg-slate-800 transition-colors"
        >
          Create News
        </a>
      </div>
    );
  }

  const [featuredPost, ...secondaryPosts] = posts;

  return (
    <div className="w-full">
      <div className="mb-10 border-b border-border-subtle pb-6">
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-navy">
          Latest News
        </h1>
        <p className="mt-3 text-lg text-text-secondary">
          Stay informed about the latest news and updates from Bihar.
        </p>
      </div>

      <div className="space-y-12">
        {/* Featured Story */}
        <section>
           <PostCard post={featuredPost} featured={true} />
        </section>

        {/* Secondary Grid */}
        {secondaryPosts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl font-bold text-navy">Recent Updates</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {secondaryPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
