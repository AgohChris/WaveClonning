
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Home, Send, PlusCircle, LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AppLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const getInitials = (name = "") => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0] ? `${names[0][0]}`.toUpperCase() : 'U';
  };
  
  const userInitials = currentUser ? getInitials(`${currentUser.firstName} ${currentUser.lastName}`) : 'U';

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-16 max-w-screen-2xl">
          <Link to="/" className="flex items-center space-x-2">
            <img  alt="Wave App Logo" class="h-8 w-auto" src="https://images.unsplash.com/photo-1693480145921-381cc5cd5153" />
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Wave</span>
          </Link>
          
          {currentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://avatar.vercel.sh/${currentUser.phone}.png`} alt={`${currentUser.firstName} ${currentUser.lastName}`} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser.firstName} {currentUser.lastName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{currentUser.phone}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      <main className="flex-1 container max-w-screen-md py-8">
        <Outlet />
      </main>

      <footer className="sticky bottom-0 z-40 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        <nav className="container flex items-center justify-around h-16 max-w-screen-2xl">
          <Link to="/" className="flex flex-col items-center text-muted-foreground hover:text-primary">
            <Home className="w-6 h-6" />
            <span className="text-xs">Accueil</span>
          </Link>
          <Link to="/send-money" className="flex flex-col items-center text-muted-foreground hover:text-primary">
            <Send className="w-6 h-6" />
            <span className="text-xs">Envoyer</span>
          </Link>
          <Link to="/recharge" className="flex flex-col items-center text-muted-foreground hover:text-primary">
            <PlusCircle className="w-6 h-6" />
            <span className="text-xs">Recharger</span>
          </Link>
        </nav>
      </footer>
       <footer className="hidden md:block py-4 border-t bg-background/50">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Wave App Clone. Tous droits réservés.</p>
          <p>Construit avec Hostinger Horizons.</p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
