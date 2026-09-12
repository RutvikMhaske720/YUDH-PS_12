'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-3.5 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#1C2B27]/10 transition-all duration-300">
      <div className="wrap flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform border border-[#3D6B5E]/20 bg-[#3D6B5E]">
            <Image
              src="/logo.jpeg"
              alt="Phoenix Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#1C2B27]">phoenix</span>
        </Link>

        {/* Right Aligned Container (Links + Action CTA) */}
        <div className="flex items-center gap-6 lg:gap-8">
          {/* Desktop Navigation Links (No Icons) */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-8 list-none text-sm font-medium text-[#3E4F49] whitespace-nowrap">
            <li>
              <Link
                href="/#how"
                className="hover:text-[#3D6B5E] transition-colors relative py-1 hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#E8A87C] after:transition-all"
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link
                href="/#ecosystem"
                className="hover:text-[#3D6B5E] transition-colors relative py-1 hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#E8A87C] after:transition-all"
              >
                Multi-Agent Architecture
              </Link>
            </li>
            <li>
              <Link
                href="/institute"
                className="hover:text-[#3D6B5E] transition-colors relative py-1 hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#E8A87C] after:transition-all"
              >
                Institute Portal
              </Link>
            </li>
            <li>
              <Link
                href="/specialists"
                className="hover:text-[#3D6B5E] transition-colors relative py-1 hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#E8A87C] after:transition-all"
              >
                Specialist Sub-Agents
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="text-[#3D6B5E] font-semibold hover:text-[#2C5044] transition-colors relative py-1 hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#E8A87C] after:transition-all"
              >
                Academic Workspace
              </Link>
            </li>
          </ul>

          {/* Action CTA */}
          <Link
            href="/onboarding"
            className="btn btn-solid text-xs font-semibold px-6 py-2.5 uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-lg transition-all shrink-0"
          >
            <span>Let&apos;s Learn</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-[#1C2B27] hover:bg-[#1C2B27]/5 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-[#1C2B27]/10 px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top duration-300">
          <Link href="/#how" onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium text-[#1C2B27]">
            How It Works
          </Link>
          <Link href="/#ecosystem" onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium text-[#1C2B27]">
            Multi-Agent Architecture
          </Link>
          <Link href="/institute" onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium text-[#1C2B27]">
            Institute Portal
          </Link>
          <Link href="/specialists" onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium text-[#1C2B27]">
            Specialist Sub-Agents
          </Link>
          <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block py-2 text-base font-semibold text-[#3D6B5E]">
            Academic Workspace
          </Link>
          <div className="pt-4 border-t border-[#1C2B27]/10 flex flex-col gap-3">
            <Link href="/onboarding" onClick={() => setIsOpen(false)} className="btn btn-solid w-full justify-center">
              <span>Let&apos;s Learn</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
