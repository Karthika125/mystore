import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { LoginButton } from './LoginButton';

// ... rest of your imports ...

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-accent-pink">Mystore</span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              <Link href="/" className="text-lg font-medium transition-colors hover:text-accent-pink">
                Home
              </Link>
              <Link href="/products" className="text-lg font-medium transition-colors hover:text-accent-pink">
                Products
              </Link>
              <Link href="/categories" className="text-lg font-medium transition-colors hover:text-accent-pink">
                Categories
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <LoginButton />
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent-pink text-xs text-white">
                0
              </span>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t">
        <div className="container flex flex-col items-center gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose md:text-left">
              Built by{" "}
              <a href="#" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
                Your Name
              </a>
              . Hosted on{" "}
              <a href="https://vercel.com" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
                Vercel
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 