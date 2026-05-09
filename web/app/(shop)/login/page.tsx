'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await apiClient('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      const role = res.data.user.role;
      if (role === 'ADMIN') router.push('/admin');
      else if (role === 'SUPPLIER') router.push('/supplier');
      else router.push('/');
    } catch (e: any) { setError(e.message); }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-6 text-center">登录</h1>
      <form onSubmit={login} className="space-y-4">
        <input type="email" placeholder="邮箱" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" required />
        <input type="password" placeholder="密码" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" required />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full">登录</Button>
        <p className="text-center text-sm">还没有账号？<Link href="/register" className="text-primary">注册</Link></p>
      </form>
    </div>
  );
}
