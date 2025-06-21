import { useQuery } from "@tanstack/react-query";
import type { Block } from "@shared/schema";
import Sidebar from "@/components/Sidebar";
import HeroBlock from "@/components/blocks/HeroBlock";
import ContentBlock from "@/components/blocks/ContentBlock";
import PostBlock from "@/components/blocks/PostBlock";
import FamilyBlock from "@/components/blocks/FamilyBlock";
import MapBlock from "@/components/blocks/MapBlock";

export default function Home() {
  const { data: blocks = [], isLoading } = useQuery<Block[]>({
    queryKey: ["/api/blocks?pageId=home"],
  });

  const scrollToMap = () => {
    const mapSection = document.getElementById("map");
    if (mapSection) {
      mapSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 py-8">
          <main className="lg:w-2/3">
            <div className="animate-pulse space-y-12">
              <div className="bg-white rounded-2xl shadow-lg p-8 h-96"></div>
              <div className="bg-white rounded-2xl shadow-lg p-8 h-64"></div>
              <div className="bg-white rounded-2xl shadow-lg p-8 h-96"></div>
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
          <HeroBlock
            title="Welcome to Wolf's Lair"
            subtitle="Our Heart in the Tsitsikamma"
            imageUrl="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1932&h=1088"
            onScrollToMap={scrollToMap}
          />

          <ContentBlock
            title="Our Story"
            content="Welcome to Wolf's Lair, where our family has been cultivating the land and creating memories for generations. Nestled in the beautiful South African countryside, our farm represents more than just agriculture – it's a testament to family values, hard work, and our deep connection to the earth.

Join us as we share our daily adventures, farming insights, and the joys of rural family life. Each member of our family brings their unique perspective to our shared story."
          />

          <PostBlock />
          <MapBlock />
          <FamilyBlock />
        </main>

        <Sidebar />
      </div>
    </div>
  );
}
