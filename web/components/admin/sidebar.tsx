'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const adminLinks = [
  { href: '/admin', label: '仪表盘', icon: '📊' },
  { href: '/admin/products', label: '商品管理', icon: '📦' },
  { href: '/admin/categories', label: '分类管理', icon: '📂' },
  { href: '/admin/orders', label: '订单管理', icon: '📋' },
  { href: '/admin/users', label: '用户管理', icon: '👥' },
  { href: '/admin/suppliers', label: '供应商管理', icon: '🏭' },
  { href: '/admin/coupons', label: '优惠券', icon: '🎫' },
  { href: '/admin/reviews', label: '评价管理', icon: '⭐' },
];

const supplierLinks = [
  { href: '/supplier', label: '仪表盘', icon: '📊' },
  { href: '/supplier/products', label: '我的商品', icon: '📦' },
  { href: '/supplier/orders', label: '订单查看', icon: '📋' },
  { href: '/supplier/revenue', label: '收入统计', icon: '💰' },
];

export function AdminSidebar({ variant = 'admin' }: { variant?: 'admin' | 'supplier' }) {
  const links = variant === 'supplier' ? supplierLinks : adminLinks;
  const pathname = usePathname();
  return (
    <aside className="w-60 bg-slate-900 text-white flex flex-col">
      <div className="h-16 flex items-center px-6 text-lg font-bold border-b border-slate-700">
        {variant === 'supplier' ? '供应商门户' : '管理后台'}
      </div>
      <nav className="flex-1 py-4">
        {links.map(link => (
          <Link key={link.href} href={link.href}
            className={cn('flex items-center gap-3 px-6 py-3 text-sm hover:bg-slate-800 transition-colors',
              pathname === link.href && 'bg-slate-800 border-r-2 border-primary')}>
            <span>{link.icon}</span> {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
