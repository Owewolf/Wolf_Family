import { useQuery } from "@tanstack/react-query";
import type { Post, FamilyMember } from "@shared/schema";
import Sidebar from "@/components/Sidebar";
import PostCard from "@/components/PostCard";

export default function Posts() {
  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  const { data: familyMembers = [] } = useQuery<FamilyMember[]>({
    queryKey: ['/api/family-members'],
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 py-8">
          <main className="lg:w-2/3">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
              <div className="grid gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
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
          </main>
          <Sidebar />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8 py-8">
        <main className="lg:w-2/3">
          <div className="mb-8">
            <h1 className="text-4xl font-dynapuff font-bold text-forest mb-4">All Posts</h1>
            <p className="text-gray-700 text-lg font-dynapuff">
              Explore all the stories, updates, and adventures from our family farm.
            </p>
          </div>
          
          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <h2 className="text-2xl font-dynapuff font-semibold text-gray-600 mb-4">No Posts Yet</h2>
              <p className="text-gray-500 font-dynapuff">Check back soon for updates from our family!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} familyMembers={familyMembers} />
              ))}
            </div>
          )}
        </main>
        
        <Sidebar />
      </div>
    </div>
  );
}
