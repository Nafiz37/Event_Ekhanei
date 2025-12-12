'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();

    // For simplicity, we manage separate states or a combined object. 
    // Since we have files, a single object with specific types is fine, or individual states.
    // Let's use a flexible state approach.
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('attendee');
    const [phone, setPhone] = useState('');
    const [designation, setDesignation] = useState('');

    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [idCard, setIdCard] = useState<File | null>(null);
    const [proofDoc, setProofDoc] = useState<File | null>(null);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation
        if (!name || !email || !password || !designation || !profileImage) {
            setError('Please fill in all required fields (Name, Email, Password, Designation, Profile Photo)');
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('role', role);
            formData.append('phone', phone);
            formData.append('designation', designation);

            if (profileImage) formData.append('profile_image', profileImage);
            if (idCard) formData.append('organization_id_card', idCard);
            if (proofDoc) formData.append('proof_document', proofDoc);

            const res = await fetch('/api/auth/register', {
                method: 'POST',
                // Do NOT set Content-Type header when using FormData; browser does it
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            // Redirect to login on success
            router.push('/login?registered=true');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-4 text-white">
            <div className="w-full max-w-2xl rounded-2xl bg-zinc-900 p-8 shadow-xl border border-zinc-800">
                <h1 className="mb-2 text-3xl font-bold text-center bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent">
                    Join Event Koi
                </h1>
                <p className="mb-8 text-center text-zinc-400">Complete your profile to sign up</p>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-400">Full Name *</label>
                                <input type="text" required className="w-full rounded-lg bg-zinc-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-400">Email Address *</label>
                                <input type="email" required className="w-full rounded-lg bg-zinc-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-400">Password *</label>
                                <input type="password" required className="w-full rounded-lg bg-zinc-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-400">Phone</label>
                                <input type="tel" className="w-full rounded-lg bg-zinc-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" value={phone} onChange={e => setPhone(e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-400">Role</label>
                                <select className="w-full rounded-lg bg-zinc-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" value={role} onChange={e => setRole(e.target.value)}>
                                    <option value="attendee">Attendee</option>
                                    <option value="organizer">Organizer</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-400">Designation / Job Title *</label>
                                <input type="text" required className="w-full rounded-lg bg-zinc-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Student, Manager" value={designation} onChange={e => setDesignation(e.target.value)} />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-400">Profile Picture *</label>
                                <input type="file" accept="image/*" required onChange={(e) => e.target.files && setProfileImage(e.target.files[0])} className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700" />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-400">Org ID / Proof (Optional)</label>
                                <input type="file" accept="image/*,.pdf" onChange={(e) => e.target.files && setIdCard(e.target.files[0])} className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700" />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 p-3 font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? 'Submitting & Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-zinc-500">
                    Already have an account?{' '}
                    <a href="/login" className="text-indigo-400 hover:text-indigo-300">
                        Log in
                    </a>
                </p>
            </div>
        </div>
    );
}
