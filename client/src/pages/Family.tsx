import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { FamilyMember, Post } from "@shared/schema";
import Sidebar from "@/components/Sidebar";
import FamilyBlock from "@/components/blocks/FamilyBlock";
import { getFamilyMemberFont } from "@/lib/utils";
import stevenAvatar from "@assets/ste_av_1750006550241.png";
import carterAvatar from "@assets/car_av_1750006550241.png";
import farrahAvatar from "@assets/far_av_1750006550241.png";
import lieselAvatar from "@assets/lie_av_1750007586846.jpg";

export default function Family() {
  const { data: familyMembers = [], isLoading } = useQuery<FamilyMember[]>({
    queryKey: ['/api/family-members'],
  });

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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 py-8">
          <main className="lg:w-2/3">
            <div className="animate-pulse">
              <div className="bg-white rounded-2xl shadow-lg p-8">
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
            <h1 className="text-4xl font-dynapuff font-bold text-forest mb-4">Our Family</h1>
            <p className="text-forest/70 text-lg font-dynapuff">
              Meet the wonderful people who make Wolf's Lair the special place it is. 
              Each family member brings their own unique perspective and contributes to our farm's story.
            </p>
          </div>
          
          <FamilyBlock />
          
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-dynapuff font-semibold text-forest mb-6">Family Details</h2>
            <div className="space-y-6">
              {familyMembers.map((member) => (
                <div key={member.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <Link href={`/family/${member.id}/posts`}>
                    <div className="flex items-start space-x-4 cursor-pointer hover:bg-gray-50 rounded-lg p-4 -m-4 transition-colors">
                      <img 
                        src={getAvatarSrc(member.name)} 
                        alt={member.name}
                        className="w-16 h-16 rounded-full object-cover shadow-lg" 
                      />
                      <div>
                        <h3 className={`text-xl font-semibold text-forest mb-1 hover:text-forest-dark transition-colors ${getFamilyMemberFont(member.id)}`}>{member.name}</h3>
                        <p className={`text-gray-600 font-medium mb-2 ${getFamilyMemberFont(member.id)}`}>{member.role}</p>
                        <p className={`text-gray-700 ${getFamilyMemberFont(member.id)}`}>{member.description}</p>
                      </div>
                    </div>
                  </Link>
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
