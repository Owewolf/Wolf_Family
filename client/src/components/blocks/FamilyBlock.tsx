import { useQuery } from "@tanstack/react-query";
import type { FamilyMember as FamilyMemberType, Post } from "@shared/schema";
import FamilyMemberComponent from "@/components/FamilyMember";

export default function FamilyBlock() {
  const { data: familyMembers = [], isLoading } = useQuery<FamilyMemberType[]>({
    queryKey: ['/api/family-members'],
  });

  const { data: allPosts = [] } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  const getPostCountByAuthor = (authorId: number) => {
    return allPosts.filter(post => post.authorId === authorId).length;
  };

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mx-auto mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="family" className="mb-16">
      <div className="card-modern rounded-3xl shadow-modern p-10">
        <h2 className="text-4xl font-dynapuff font-semibold text-forest mb-10 text-center">
          Meet the Wolf's Lair Family
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {familyMembers
            .sort((a, b) => {
              const order = ['Steven', 'Farrah', 'Carter', 'Liesel'];
              return order.indexOf(a.name) - order.indexOf(b.name);
            })
            .map((member) => (
              <FamilyMemberComponent 
                key={member.id} 
                member={member} 
                postCount={getPostCountByAuthor(member.id)}
              />
            ))}
        </div>
      </div>
    </section>
  );
}
