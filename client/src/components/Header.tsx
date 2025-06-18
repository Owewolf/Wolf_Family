import { Link, useLocation } from "wouter";
import { Menu, LogOut, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";
import wolfLogo from "@assets/Wolf_1749927417328.jpg";
import stevenAvatar from "@assets/ste_av_1750006550241.png";
import carterAvatar from "@assets/car_av_1750006550241.png";
import farrahAvatar from "@assets/far_av_1750006550241.png";
import lieselAvatar from "@assets/lie_av_1750007586846.jpg";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

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

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Family', href: '/family' },
    { name: 'Post', href: '/posts' },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return location === '/';
    }
    return location.startsWith(href);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-modern sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <Link href="/wolf">
                <img 
                  src={wolfLogo} 
                  alt="Wolf's Lair Logo" 
                  className="h-16 w-16 object-contain hover:opacity-75 transition-all cursor-pointer"
                />
              </Link>
              <Link href="/">
                <h1 className="text-4xl font-dynapuff font-bold text-forest hover:text-forest-dark transition-colors cursor-pointer">
                  Wolf's Lair
                </h1>
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              {navigation.map((item) => (
                item.name === 'Post' ? (
                  <span
                    key={item.name}
                    onClick={() => setShowLogin(true)}
                    className="font-dynapuff font-medium text-lg transition-colors cursor-pointer text-forest/80 hover:text-forest"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link key={item.name} href={item.href}>
                    <span className={`font-dynapuff font-medium text-lg transition-colors cursor-pointer ${
                      isActiveLink(item.href)
                        ? 'text-forest font-semibold'
                        : 'text-forest/80 hover:text-forest'
                    }`}>
                      {item.name}
                    </span>
                  </Link>
                )
              ))}
            </nav>
            
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getAvatarSrc(user?.name)} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.role}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/family/${user?.id}/posts`} className="w-full">
                      <User className="mr-2 h-4 w-4" />
                      My Posts
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => {
                  if (item.name === 'Post') {
                    return (
                      <span
                        key={item.name}
                        onClick={() => {
                          setShowLogin(true);
                          setIsOpen(false);
                        }}
                        className="block px-3 py-2 text-lg font-dynapuff font-medium transition-colors cursor-pointer text-forest/80 hover:text-forest hover:bg-gray-50 rounded-md"
                      >
                        {item.name}
                      </span>
                    );
                  } else {
                    return (
                      <Link key={item.name} href={item.href}>
                        <span 
                          className={`block px-3 py-2 text-lg font-dynapuff font-medium transition-colors cursor-pointer ${
                            isActiveLink(item.href)
                              ? 'text-forest bg-gray-50 rounded-md'
                              : 'text-forest/80 hover:text-forest hover:bg-gray-50 rounded-md'
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </span>
                      </Link>
                    );
                  }
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-20" onClick={() => setShowLogin(false)}>
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <LoginForm onSuccess={() => setShowLogin(false)} />
            <Button 
              variant="outline" 
              className="mt-4 w-full" 
              onClick={() => setShowLogin(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
