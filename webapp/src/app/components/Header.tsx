// components/Header.tsx
"use client"; // Keep this directive at the very top

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLogoutMutation } from '../lib/features/api/apiSlice';
import { selectIsLoggedIn } from '../lib/features/auth/authSlice';
import NavLink from './NavLink';
export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [logout, { isLoading }] = useLogoutMutation();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    
    const currentPathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    const pathname = mounted ? currentPathname : '/';

    const isLoggedIn = useSelector(selectIsLoggedIn);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            // Still redirect even if logout fails
            router.push('/login');
        }
    };

    return (
        <header className="bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white p-4 shadow-md" data-testid="main-nav">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo/Site Title */}
                <Link href="/" className="text-2xl font-bold hover:text-blue-200 transition duration-300">
                    Makerspace
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex">
                    {isLoggedIn ? (
                        <div className='space-x-6' data-testid="user-menu">
                            <NavLink href="/" currentPath={pathname}>Home</NavLink>
                            <NavLink href="/workshops" currentPath={pathname}>Workshops</NavLink>
                            <NavLink href="/activities" currentPath={pathname}>Activities</NavLink>
                            <NavLink href="/lessons" currentPath={pathname}>Lessons</NavLink>
                            <NavLink href="/scheduled-lessons" currentPath={pathname}>Scheduled Lessons</NavLink>
                            <button onClick={handleLogout} className="text-white hover:text-blue-200 transition duration-300" disabled={isLoading} data-testid="logout-button">
                                Logout
                            </button>
                        </div>
                    ) : (
                            <NavLink href="/login" currentPath={pathname} data-testid="nav-login">Login</NavLink>
                    )}
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
                        {isLoggedIn ? (
                            <div className='space-y-4' data-testid="user-menu">
                                <NavLink href="/" currentPath={pathname} onSelect={toggleMobileMenu}>Home</NavLink>
                                <NavLink href="/workshops" currentPath={pathname} onSelect={toggleMobileMenu}>Workshops</NavLink>
                                <NavLink href="/activities" currentPath={pathname} onSelect={toggleMobileMenu}>Activities</NavLink>
                                <NavLink href="/lessons" currentPath={pathname} onSelect={toggleMobileMenu}>Lessons</NavLink>
                                <NavLink href="/scheduled-lessons" currentPath={pathname} onSelect={toggleMobileMenu}>Scheduled Lessons</NavLink>
                                <button onClick={() => { handleLogout(); toggleMobileMenu(); }} className="text-white hover:text-blue-200 transition duration-300" disabled={isLoading} data-testid="logout-button">
                                    Logout
                                </button>
                            </div>
                        ) : (
                                <NavLink href="/login" currentPath={pathname} onSelect={toggleMobileMenu} data-testid="nav-login">Login</NavLink>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}