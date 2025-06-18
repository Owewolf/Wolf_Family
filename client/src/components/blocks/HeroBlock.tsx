import { Button } from "@/components/ui/button";

interface HeroBlockProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  onScrollToMap?: () => void;
}

export default function HeroBlock({ title, subtitle, imageUrl, onScrollToMap }: HeroBlockProps) {
  return (
    <section className="mb-16">
      <div className="card-modern rounded-3xl shadow-modern-lg overflow-hidden">
        <div className="relative h-[450px] lg:h-[600px]">
          <img 
            src={imageUrl} 
            alt="Wolf's Lair Farm landscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent flex items-center justify-center">
            <div className="text-center text-white px-6 max-w-4xl mx-auto">
              <h1 className="text-5xl lg:text-7xl font-dynapuff font-bold mb-6 leading-tight">{title}</h1>
              <p className="text-xl lg:text-3xl mb-8 opacity-95 font-roboto font-light">{subtitle}</p>
              <Button 
                onClick={onScrollToMap}
                className="bg-forest hover:bg-forest-dark text-white px-10 py-4 rounded-full text-lg font-roboto font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Discover Our Location
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
