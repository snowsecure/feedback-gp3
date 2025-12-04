"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                router.push('/');
                router.refresh();
            } else {
                setError('Invalid credentials');
                setIsLoading(false);
            }
        } catch (err) {
            setError('An error occurred');
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
        }}>
            <div className="card" style={{
                width: '100%',
                maxWidth: '420px',
                padding: '3rem 2rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                    <Image
                        src="/sailboat-new.png"
                        alt="Sailboat"
                        width={140}
                        height={140}
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                            style={{ padding: '1rem' }}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ padding: '1rem' }}
                        />
                    </div>

                    {error && (
                        <div style={{
                            color: '#DC2626',
                            fontSize: '0.875rem',
                            textAlign: 'center',
                            padding: '0.5rem',
                            background: '#FEF2F2',
                            borderRadius: '8px',
                            border: '1px solid #FECACA'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                        style={{
                            marginTop: '0.5rem',
                            padding: '1rem',
                            fontSize: '1rem',
                            justifyContent: 'center'
                        }}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
