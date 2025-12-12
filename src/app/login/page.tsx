'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            // Login success
            // In a real app, you might save the user to Context or LocalStorage here
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-4 text-white">
            <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-8 shadow-xl border border-zinc-800">
                <h1 className="mb-2 text-3xl font-bold text-center bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
                    Welcome Back
                </h1>
                <p className="mb-8 text-center text-zinc-400">Login to Event Koi</p>

                {registered && (
                    <div className="mb-4 rounded-lg bg-green-500/10 p-3 text-sm text-green-500 border border-green-500/20 text-center">
                        Account created! Please log in.
                    </div>
                )}

                {error && (
                    <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-400">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full rounded-lg bg-zinc-800 p-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-400">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full rounded-lg bg-zinc-800 p-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 p-3 font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-500">
                    Don't have an account?{' '}
                    <a href="/register" className="text-indigo-400 hover:text-indigo-300">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="text-white text-center mt-20">Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
