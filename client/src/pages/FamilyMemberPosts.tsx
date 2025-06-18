import { useParams } from "wouter";
import { Link } from "wouter";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post, FamilyMember } from "@shared/schema";
import FamilyMemberSidebar from "@/components/FamilyMemberSidebar";
import PostCard from "@/components/PostCard";
import PostForm from "@/components/PostForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { getFamilyMemberFont } from "@/lib/utils";
import { Plus, MoreVertical, Edit, Trash2 } from "lucide-react";
import stevenAvatar from "@assets/ste_av_1750006550241.png";
import carterAvatar from "@assets/car_av_1750006550241.png";
import farrahAvatar from "@assets/far_av_1750006550241.png";
import lieselAvatar from "@assets/lie_av_1750007586846.jpg";

export default function FamilyMemberPosts() {
  const { id } = useParams<{ id: string }>();
  const memberId = parseInt(id || '0');
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: member, isLoading: memberLoading } = useQuery<FamilyMember>({
    queryKey: [`/api/family-members/${memberId}`],
    enabled: !isNaN(memberId) && memberId > 0,
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: [`/api/posts?author=${memberId}`],
    enabled: !isNaN(memberId) && memberId > 0,
  });

  const { data: familyMembers = [] } = useQuery<FamilyMember[]>({
    queryKey: ['/api/family-members'],
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/posts?author=${memberId}`] });
      toast({
        title: "Post deleted successfully!",
        description: "The post has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to delete post",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Check if current user can manage posts for this member
  const canManagePosts = isAuthenticated && (user?.id === memberId || isAdmin);

  const handleDeletePost = (post: Post) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePostMutation.mutate(post.id);
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setShowPostForm(true);
  };

  // Get the correct avatar image based on member name
  const getAvatarSrc = (name: string | undefined) => {
    if (!name) return stevenAvatar;
    
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

  if (memberLoading || postsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 py-8">
          <main className="lg:w-2/3">
            <div className="animate-pulse">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              <div className="grid gap-6">
                {[1, 2, 3].map((i) => (
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
          <FamilyMemberSidebar currentMemberId={memberId} />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 py-8">
          <main className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <h1 className="text-2xl font-serif font-semibold text-gray-600 mb-4">Family Member Not Found</h1>
              <p className="text-gray-500">The requested family member could not be found.</p>
            </div>
          </main>
          <FamilyMemberSidebar currentMemberId={memberId} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8 py-8">
        <main className="lg:w-2/3">
          <div className="card-modern rounded-3xl shadow-modern p-10 mb-8">
            <div className="flex items-center space-x-8">
              <img 
                src={getAvatarSrc(member.name)} 
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover shadow-modern" 
              />
              <div>
                <h1 className={`text-4xl font-bold text-forest mb-3 ${getFamilyMemberFont(memberId)}`}>
                  {member.name}
                  {memberId === 1 && <span className="text-2xl font-medium text-forest/70 ml-3">- Key Accomplishments</span>}
                </h1>
                <p className={`text-forest/80 text-xl font-medium mb-2 ${getFamilyMemberFont(memberId)}`}>{member.role}</p>
                <p className={`text-forest/70 text-lg leading-relaxed ${getFamilyMemberFont(memberId)}`}>{member.description}</p>
              </div>
            </div>
          </div>
          
          {/* Key Accomplishments for Steven */}
          {memberId === 1 && (
            <div className="card-modern rounded-3xl shadow-modern p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-forest">Key Accomplishments</h2>
                <Link href="/wolf">
                  <span className="text-sm text-forest/60 cursor-pointer hover:text-forest">
                    View All Details →
                  </span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <span className="text-xl">✈️</span>
                  <span className="text-forest/80">23,500+ commercial flight hours with exemplary safety record</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-xl">🏆</span>
                  <span className="text-forest/80">Advanced certifications in aviation weather systems and navigation</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-xl">🐍</span>
                  <span className="text-forest/80">Python programming expertise for agricultural data analysis</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-xl">🔒</span>
                  <span className="text-forest/80">Network security specialist using Wireshark and pfSense systems</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-xl">🌾</span>
                  <span className="text-forest/80">Machine learning implementation for crop prediction systems</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-xl">🛡️</span>
                  <span className="text-forest/80">TCAS safety protocol implementation for farm equipment</span>
                </div>
              </div>
            </div>
          )}

          <div className="mb-8 flex items-center justify-between">
            <h2 className={`text-3xl font-semibold text-forest ${getFamilyMemberFont(memberId)}`}>
              Posts by {member.name} ({posts.length})
            </h2>
            {canManagePosts && (
              <Dialog open={showPostForm} onOpenChange={setShowPostForm}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingPost(null)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <PostForm
                    mode={editingPost ? 'edit' : 'create'}
                    initialData={editingPost ? {
                      id: editingPost.id,
                      title: editingPost.title,
                      content: editingPost.content,
                      excerpt: editingPost.excerpt,
                      category: editingPost.category,
                      imageUrl: editingPost.imageUrl || '',
                    } : undefined}
                    onSuccess={() => {
                      setShowPostForm(false);
                      setEditingPost(null);
                      queryClient.invalidateQueries({ queryKey: [`/api/posts?author=${memberId}`] });
                    }}
                    onCancel={() => {
                      setShowPostForm(false);
                      setEditingPost(null);
                    }}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          {posts.length === 0 ? (
            <div className="card-modern rounded-3xl shadow-modern p-10 text-center">
              <h3 className={`text-2xl font-semibold text-forest/60 mb-4 ${getFamilyMemberFont(memberId)}`}>No Posts Yet</h3>
              <p className={`text-forest/50 text-lg ${getFamilyMemberFont(memberId)}`}>{member.name} hasn't posted anything yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-8">
              {posts.map((post) => (
                <div key={post.id} className="relative">
                  <PostCard post={post} familyMembers={familyMembers} />
                  {canManagePosts && (
                    <div className="absolute top-4 right-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditPost(post)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Post
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeletePost(post)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
        
        <FamilyMemberSidebar currentMemberId={memberId} />
      </div>
    </div>
  );
}
