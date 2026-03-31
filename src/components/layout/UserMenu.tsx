'use client';

import { BadgeCheck, CreditCard, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export interface UserMenuProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

/**
 * Kullanıcı menüsü bileşeni. Cyber-themed avatar + dropdown ile profil işlemleri.
 * Glow effects, primary accent colors, mono typography.
 *
 * @example
 * <UserMenu user={{ name: "John Doe", email: "john@example.com" }} />
 */
export function UserMenu({ user }: UserMenuProps) {
  const userName = user?.name || 'User';
  const userEmail = user?.email || '';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 p-0 hover:bg-primary/10 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 group"
          aria-label="Kullanıcı menüsü"
        >
          <Avatar className="h-9 w-9 glow-avatar">
            {user?.avatar && (
              <AvatarImage
                src={user.avatar}
                alt={userName}
              />
            )}
            <AvatarFallback className="bg-primary text-primary-foreground font-mono text-xs font-bold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 border-primary/20"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="flex flex-col space-y-1 py-2">
          <p className="text-sm font-semibold font-mono text-foreground">{userName}</p>
          <p className="text-[11px] font-mono text-muted-foreground">{userEmail}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-primary/20" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10">
            <BadgeCheck className="mr-2 h-4 w-4 text-primary" />
            <span className="text-sm">Hesap Ayarları</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10">
            <CreditCard className="mr-2 h-4 w-4 text-primary" />
            <span className="text-sm">Faturalandırma</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-primary/20" />
        <DropdownMenuItem className="cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10 text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span className="text-sm">Çıkış Yap</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
