import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Home, Users, BookOpen, MapPin, Crown } from "lucide-react";
import stevenAvatar from "@assets/ste_av_1750006550241.png";
import carterAvatar from "@assets/car_av_1750006550241.png";
import farrahAvatar from "@assets/far_av_1750006550241.png";
import lieselAvatar from "@assets/lie_av_1750007586846.jpg";
import type { FamilyMember, Post } from "@shared/schema";
import { getFamilyMemberColor, getFamilyMemberInitial, formatDate, getFamilyMemberFont } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Sidebar() {
  const { data: familyMembers = [] } = useQuery<FamilyMember[]>({
    queryKey: ['/api/family-members'],
  });

  const { data: allPosts = [] } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  const { data: recentPosts = [] } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
    select: (posts: Post[]) => posts.slice(0, 3),
  });

  const getPostCountByAuthor = (authorId: number) => {
    return allPosts.filter(post => post.authorId === authorId).length;
  };

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
      {/* Quick Navigation */}
      <Card className="card-modern shadow-modern border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-dynapuff text-slate">Quick Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <nav className="space-y-2">
            <Link href="/">
              <div className="flex items-center p-4 rounded-xl hover:bg-forest-light transition-all cursor-pointer group">
                <Home className="text-forest mr-3 h-6 w-6 group-hover:text-forest-dark" />
                <span className="font-medium text-slate group-hover:text-forest-dark font-dynapuff">Home</span>
              </div>
            </Link>
            <Link href="/family">
              <div className="flex items-center p-4 rounded-xl hover:bg-forest-light transition-all cursor-pointer group">
                <Users className="text-forest mr-3 h-6 w-6 group-hover:text-forest-dark" />
                <span className="font-medium text-slate group-hover:text-forest-dark font-dynapuff">Family</span>
              </div>
            </Link>
            <Link href="/posts">
              <div className="flex items-center p-4 rounded-xl hover:bg-forest-light transition-all cursor-pointer group">
                <BookOpen className="text-forest mr-3 h-6 w-6 group-hover:text-forest-dark" />
                <span className="font-medium text-slate group-hover:text-forest-dark font-dynapuff">All Posts</span>
              </div>
            </Link>
            <button 
              onClick={() => {
                const mapSection = document.getElementById('map');
                if (mapSection) {
                  mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="flex items-center p-4 rounded-xl hover:bg-forest-light transition-all cursor-pointer w-full text-left group"
            >
              <MapPin className="text-forest mr-3 h-6 w-6 group-hover:text-forest-dark" />
              <span className="font-medium text-slate group-hover:text-forest-dark font-dynapuff">Farm Location</span>
            </button>
            <Link href="/wolf">
              <div className="flex items-center p-4 rounded-xl hover:bg-forest-light transition-all cursor-pointer group">
                <Crown className="text-forest mr-3 h-6 w-6 group-hover:text-forest-dark" />
                <span className="font-medium text-slate group-hover:text-forest-dark font-dynapuff">The Wolf</span>
              </div>
            </Link>
          </nav>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="card-modern shadow-modern border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-dynapuff text-slate">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {recentPosts.map((post) => {
              const author = familyMembers.find(m => m.id === post.authorId);
              return (
                <div key={post.id} className="flex items-start space-x-4 p-3 rounded-xl hover:bg-forest-light transition-all">
                  <img 
                    src={getAvatarSrc(author?.name || '')} 
                    alt={author?.name || 'User'}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div>
                    <p className={`text-sm text-slate font-medium ${getFamilyMemberFont(post.authorId)}`}>
                      {getAuthorName(post.authorId)} posted <span className="font-semibold">"{post.title}"</span>
                    </p>
                    <p className="text-xs text-slate/60 mt-1">{formatDate(post.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Farm Stats */}
      <Card className="card-modern shadow-modern border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-dynapuff text-slate">Farm Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
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
            <div className="flex justify-between items-center p-3 rounded-xl bg-forest-light">
              <span className="text-slate font-medium font-dynapuff">Monthly Visitors</span>
              <span className="font-bold text-forest text-lg font-dynapuff">2.3k</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
