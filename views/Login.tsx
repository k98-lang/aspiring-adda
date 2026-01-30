import React, { useState } from 'react';
import { ArrowLeft, Mail, ShieldCheck, KeyRound, Smartphone, User as UserIcon, Loader2 } from 'lucide-react';
import { useApp } from '../AppContext';
import Button from '../components/Button';

// Helper to simulate a backend database in localStorage
const getUsersDB = () => {
    try {
        return JSON.parse(localStorage.getItem('aspiring_users_db') || '{}');
    } catch { return {}; }
};

const saveUserToDB = (email: string, data: { name: string; password?: string }) => {
    const db = getUsersDB();
    db[email] = data;
    localStorage.setItem('aspiring_users_db', JSON.stringify(db));
};

const Login: React.FC = () => {
  const { navigate, login } = useApp();

  // State for View Mode
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [signinMethod, setSigninMethod] = useState<'password' | 'otp'>('password');
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const clearErrors = () => setError('');

  const handleSignUp = (e: React.FormEvent) => {
      e.preventDefault();
      clearErrors();

      if (!name || !email || !password) {
          setError("Please fill in all fields.");
          return;
      }

      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
          const db = getUsersDB();
          if (db[email]) {
              setError("User already exists. Please Sign In.");
              setLoading(false);
              return;
          }

          // Create User
          saveUserToDB(email, { name, password });
          login(email, name);
          setLoading(false);
          navigate('home');
      }, 1500);
  };

  const handleSignInPassword = (e: React.FormEvent) => {
      e.preventDefault();
      clearErrors();

      if (!email || !password) {
          setError("Please enter email and password.");
          return;
      }

      setLoading(true);
      setTimeout(() => {
          const db = getUsersDB();
          const user = db[email];

          if (!user) {
              setError("User not found. Please Sign Up.");
              setLoading(false);
              return;
          }

          if (user.password !== password) {
              setError("Invalid password.");
              setLoading(false);
              return;
          }

          // Success
          login(email, user.name);
          setLoading(false);
          navigate('home');
      }, 1500);
  };

  const handleRequestOTP = (e: React.FormEvent) => {
      e.preventDefault();
      clearErrors();

      if (!email) {
          setError("Please enter your email.");
          return;
      }

      setLoading(true);
      setTimeout(() => {
          const db = getUsersDB();
          const user = db[email];

          if (!user) {
              setError("User not found. Please Sign Up first.");
              setLoading(false);
              return;
          }

          // Success - Move to verify step
          setOtpStep('verify');
          setLoading(false);
      }, 1500);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
      e.preventDefault();
      clearErrors();

      if (otp.length < 4) {
          setError("Invalid code.");
          return;
      }

      setLoading(true);
      setTimeout(() => {
          // In a real app, verify OTP here.
          // For demo, we just log them in using the data we found in the previous step
          const db = getUsersDB();
          const user = db[email]; // Should exist since we checked in request step

          login(email, user.name);
          setLoading(false);
          navigate('home');
      }, 1500);
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
        {/* Header Section */}
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
                onClick={() => { setAuthMode('signin'); clearErrors(); }}
                className={`flex-1 py-4 font-black uppercase text-sm tracking-wide transition-colors ${authMode === 'signin' ? 'bg-white text-black dark:bg-[#0a0a0a] dark:text-white' : 'bg-zinc-100 text-zinc-400 dark:bg-white/5 dark:text-gray-500 hover:bg-zinc-50'}`}
            >
                Sign In
            </button>
            <button
                onClick={() => { setAuthMode('signup'); clearErrors(); }}
                className={`flex-1 py-4 font-black uppercase text-sm tracking-wide transition-colors border-l-2 border-black dark:border-white/10 ${authMode === 'signup' ? 'bg-white text-black dark:bg-[#0a0a0a] dark:text-white' : 'bg-zinc-100 text-zinc-400 dark:bg-white/5 dark:text-gray-500 hover:bg-zinc-50'}`}
            >
                Sign Up
            </button>
        </div>

        <div className="p-6 md:p-8">
            {authMode === 'signup' ? (
                /* SIGN UP FORM */
                <form onSubmit={handleSignUp} className="space-y-5">
                    <div>
                        <label className="block text-xs font-black uppercase text-zinc-500 mb-2 dark:text-gray-400">Full Name</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Elon Musk"
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
                                placeholder="elon@tesla.com"
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

                    {error && <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-2 border-2 border-red-100 rounded-lg dark:bg-red-900/20 dark:border-red-900/50">{error}</p>}

                    <Button fullWidth type="submit" disabled={loading}>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                    </Button>
                </form>
            ) : (
                /* SIGN IN FORM */
                <div className="space-y-6">
                    {/* Method Toggle */}
                    <div className="flex p-1 bg-zinc-100 rounded-lg border-2 border-zinc-200 dark:bg-white/5 dark:border-white/10">
                        <button
                            onClick={() => { setSigninMethod('password'); clearErrors(); }}
                            className={`flex-1 py-1.5 text-xs font-black uppercase rounded-md transition-all ${signinMethod === 'password' ? 'bg-white text-black shadow-sm dark:bg-white/10 dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
                        >
                            Password
                        </button>
                        <button
                            onClick={() => { setSigninMethod('otp'); clearErrors(); }}
                            className={`flex-1 py-1.5 text-xs font-black uppercase rounded-md transition-all ${signinMethod === 'otp' ? 'bg-white text-black shadow-sm dark:bg-white/10 dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
                        >
                            OTP / Magic Link
                        </button>
                    </div>

                    {signinMethod === 'password' ? (
                        <form onSubmit={handleSignInPassword} className="space-y-5">
                             <div>
                                <label className="block text-xs font-black uppercase text-zinc-500 mb-2 dark:text-gray-400">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="elon@tesla.com"
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

                            {error && <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-2 border-2 border-red-100 rounded-lg dark:bg-red-900/20 dark:border-red-900/50">{error}</p>}

                            <Button fullWidth type="submit" disabled={loading}>
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                            </Button>
                        </form>
                    ) : (
                        /* OTP LOGIN FLOW */
                        <>
                            {otpStep === 'request' ? (
                                <form onSubmit={handleRequestOTP} className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-black uppercase text-zinc-500 mb-2 dark:text-gray-400">Email Address</label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="elon@tesla.com"
                                                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border-2 border-black rounded-xl focus:bg-white outline-none font-bold text-black dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-nebula-teal transition-colors"
                                            />
                                            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-zinc-400" />
                                        </div>
                                    </div>

                                    {error && <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-2 border-2 border-red-100 rounded-lg dark:bg-red-900/20 dark:border-red-900/50">{error}</p>}

                                    <Button fullWidth type="submit" disabled={loading}>
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Code'}
                                    </Button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOTP} className="space-y-5">
                                    <div className="text-center mb-4">
                                        <div className="inline-block p-3 bg-green-100 rounded-full border-2 border-black mb-2 dark:bg-green-900/20 dark:border-green-500">
                                            <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
                                        </div>
                                        <p className="text-sm font-bold text-zinc-500 dark:text-gray-400">Code sent to <span className="text-black dark:text-white">{email}</span></p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase text-zinc-500 mb-2 dark:text-gray-400">Verification Code</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                placeholder="1234"
                                                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border-2 border-black rounded-xl focus:bg-white outline-none font-bold text-black text-center text-2xl tracking-widest dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-nebula-teal transition-colors"
                                                autoFocus
                                            />
                                            <Smartphone className="absolute left-3 top-4 w-5 h-5 text-zinc-400" />
                                        </div>
                                        <p className="text-xs text-center mt-2 text-zinc-400">
                                            (Use 1234 for demo)
                                        </p>
                                    </div>

                                    {error && <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-2 border-2 border-red-100 rounded-lg dark:bg-red-900/20 dark:border-red-900/50">{error}</p>}

                                    <div className="space-y-3">
                                        <Button fullWidth type="submit" disabled={loading}>
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Login'}
                                        </Button>
                                        <button
                                            type="button"
                                            onClick={() => setOtpStep('request')}
                                            className="w-full text-center text-xs font-bold text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white underline"
                                        >
                                            Change Email
                                        </button>
                                    </div>
                                </form>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Login;