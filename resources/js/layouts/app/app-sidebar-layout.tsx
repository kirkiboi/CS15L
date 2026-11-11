import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppContent variant="sidebar" className="min-w-0 overflow-x-clip">
                {children}
            </AppContent>
        </AppShell>
    );
}
