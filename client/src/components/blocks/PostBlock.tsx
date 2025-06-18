import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Post, FamilyMember } from "@shared/schema";
import { getFamilyMemberColor, formatDate } from "@/lib/utils";
import PostCard from "@/components/PostCard";

export default function PostBlock() {
  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
    select: (posts: Post[]) => posts.slice(0, 2), // Show only latest 2 posts
  });

  const { data: familyMembers = [] } = useQuery<FamilyMember[]>({
    queryKey: ['/api/family-members'],
  });

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-gray-50 rounded-xl overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <div className="card-modern rounded-3xl shadow-modern p-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-dynapuff font-semibold text-forest">Latest from the Farm</h2>
          <Link href="/posts">
            <span className="text-forest hover:text-forest-dark font-roboto font-semibold text-lg transition-colors cursor-pointer">
              View All Posts
            </span>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} familyMembers={familyMembers} />
          ))}
        </div>
      </div>
    </section>
  );
}
