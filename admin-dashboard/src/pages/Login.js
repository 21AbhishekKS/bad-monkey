import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Invalid email or password');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-bold mb-2">
            <span className="text-brand-primary">BAD MONKEY</span>
            <span className="text-white ml-2">ADMIN</span>
          </h1>
          <p className="text-neutral-500">Sign in to manage your store</p>
        </div>

        <div className="bg-surface border border-border p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-brand-secondary/10 border border-brand-secondary text-brand-secondary p-3 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-white text-sm font-subheading tracking-wider uppercase mb-2">
                Email
              </label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full bg-background border border-border text-white px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors"
                placeholder="admin@badmonkey.com" />
            </div>

            <div>
              <label className="block text-white text-sm font-subheading tracking-wider uppercase mb-2">
                Password
              </label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full bg-background border border-border text-white px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors"
                placeholder="••••••••" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-brand-primary text-black font-subheading text-sm tracking-widest uppercase px-8 py-4 hover:bg-white transition-all flex items-center justify-center gap-3 disabled:opacity-50">
              {loading ? 'SIGNING IN...' : (
                <>
                  <LogIn className="w-5 h-5" />
                  SIGN IN
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-neutral-500 text-sm mt-6">
          Default: admin@badmonkey.com
        </p>
      </div>
    </div>
  );
};

export default Login;