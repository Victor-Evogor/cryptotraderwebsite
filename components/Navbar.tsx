"use client"

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './Button';
import ThemeToggle from './ThemeToggle';
import { useRouter } from "next/navigation";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter()

  const navItems = [
    { name: 'Meme', href: '/meme' },
    { name: 'New Pair', href: '/new-pair' },
    { name: 'Trending', href: '/trending' },
    { name: 'Copy Trade', href: '/copy-trade' },
    { name: 'Holding', href: '/holding' },
    { name: 'Follow', href: '/follow' },
  ];

  return (
    <nav className="sticky w-full bg-purple-100 backdrop-blur-sm dark:bg-purple-900/30 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/foodie_pepe_no_bg.png"
                alt="Logo"
                width={40}
                height={40}
                className="w-auto h-8"
              />
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="dark:text-gray-300  text-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Search, Theme Toggle, and Login */}
          <div className="hidden md:flex items-center space-x-4">
            <input
              type="search"
              placeholder="Search..."
              className="px-4 py-1 rounded-lg bg-purple-800/30 dark:bg-gray-800/30 text-white dark:placeholder-gray-400 placeholder-gray-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <ThemeToggle />
            <Button variant="primary" onClick={() => router.push("/login")}>Login</Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-purple-800/30 focus:outline-none"
            >
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="px-3 py-2">
            <input
              type="search"
              placeholder="Search..."
              className="w-full px-4 py-1 rounded-lg bg-purple-800/30 dark:bg-gray-800/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="px-3 py-2">
            <Button variant="primary" className="w-full">
              Login
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
