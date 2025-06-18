import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Home, Users, BookOpen, ArrowLeft, Crown, Trophy, Plane } from "lucide-react";
import stevenAvatar from "@assets/ste_av_1750006550241.png";
import carterAvatar from "@assets/car_av_1750006550241.png";
import farrahAvatar from "@assets/far_av_1750006550241.png";
import lieselAvatar from "@assets/lie_av_1750007586846.jpg";
import type { FamilyMember, Post } from "@shared/schema";
import { getFamilyMemberColor, getFamilyMemberInitial, formatDate, getFamilyMemberFont } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccomplishmentsSidebar() {
  const [location] = useLocation();

  const { data: familyMembers = [] } = useQuery<FamilyMember[]>({
    queryKey: ['/api/family-members'],
  });

  const { data: allPosts = [] } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  // Get posts from other family members (excluding Steven)
  const otherMembersPosts = allPosts
    .filter(post => post.authorId !== 1)
    .slice(0, 3);

  const otherMembers = familyMembers.filter(member => member.id !== 1);

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

  const accomplishmentPages = [
    { path: "/accomplishments/flight-hours", label: "Flight Hours", icon: Plane },
    { path: "/accomplishments/aviation-certifications", label: "Aviation Certifications", icon: Trophy },
    { path: "/accomplishments/tcas-safety", label: "TCAS Safety", icon: Trophy },
    { path: "/accomplishments/machine-learning", label: "Machine Learning", icon: Trophy },
    { path: "/accomplishments/python-programming", label: "Python Programming", icon: Trophy },
    { path: "/accomplishments/network-security", label: "Network Security", icon: Trophy },
  ];

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

      {/* Accomplishments */}
      <Card className="card-modern shadow-modern border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-dynapuff text-forest">Accomplishments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {accomplishmentPages.map((page) => {
              const Icon = page.icon;
              const isActive = location === page.path;
              
              return (
                <Link key={page.path} href={page.path}>
                  <div className={`flex items-center p-4 rounded-xl transition-all cursor-pointer group ${
                    isActive 
                      ? 'bg-forest text-white' 
                      : 'hover:bg-forest-light'
                  }`}>
                    <Icon className={`mr-3 h-6 w-6 ${
                      isActive 
                        ? 'text-white' 
                        : 'text-forest group-hover:text-forest-dark'
                    }`} />
                    <span className={`font-dynapuff font-medium ${
                      isActive 
                        ? 'text-white' 
                        : 'text-forest group-hover:text-forest-dark'
                    }`}>{page.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
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
                      <span 
                        className={`text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${getFamilyMemberColor(post.authorId)}`}
                      >
                        {getFamilyMemberInitial(author?.name || 'U')}
                      </span>
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
          <CardTitle className="text-2xl font-dynapuff text-forest">Farm Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="font-dynapuff text-forest">Total Posts</span>
              <span className="text-2xl font-bold text-forest">{allPosts.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-dynapuff text-forest">Family Members</span>
              <span className="text-2xl font-bold text-forest">{familyMembers.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-dynapuff text-forest">Farm Since</span>
              <span className="text-2xl font-bold text-forest">2018</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}