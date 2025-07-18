// components/Header.tsx
"use client"; // Keep this directive at the very top

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Correct import for App Router
import { useState } from 'react';
import NavLink from './NavLink'; // Assuming NavLink is in the same directory

export default function Header() {
    // Use usePathname for the App Router to get the current URL path
    const pathname = usePathname();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="bg-blue-700 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo/Site Title */}
                <Link href="/" className="text-2xl font-bold hover:text-blue-200 transition duration-300">
                    Makerspace Hub
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-6">
                    <NavLink href="/" currentPath={pathname}>Home</NavLink>
                    <NavLink href="/workshops" currentPath={pathname}>Workshops</NavLink>
                    <NavLink href="/activities" currentPath={pathname}>Activities</NavLink>
                    <NavLink href="/lessons" currentPath={pathname}>Lessons</NavLink>
                    <NavLink href="/scheduled-lessons" currentPath={pathname}>Scheduled Lessons</NavLink>
                    <NavLink href="/login" currentPath={pathname}>Login</NavLink>
                </nav>

                {/* Mobile Menu Button (Hamburger Icon) */}
                <div className="md:hidden">
                    <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
                        {isMobileMenuOpen ? (
                            // Close icon (e.g., X)
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        ) : (
                            // Hamburger icon
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-blue-800 py-4 mt-2 rounded-lg shadow-lg">
                    <nav className="flex flex-col items-center space-y-4">
                        <NavLink href="/" currentPath={pathname} onSelect={toggleMobileMenu}>Home</NavLink>
                        <NavLink href="/workshops" currentPath={pathname} onSelect={toggleMobileMenu}>Workshops</NavLink>
                        <NavLink href="/activities" currentPath={pathname} onSelect={toggleMobileMenu}>Activities</NavLink>
                        <NavLink href="/lessons" currentPath={pathname} onSelect={toggleMobileMenu}>Lessons</NavLink>
                        <NavLink href="/scheduled-lessons" currentPath={pathname} onSelect={toggleMobileMenu}>Scheduled Lessons</NavLink>
                        <NavLink href="/login" currentPath={pathname} onSelect={toggleMobileMenu}>Login</NavLink>
                    </nav>
                </div>
            )}
        </header>
    );
}