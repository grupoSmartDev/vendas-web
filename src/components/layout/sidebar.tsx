'use client';

// src/components/layout/sidebar.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    Target,
    Calendar,
    DollarSign,
    Building2,
    Settings,
    BarChart3,
    UserCircle,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

/**
 * Item do menu
 */
interface NavItem {
    title: string;
    href: string;
    icon: React.ElementType;
    badge?: string | number;
}

/**
 * Menu de navegação
 */
const navItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Leads',
        href: '/leads',
        icon: Target,
        badge: 'Em breve',
    },
    {
        title: 'Atividades',
        href: '/activities',
        icon: Calendar,
        badge: 'Em breve',
    },
    {
        title: 'Vendas',
        href: '/vendas',
        icon: DollarSign,
        badge: 'Em breve',
    },
    {
        title: 'Empreendimentos',
        href: '/empreendimentos',
        icon: Building2,

    },
    {
        title: 'Equipe',
        href: '/team',
        icon: Users,
        badge: 'Em breve',
    },
    {
        title: 'Relatórios',
        href: '/reports',
        icon: BarChart3,
        badge: 'Em breve',
    },
    {
        title: 'Atividades',
        href: '/tasks',
        icon: BarChart3
    },
    {
        title: 'Templetes',
        href: '/templetes',
        icon: BarChart3
    },
];

/**
 * Sidebar - Menu lateral
 */
export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full flex-col gap-2">
            {/* Logo */}
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                    <Building2 className="h-6 w-6 text-primary" />
                    <span className="text-xl">10x Vendas</span>
                </Link>
            </div>

            {/* Menu */}
            <ScrollArea className="flex-1 px-3">
                <div className="space-y-1 py-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
                                    isActive
                                        ? 'bg-accent text-accent-foreground font-medium'
                                        : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span className="flex-1">{item.title}</span>
                                {item.badge && (
                                    <Badge variant="secondary" className="text-xs">
                                        {item.badge}
                                    </Badge>
                                )}
                            </Link>
                        );
                    })}
                </div>

                <Separator className="my-4" />

                {/* Menu secundário */}
                <div className="space-y-1 py-2">
                    <Link
                        href="/profile"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
                    >
                        <UserCircle className="h-4 w-4" />
                        <span>Meu Perfil</span>
                    </Link>

                    <Link
                        href="/settings"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
                    >
                        <Settings className="h-4 w-4" />
                        <span>Configurações</span>
                    </Link>
                </div>
            </ScrollArea>

            {/* Footer */}
            <div className="mt-auto border-t p-4">
                <p className="text-xs text-muted-foreground text-center">
                    © 2025 10x Vendas
                </p>
            </div>
        </div>
    );
}