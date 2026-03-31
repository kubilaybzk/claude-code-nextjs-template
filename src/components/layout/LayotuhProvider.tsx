import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/Header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const sampleUser = {
  name: 'Dora Smart',
  email: 'dora@pmap.io',
  avatar: '/avatars/dora.jpg',
};

/**
 * Ana layout provider. Sidebar + Header + Content'i saralar.
 */
export default function LayoutProvider({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header
          breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }]}
          currentPage="Sayfalar"
          user={sampleUser}
        />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
