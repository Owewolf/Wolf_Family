import { Link } from "wouter";
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="gradient-hero text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-dynapuff font-bold mb-4">Wolf's Lair</h3>
            <p className="text-white/80 mb-6 font-dynapuff">
              A family farm dedicated to sustainable agriculture and sharing our rural lifestyle with the world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-dynapuff font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <span className="text-white/70 hover:text-white transition-colors cursor-pointer font-dynapuff">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/family">
                  <span className="text-white/70 hover:text-white transition-colors cursor-pointer font-dynapuff">Family</span>
                </Link>
              </li>
              <li>
                <Link href="/posts">
                  <span className="text-white/70 hover:text-white transition-colors cursor-pointer font-dynapuff">Posts</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-dynapuff font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-white/70 font-dynapuff">
              <p className="flex items-center">
                <MapPin className="h-5 w-5 mr-3" />
                Wolf's Lair, South Africa
              </p>
              <p className="flex items-center">
                <Mail className="h-5 w-5 mr-3" />
                info@wolfslair.co.za
              </p>
              <p className="flex items-center">
                <Phone className="h-5 w-5 mr-3" />
                +27 XXX XXX XXXX
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/60 font-dynapuff">&copy; 2024 Wolf's Lair Farm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
