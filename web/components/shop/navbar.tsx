'use client';
import Link from 'next/link';

export function Navbar() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/" className="text-xl font-bold text-primary">E-Shop</Link>
        <div className="flex-1 max-w-xl mx-8">
          <input type="text" placeholder="搜索商品..." className="w-full border rounded-lg px-4 py-2 text-sm" />
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/cart" className="text-sm hover:text-primary relative">🛒</Link>
          <Link href="/login" className="text-sm hover:text-primary">登录</Link>
        </nav>
      </div>
    </header>
  );
}
