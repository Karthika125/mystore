'use client';

import Link from 'next/link'
import Image from 'next/image'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import ProductGrid from '@/components/ProductGrid'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const { data: products, isLoading: isLoadingProducts } = useProducts()
  const { data: categories, isLoading: isLoadingCategories } = useCategories()

  console.log('Products loaded:', products?.length || 0, 'items')
  console.log('Categories loaded:', categories?.length || 0, 'items')

  const sections = [
    {
      title: "Appliances for your home | Up to 55% off",
      items: [
        { name: "Air conditioners", image: "/images/categories/ac.jpg", link: "/products?category=ac" },
        { name: "Refrigerators", image: "/images/categories/fridge.jpg", link: "/products?category=refrigerators" },
        { name: "Microwaves", image: "/images/categories/microwave.jpg", link: "/products?category=microwaves" },
        { name: "Washing machines", image: "/images/categories/washer.jpg", link: "/products?category=washers" }
      ]
    },
    {
      title: "Starting ₹149 | Headphones",
      items: [
        { name: "boAt", image: "/images/brands/boat.jpg", link: "/products?brand=boat" },
        { name: "Boult", image: "/images/brands/boult.jpg", link: "/products?brand=boult" },
        { name: "Noise", image: "/images/brands/noise.jpg", link: "/products?brand=noise" },
        { name: "Zebronics", image: "/images/brands/zebronics.jpg", link: "/products?brand=zebronics" }
      ]
    },
    {
      title: "Automotive essentials | Up to 60% off",
      items: [
        { name: "Cleaning accessories", image: "/images/auto/cleaning.jpg", link: "/products?category=auto-cleaning" },
        { name: "Tyre & rim care", image: "/images/auto/tyre.jpg", link: "/products?category=tyre-care" },
        { name: "Helmets", image: "/images/auto/helmet.jpg", link: "/products?category=helmets" },
        { name: "Vacuum cleaner", image: "/images/auto/vacuum.jpg", link: "/products?category=auto-vacuum" }
      ]
    }
  ]

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Hero Banner */}
      <div className="relative h-[300px] bg-gradient-to-r from-blue-600 to-blue-400">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-xl">
            <h1 className="text-4xl font-bold mb-4">Welcome to MyStore</h1>
            <p className="text-xl mb-6">Discover amazing deals on all your favorite products</p>
            <Button size="lg" asChild>
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Grid Sections */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">{section.title}</h2>
              <div className="grid grid-cols-2 gap-4">
                {section.items.map((item, itemIdx) => (
                  <Link key={itemIdx} href={item.link} className="group">
                    <div className="aspect-square relative overflow-hidden rounded-md">
                      <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                      {/* Add Image component when images are available */}
                    </div>
                    <p className="mt-2 text-sm text-gray-600 group-hover:text-blue-600">{item.name}</p>
                  </Link>
                ))}
              </div>
              <Link href="/products" className="text-blue-600 hover:underline text-sm mt-4 block">
                See all offers
              </Link>
            </div>
          ))}
        </div>

        {/* Featured Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
          <ProductGrid 
            products={products?.slice(0, 8)} 
            isLoading={isLoadingProducts} 
          />
        </div>

        {/* Categories */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {isLoadingCategories ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
              ))
            ) : (
              categories?.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className="group"
                >
                  <div className="aspect-square relative overflow-hidden rounded-lg">
                    {category.image && (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    )}
                  </div>
                  <p className="mt-2 text-center font-medium group-hover:text-blue-600">
                    {category.name}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
} 