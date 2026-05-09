'use client';
import { useRouter } from 'next/navigation';

export function AdminHeader() {
  const router = useRouter();
  const logout = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
  };
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      <span className="font-medium">欢迎回来</span>
      <button onClick={logout} className="text-sm text-gray-500 hover:text-red-500">退出登录</button>
    </header>
  );
}
