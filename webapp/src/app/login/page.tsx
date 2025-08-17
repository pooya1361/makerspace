//app/login/page.tsx
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation'; // For navigation after login
import { useState } from 'react';
import { apiSlice } from '../lib/features/api/apiSlice';

export default function LoginPage() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const [login] = apiSlice.useLoginMutation();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        setLoading(true);
        setError(null); // Clear previous errors

        try {
            await login({ email, password }).unwrap();

            router.push('/'); 
            router.refresh()
        } catch (err: any) { 
            if (err.data && err.data.message) {
                setError(err.data.message);
            } else if (err.error) {
                setError(err.error);
            } else {
                setError('Login failed. Please check your credentials or network connection.');
            }
            console.error('Login failed:', err);
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to Makerspace</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={email}
                            autoComplete="true"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            data-testid="email-input"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="mt-1 block w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={password}
                            autoComplete="true"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            data-testid="password-input"
                        />
                    </div>
                    {error && (
                        <p data-testid="login-error" className="text-red-600 text-sm text-center">{error}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        disabled={loading}
                        data-testid="login-button"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}

