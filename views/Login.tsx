import React, { useState } from 'react';
import { ArrowLeft, Mail, ShieldCheck, KeyRound, User as UserIcon, Loader2, Chrome, CheckCircle2 } from 'lucide-react';
import { useApp } from '../AppContext';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';

const Login: React.FC = () => {
    const { navigate } = useApp();

    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // UI states
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const clearMessages = () => { setError(''); setSuccessMsg(''); };

    // ─── Sign Up ────────────────────────────────────────────────
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        clearMessages();

        if (!name.trim() || !email.trim() || !password.trim()) {
            setError('Please fill in all fields.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: name },
            },
        });

        if (signUpError) {
            setError(signUpError.message);
        } else {
            setSuccessMsg('Account created! Check your email to confirm your account, then sign in.');
            setAuthMode('signin');
            setPassword('');
        }
        setLoading(false);
    };

    // ─── Sign In ─────────────────────────────────────────────────
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        clearMessages();

        if (!email.trim() || !password.trim()) {
            setError('Please enter your email and password.');
            return;
        }

        setLoading(true);
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

        if (signInError) {
            if (signInError.message.includes('Email not confirmed')) {
                setError('Please confirm your email before signing in. Check your inbox.');
            } else if (signInError.message.includes('Invalid login credentials')) {
                setError('Wrong email or password. Please try again.');
            } else {
                setError(signInError.message);
            }
        } else {
            navigate('dashboard');
        }
        setLoading(false);
    };

    // ─── Google OAuth ────────────────────────────────────────────
    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        clearMessages();
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        });
        if (oauthError) {
            setError(oauthError.message);
            setGoogleLoading(false);
        }
        // On success, browser redirects — no need to handle here
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-6 relative z-10 pt-24 pb-12">
            <button
                onClick={() => navigate('home')}
                className="absolute top-24 left-4 md:left-12 flex items-center gap-2 font-bold text-black dark:text-gray-400 hover:text-zinc-600 dark:hover:text-white transition-colors"
            >
                <ArrowLeft className="w-5 h-5" /> Back
            </button>

            <div className="card-base w-full max-w-md bg-white dark:bg-[#0a0a0a] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-neo-purple p-6 md:p-8 border-b-2 border-black dark:bg-white/5 dark:border-white/10 text-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-white border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-none dark:border-white/20 dark:bg-black">
                        <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-black dark:text-nebula-teal" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-black dark:text-white uppercase font-brutal dark:font-sans">
                        {authMode === 'signin' ? 'Welcome Back' : 'Join the Club'}
                    </h2>
                    <p className="text-sm font-bold text-zinc-600 dark:text-gray-400">
                        {authMode === 'signin' ? 'Sync your career progress.' : 'Start your roadmap journey today.'}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex border-b-2 border-black dark:border-white/10">
                    <button
                        onClick={() => { setAuthMode('signin'); clearMessages(); }}
                        className={`flex-1 py-4 font-black uppercase text-sm tracking-wide transition-colors ${authMode === 'signin' ? 'bg-white text-black dark:bg-[#0a0a0a] dark:text-white' : 'bg-zinc-100 text-zinc-400 dark:bg-white/5 dark:text-gray-500 hover:bg-zinc-50'}`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => { setAuthMode('signup'); clearMessages(); }}
                        className={`flex-1 py-4 font-black uppercase text-sm tracking-wide transition-colors border-l-2 border-black dark:border-white/10 ${authMode === 'signup' ? 'bg-white text-black dark:bg-[#0a0a0a] dark:text-white' : 'bg-zinc-100 text-zinc-400 dark:bg-white/5 dark:text-gray-500 hover:bg-zinc-50'}`}
                    >
                        Sign Up
                    </button>
                </div>

                <div className="p-6 md:p-8 space-y-5">

                    {/* Google OAuth Button */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={googleLoading}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-black bg-white hover:bg-gray-50 font-bold text-black transition-all shadow-[3px_3px_0px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] dark:bg-white/5 dark:border-white/10 dark:text-white dark:shadow-none dark:hover:bg-white/10 dark:rounded-xl"
                    >
                        {googleLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        <span>Continue with Google</span>
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-[2px] bg-black/10 dark:bg-white/10"></div>
                        <span className="text-xs font-black uppercase text-zinc-400 tracking-widest">or</span>
                        <div className="flex-1 h-[2px] bg-black/10 dark:bg-white/10"></div>
                    </div>

                    {/* Success / Error Messages */}
                    {successMsg && (
                        <div className="flex items-start gap-2 p-3 bg-emerald-50 border-2 border-emerald-400 rounded-xl dark:bg-emerald-900/20 dark:border-emerald-500/40">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{successMsg}</p>
                        </div>
                    )}
                    {error && (
                        <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-3 border-2 border-red-200 rounded-xl dark:bg-red-900/20 dark:border-red-900/50">
                            {error}
                        </p>
                    )}

                    {/* Email / Password Form */}
                    {authMode === 'signup' ? (
                        <form onSubmit={handleSignUp} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black uppercase text-zinc-500 mb-2 dark:text-gray-400">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your full name"
                                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 border-2 border-black rounded-xl focus:bg-white outline-none font-bold text-black dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-nebula-teal transition-colors"
                                    />
                                    <UserIcon className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase text-zinc-500 mb-2 dark:text-gray-400">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@email.com"
                                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 border-2 border-black rounded-xl focus:bg-white outline-none font-bold text-black dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-nebula-teal transition-colors"
                                    />
                                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase text-zinc-500 mb-2 dark:text-gray-400">Password (min. 6 chars)</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 border-2 border-black rounded-xl focus:bg-white outline-none font-bold text-black dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-nebula-teal transition-colors"
                                    />
                                    <KeyRound className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400" />
                                </div>
                            </div>
                            <Button fullWidth type="submit" disabled={loading}>
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleSignIn} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black uppercase text-zinc-500 mb-2 dark:text-gray-400">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@email.com"
                                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 border-2 border-black rounded-xl focus:bg-white outline-none font-bold text-black dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-nebula-teal transition-colors"
                                    />
                                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase text-zinc-500 mb-2 dark:text-gray-400">Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 border-2 border-black rounded-xl focus:bg-white outline-none font-bold text-black dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-nebula-teal transition-colors"
                                    />
                                    <KeyRound className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400" />
                                </div>
                            </div>
                            <Button fullWidth type="submit" disabled={loading}>
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;