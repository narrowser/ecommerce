import Link from 'next/link';
import { ProductCard } from '@/components/shop/product-card';
import { CategoryNav } from '@/components/shop/category-nav';

async function getFeaturedProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80'}/api/products?pageSize=8`, { cache: 'no-store' });
    const json = await res.json();
    return json?.data || [];
  } catch { return []; }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:80'}/api/categories`, { cache: 'no-store' });
    const json = await res.json();
    return json?.data || [];
  } catch { return []; }
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([getFeaturedProducts(), getCategories()]);

  return (
    <div>
      <section className="mb-8">
        <CategoryNav categories={categories} />
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">热销商品</h2>
        <div className="grid grid-cols-4 gap-4">
          {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
