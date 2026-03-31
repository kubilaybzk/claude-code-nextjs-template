'use client';

import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserMenu, type UserMenuProps } from './UserMenu';
import { ThemeToggle } from './ThemeToggle';

export interface HeaderProps {
  breadcrumbs?: Array<{ label: string; href?: string }>;
  currentPage?: string;
  user?: UserMenuProps['user'];
}

/**
 * Ana header bileşeni. Sidebar trigger, breadcrumb, tema toggle ve user menu içerir.
 * Cyber theme: mono typography, primary accent, grid effects.
 *
 * @example
 * <Header
 *   breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }]}
 *   currentPage="Settings"
 *   user={{ name: "John Doe", email: "john@example.com" }}
 * />
 */
export function Header({ breadcrumbs, currentPage, user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-primary/20 bg-card backdrop-blur-md transition-colors duration-200 overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="header-cyber-grid" />

      <div className="relative flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
        <SidebarTrigger className="group -ml-1 h-9 w-9 hover:bg-primary/10 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1" />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
