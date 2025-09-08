// components/Header.tsx
"use client"; // Keep this directive at the very top

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLogoutMutation } from '../lib/features/api/apiSlice';
import { selectIsLoggedIn } from '../lib/features/auth/authSlice';
import NavLink from './NavLink';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [logout, { isLoading }] = useLogoutMutation();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

    const currentPathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close mobile menu when clicking outside or pressing Escape
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
                mobileMenuButtonRef.current?.focus();
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (isMobileMenuOpen && !target.closest('[data-mobile-menu]')) {
                setIsMobileMenuOpen(false);
            }
        };

        if (isMobileMenuOpen) {
            document.addEventListener('keydown', handleEscape);
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    const pathname = mounted ? currentPathname : '/';
    const isLoggedIn = useSelector(selectIsLoggedIn);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
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
        <>
            {/* Skip Navigation Link */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white px-4 py-2 z-50 focus:outline-none focus:ring-2 focus:ring-white"
            >
                Skip to main content
            </a>

            <header
                className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white p-4 shadow-md"
                data-testid="main-nav"
                data-mobile-menu
            >
                <div className="container mx-auto flex justify-between items-center">
                    {/* Logo/Site Title */}
                    <h1 className="text-2xl font-bold">
                        <Link
                            href="/"
                            className="hover:text-blue-200 transition duration-300 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded"
                        >
                            Makerspace
                        </Link>
                    </h1>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex" aria-label="Main navigation">
                        {isLoggedIn ? (
                            <div className='space-x-6' data-testid="user-menu">
                                <NavLink href="/" currentPath={pathname}>Home</NavLink>
                                <NavLink href="/workshops" currentPath={pathname}>Workshops</NavLink>
                                <NavLink href="/activities" currentPath={pathname}>Activities</NavLink>
                                <NavLink href="/lessons" currentPath={pathname}>Lessons</NavLink>
                                <NavLink href="/scheduled-lessons" currentPath={pathname}>Scheduled Lessons</NavLink>
                                <button
                                    onClick={handleLogout}
                                    className="text-white hover:text-blue-200 transition duration-300 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded px-2 py-1"
                                    disabled={isLoading}
                                    data-testid="logout-button"
                                    aria-describedby={isLoading ? "logout-loading" : undefined}
                                >
                                    {isLoading ? 'Logging out...' : 'Logout'}
                                    {isLoading && <span id="logout-loading" className="sr-only">Please wait</span>}
                                </button>
                            </div>
                        ) : (
                            <NavLink href="/login" currentPath={pathname} data-testid="nav-login">
                                Login
                            </NavLink>
                        )}
                    </nav>

                    {/* Mobile Menu Button (Hamburger Icon) */}
                    <div className="md:hidden">
                        <button
                            ref={mobileMenuButtonRef}
                            onClick={toggleMobileMenu}
                            className="text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded p-1"
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-menu"
                            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                            data-mobile-menu
                        >
                            {isMobileMenuOpen ? (
                                // Close icon (X)
                                <svg
                                    className="w-8 h-8"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <title>Close menu</title>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            ) : (
                                // Hamburger icon
                                <svg
                                    className="w-8 h-8"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <title>Open menu</title>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div
                        id="mobile-menu"
                        className="md:hidden bg-blue-800 py-4 mt-2 rounded-lg shadow-lg"
                        role="navigation"
                        aria-label="Mobile navigation"
                        data-mobile-menu
                    >
                        <nav className="flex flex-col items-center space-y-4">
                            {isLoggedIn ? (
                                <div className='space-y-4 flex flex-col items-center' data-testid="user-menu">
                                    <NavLink href="/" currentPath={pathname} onSelect={closeMobileMenu}>
                                        Home
                                    </NavLink>
                                    <NavLink href="/workshops" currentPath={pathname} onSelect={closeMobileMenu}>
                                        Workshops
                                    </NavLink>
                                    <NavLink href="/activities" currentPath={pathname} onSelect={closeMobileMenu}>
                                        Activities
                                    </NavLink>
                                    <NavLink href="/lessons" currentPath={pathname} onSelect={closeMobileMenu}>
                                        Lessons
                                    </NavLink>
                                    <NavLink href="/scheduled-lessons" currentPath={pathname} onSelect={closeMobileMenu}>
                                        Scheduled Lessons
                                    </NavLink>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            closeMobileMenu();
                                        }}
                                        className="text-white hover:text-blue-200 transition duration-300 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-800 rounded px-2 py-1"
                                        disabled={isLoading}
                                        data-testid="logout-button"
                                        aria-describedby={isLoading ? "logout-loading-mobile" : undefined}
                                    >
                                        {isLoading ? 'Logging out...' : 'Logout'}
                                        {isLoading && <span id="logout-loading-mobile" className="sr-only">Please wait</span>}
                                    </button>
                                </div>
                            ) : (
                                <NavLink href="/login" currentPath={pathname} onSelect={closeMobileMenu} data-testid="nav-login">
                                    Login
                                </NavLink>
                            )}
                        </nav>
                    </div>
                )}
            </header>
        </>
    );
}