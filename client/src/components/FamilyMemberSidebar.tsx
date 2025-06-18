import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Home, Users, BookOpen, ArrowLeft, Crown } from "lucide-react";
import stevenAvatar from "@assets/ste_av_1750006550241.png";
import carterAvatar from "@assets/car_av_1750006550241.png";
import farrahAvatar from "@assets/far_av_1750006550241.png";
import lieselAvatar from "@assets/lie_av_1750007586846.jpg";
import type { FamilyMember, Post } from "@shared/schema";
import { getFamilyMemberColor, getFamilyMemberInitial, formatDate, getFamilyMemberFont } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PostCard from "@/components/PostCard";

interface FamilyMemberSidebarProps {
  currentMemberId: number;
}

export default function FamilyMemberSidebar({ currentMemberId }: FamilyMemberSidebarProps) {
  const { data: familyMembers = [] } = useQuery<FamilyMember[]>({
    queryKey: ['/api/family-members'],
  });

  const { data: allPosts = [] } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  // Get posts from other family members (excluding current member)
  const otherMembersPosts = allPosts
    .filter(post => post.authorId !== currentMemberId)
    .slice(0, 3);

  const otherMembers = familyMembers.filter(member => member.id !== currentMemberId);

  const getAuthorName = (authorId: number) => {
    const member = familyMembers.find(m => m.id === authorId);
    return member ? member.name : 'Unknown';
  };

  // Get the correct avatar image based on member name
  const getAvatarSrc = (name: string) => {
    switch (name.toLowerCase()) {
      case 'steven':
        return stevenAvatar;
      case 'carter':
        return carterAvatar;
      case 'farrah':
        return farrahAvatar;
      case 'liesel':
        return lieselAvatar;
      default:
        return stevenAvatar;
    }
  };

  return (
    <aside className="lg:w-1/3 space-y-8">
      {/* Back Navigation */}
      <Card className="card-modern shadow-modern border-0">
        <CardContent className="p-6">
          <Link href="/family">
            <div className="flex items-center p-4 rounded-xl hover:bg-forest-light transition-all cursor-pointer group">
              <ArrowLeft className="text-forest mr-3 h-6 w-6 group-hover:text-forest-dark" />
              <span className="font-dynapuff font-medium text-forest group-hover:text-forest-dark">Back to Family</span>
            </div>
          </Link>
          <Link href="/">
            <div className="flex items-center p-4 rounded-xl hover:bg-forest-light transition-all cursor-pointer group">
              <Home className="text-forest mr-3 h-6 w-6 group-hover:text-forest-dark" />
              <span className="font-dynapuff font-medium text-forest group-hover:text-forest-dark">Home</span>
            </div>
          </Link>
          <Link href="/posts">
            <div className="flex items-center p-4 rounded-xl hover:bg-forest-light transition-all cursor-pointer group">
              <BookOpen className="text-forest mr-3 h-6 w-6 group-hover:text-forest-dark" />
              <span className="font-dynapuff font-medium text-forest group-hover:text-forest-dark">All Posts</span>
            </div>
          </Link>
          <Link href="/wolf">
            <div className="flex items-center p-4 rounded-xl hover:bg-forest-light transition-all cursor-pointer group">
              <Crown className="text-forest mr-3 h-6 w-6 group-hover:text-forest-dark" />
              <span className="font-dynapuff font-medium text-forest group-hover:text-forest-dark">The Wolf</span>
            </div>
          </Link>
        </CardContent>
      </Card>

      {/* Other Family Members */}
      <Card className="card-modern shadow-modern border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-dynapuff text-forest">Other Family Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {otherMembers.map((member) => (
              <Link key={member.id} href={`/family/${member.id}/posts`}>
                <div className="flex items-center p-4 rounded-xl hover:bg-forest-light transition-all cursor-pointer group">
                  <img 
                    src={getAvatarSrc(member.name)} 
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover mr-4" 
                  />
                  <div>
                    <h3 className={`font-semibold text-forest group-hover:text-forest-dark ${getFamilyMemberFont(member.id)}`}>{member.name}</h3>
                    <p className={`text-sm text-forest/60 ${getFamilyMemberFont(member.id)}`}>{member.role}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts from Other Members */}
      <Card className="card-modern shadow-modern border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-dynapuff text-forest">Recent Posts from Family</CardTitle>
        </CardHeader>
        <CardContent>
          {otherMembersPosts.length === 0 ? (
            <p className="text-forest/60 font-dynapuff text-center py-4">No other posts available</p>
          ) : (
            <div className="space-y-4">
              {otherMembersPosts.map((post) => {
                const author = familyMembers.find(m => m.id === post.authorId);
                return (
                  <div key={post.id} className="border-b border-forest-light/50 pb-4 last:border-b-0">
                    <div className="flex items-start space-x-3 mb-3">
                      <img 
                        src={getAvatarSrc(author?.name || 'Unknown')} 
                        alt={author?.name || 'Unknown'}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0" 
                      />
                      <div>
                        <p className={`text-sm text-forest font-medium ${getFamilyMemberFont(post.authorId)}`}>
                          {getAuthorName(post.authorId)}
                        </p>
                        <p className="text-xs font-dynapuff text-forest/60">{formatDate(post.createdAt)}</p>
                      </div>
                    </div>
                    <h4 className={`font-semibold text-forest mb-2 ${getFamilyMemberFont(post.authorId)}`}>{post.title}</h4>
                    <p className={`text-sm text-forest/70 leading-relaxed ${getFamilyMemberFont(post.authorId)}`}>{post.excerpt}</p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Farm Stats */}
      <Card className="card-modern shadow-modern border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-dynapuff text-slate">Farm Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-xl bg-forest-light">
              <span className="text-slate font-medium font-dynapuff">Total Posts</span>
              <span className="font-bold text-forest text-lg font-dynapuff">{allPosts.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-forest-light">
              <span className="text-slate font-medium font-dynapuff">Family Members</span>
              <span className="font-bold text-forest text-lg font-dynapuff">{familyMembers.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-forest-light">
              <span className="text-slate font-medium font-dynapuff">Farm Since</span>
              <span className="font-bold text-forest text-lg font-dynapuff">2018</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}