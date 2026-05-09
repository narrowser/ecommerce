'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
      router.push('/login');
    } catch (e: any) { setError(e.message); }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-6 text-center">注册</h1>
      <form onSubmit={register} className="space-y-4">
        <input type="text" placeholder="用户名" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded px-3 py-2" required />
        <input type="email" placeholder="邮箱" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" required />
        <input type="password" placeholder="密码" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" required />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full">注册</Button>
        <p className="text-center text-sm">已有账号？<Link href="/login" className="text-primary">登录</Link></p>
      </form>
    </div>
  );
}
