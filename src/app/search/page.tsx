import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";
import type { PostProps } from "@/components/PostCard";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; district?: string };
}) {
  const query = searchParams.q || "";
  const category = searchParams.category || "";
  const district = searchParams.district || "";

  // Build the dynamic where clause based on what filters are present
  const whereClause: any = {
    status: "APPROVED",
  };

  if (query) {
    whereClause.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { content: { contains: query, mode: "insensitive" } },
    ];
  }

  if (category) {
    whereClause.category = { equals: category, mode: "insensitive" };
  }

  if (district) {
    whereClause.district = { equals: district, mode: "insensitive" };
  }

  const posts = await prisma.post.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto mt-8 mb-20 px-4">
      <div className="mb-8 border-b border-border-subtle pb-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-navy mb-4">
          Search & Filter
        </h1>
        
        <form method="GET" action="/search" className="flex flex-col md:flex-row gap-4 bg-surface p-4 rounded-xl border border-border-subtle shadow-sm">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search keywords..."
            className="flex-1 px-4 py-2 border border-border-subtle rounded focus:ring-1 focus:ring-navy outline-none"
          />
          <select 
            name="category" 
            defaultValue={category}
            className="px-4 py-2 border border-border-subtle rounded focus:ring-1 focus:ring-navy outline-none bg-white min-w-[150px]"
          >
            <option value="">All Categories</option>
            <option value="Politics">Politics</option>
            <option value="Crime">Crime</option>
            <option value="Education">Education</option>
            <option value="Sports">Sports</option>
          </select>
          <select 
            name="district" 
            defaultValue={district}
            className="px-4 py-2 border border-border-subtle rounded focus:ring-1 focus:ring-navy outline-none bg-white min-w-[150px]"
          >
            <option value="">All Districts</option>
            <option value="Patna">Patna</option>
            <option value="Gaya">Gaya</option>
            <option value="Muzaffarpur">Muzaffarpur</option>
            <option value="Bhagalpur">Bhagalpur</option>
          </select>
          <button type="submit" className="bg-navy hover:bg-slate-800 text-white font-medium px-6 py-2 rounded transition-colors">
            Search
          </button>
        </form>
      </div>

      <div className="mb-4 text-sm text-text-secondary font-medium">
        Found {posts.length} {posts.length === 1 ? "result" : "results"}
        {query && <span> for "<span className="text-navy font-bold">{query}</span>"</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post as PostProps} />
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-20 bg-surface border border-border-subtle rounded-xl">
          <h2 className="text-xl font-bold text-navy mb-2">No results found</h2>
          <p className="text-text-secondary">Try adjusting your filters or searching with different keywords.</p>
        </div>
      )}
    </div>
  );
}
