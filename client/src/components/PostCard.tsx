import type { Post, FamilyMember } from "@shared/schema";
import { getFamilyMemberColor, formatDate, getFamilyMemberFont } from "@/lib/utils";
import stevenAvatar from "@assets/ste_av_1750006550241.png";
import carterAvatar from "@assets/car_av_1750006550241.png";
import farrahAvatar from "@assets/far_av_1750006550241.png";
import lieselAvatar from "@assets/lie_av_1750007586846.jpg";

interface PostCardProps {
  post: Post;
  familyMembers: FamilyMember[];
}

export default function PostCard({ post, familyMembers }: PostCardProps) {
  const author = familyMembers.find(m => m.id === post.authorId);
  const fontClass = getFamilyMemberFont(post.authorId);
  
  // Get the correct avatar image based on author name
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
  
  return (
    <article className="card-modern rounded-2xl overflow-hidden hover:shadow-modern-lg transition-all transform hover:-translate-y-1">
      {post.imageUrl && (
        <img 
          src={post.imageUrl} 
          alt={post.title}
          className="w-full h-52 object-cover" 
        />
      )}
      <div className="p-6">
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <img 
              src={getAvatarSrc(author?.name)} 
              alt={author?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover mr-3"
            />
            <span className={`text-forest font-semibold text-sm ${fontClass}`}>
              {author?.name || 'Unknown'}
            </span>
          </div>
          <span className="text-forest/60 text-sm ml-4 font-roboto">
            {formatDate(post.createdAt)}
          </span>
        </div>
        <h3 className={`text-xl font-semibold mb-3 text-forest ${fontClass}`}>{post.title}</h3>
        <p className={`text-forest/70 leading-relaxed ${fontClass}`}>{post.excerpt}</p>
      </div>
    </article>
  );
}
