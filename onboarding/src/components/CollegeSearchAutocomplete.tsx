'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Building2, Search, Check, Loader2, MapPin } from 'lucide-react';

interface CollegeResult {
  id: string;
  name: string;
  city: string;
  state: string;
}

interface CollegeSearchAutocompleteProps {
  value: string;
  onChange: (collegeName: string, location?: string) => void;
  placeholder?: string;
}

export default function CollegeSearchAutocomplete({
  value,
  onChange,
  placeholder = 'Search 50,000+ Indian Colleges & Schools (e.g. IIT, BITS, DPS)...',
}: CollegeSearchAutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState(value);
  const [results, setResults] = useState<CollegeResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch search results from CollegeDB API route
  useEffect(() => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/colleges/search?q=${encodeURIComponent(searchTerm)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.results)) {
            setResults(data.results);
          }
        }
      } catch (err) {
        console.error('Failed to search colleges:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelect = (college: CollegeResult) => {
    const loc = college.state ? `${college.city}, ${college.state}` : college.city;
    setSearchTerm(college.name);
    onChange(college.name, loc);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onChange(val);
    setIsOpen(true);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-white border border-[#1C2B27]/20 rounded-xl pl-10 pr-10 py-3.5 text-sm font-medium text-[#1C2B27] placeholder:text-[#6A7872]/60 focus:ring-2 focus:ring-[#3D6B5E] focus:outline-none shadow-xs"
        />
        <Building2 className="w-4 h-4 text-[#3D6B5E] absolute left-3.5 top-4" />
        {isLoading && (
          <Loader2 className="w-4 h-4 text-[#3D6B5E] animate-spin absolute right-3.5 top-4" />
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (searchTerm.length >= 2 || results.length > 0) && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#1C2B27]/15 rounded-2xl shadow-xl z-50 max-h-64 overflow-y-auto divide-y divide-[#1C2B27]/5">
          <div className="px-3.5 py-2 bg-[#FAF7F2] text-[10.5px] font-mono font-bold text-[#3D6B5E] uppercase tracking-wider flex items-center justify-between">
            <span>CollegeDB Live Database</span>
            <span className="text-[9px] bg-[#3D6B5E]/10 px-2 py-0.5 rounded text-[#3D6B5E]">50,000+ Indian Institutions</span>
          </div>

          {results.length > 0 ? (
            results.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelect(c)}
                className="w-full text-left px-4 py-2.5 hover:bg-[#3D6B5E]/5 transition-colors flex items-start justify-between gap-2 group"
              >
                <div>
                  <div className="text-xs font-semibold text-[#1C2B27] group-hover:text-[#3D6B5E]">
                    {c.name}
                  </div>
                  <div className="text-[11px] text-[#6A7872] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#E8A87C]" />
                    <span>{c.city}{c.state ? `, ${c.state}` : ''}</span>
                  </div>
                </div>
                {searchTerm === c.name && <Check className="w-4 h-4 text-[#3D6B5E] shrink-0 mt-1" />}
              </button>
            ))
          ) : (
            !isLoading && (
              <div className="px-4 py-3 text-xs text-[#6A7872]">
                No direct match found in CollegeDB. Press enter or continue typing to use <strong>"{searchTerm}"</strong>.
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
