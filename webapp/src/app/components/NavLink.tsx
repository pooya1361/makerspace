"use client";

import Link from 'next/link';
import { ReactNode } from 'react';

// Define the props interface for NavLink
interface NavLinkProps {
    href: string;
    children: ReactNode; // children can be any React node (text, elements)
    currentPath: string; // The current path from Next.js router
    onSelect?: () => void; // Optional function to call on selection (e.g., to close mobile menu)
}

function NavLink({ href, children, currentPath, onSelect }: NavLinkProps) {
    // Determine if the link is active based on the current path
    const isActive = currentPath === href || (href !== '/' && currentPath.startsWith(href));

    const handleClick = () => {
        if (onSelect) {
            onSelect(); // Call the optional onSelect prop (e.g., to close the mobile menu)
        }
    };

    return (
        <Link
            href={href}
            onClick={handleClick}
            className={`relative px-3 py-1 rounded hover:bg-blue-600 transition duration-300
        ${isActive ? 'font-bold text-white bg-blue-600' : 'text-white'}`}
        >
            {children}
        </Link>
    );
}

export default NavLink; // Export NavLink as the default export