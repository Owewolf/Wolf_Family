import { Link } from "wouter";
import type { FamilyMember } from "@shared/schema";
import { getFamilyMemberColor, getFamilyMemberFont } from "@/lib/utils";
import stevenAvatar from "@assets/ste_av_1750006550241.png";
import carterAvatar from "@assets/car_av_1750006550241.png";
import farrahAvatar from "@assets/far_av_1750006550241.png";
import lieselAvatar from "@assets/lie_av_1750007586846.jpg";

interface FamilyMemberProps {
  member: FamilyMember;
  postCount: number;
}

export default function FamilyMember({ member, postCount }: FamilyMemberProps) {
  const fontClass = getFamilyMemberFont(member.id);
  
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
    <Link href={`/family/${member.id}/posts`}>
      <div className="text-center group cursor-pointer">
        <img 
          src={getAvatarSrc(member.name)} 
          alt={`${member.name} - ${member.role}`}
          className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg group-hover:shadow-xl transition-shadow" 
        />
        <h3 className={`text-xl font-semibold text-forest mb-2 ${fontClass}`}>{member.name}</h3>
        <p className={`text-forest/70 mb-3 ${fontClass}`}>{member.role}</p>
        <div className="flex justify-center space-x-2">
          <span className={`text-white px-3 py-1 rounded-full text-xs font-roboto ${getFamilyMemberColor(member.id)}`}>
            {postCount} Posts
          </span>
        </div>
      </div>
    </Link>
  );
}
