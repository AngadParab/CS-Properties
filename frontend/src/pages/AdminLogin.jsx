import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, User, AlertCircle, Loader2 } from 'lucide-react';

function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect to dashboard automatically
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin-dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all credentials fields.');
      return;
    }

    setError('');
    setIsLoading(true);

    // Map simple username to email format if it does not contain '@'
    const emailPayload = username.includes('@')
      ? username.trim()
      : `${username.trim()}@creditsolutionsgoa.com`;

    const result = await login(emailPayload, password);
    setIsLoading(false);

    if (result.success) {
      navigate('/admin-dashboard', { replace: true });
    } else {
      setError(result.message || 'Invalid username or password.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-brand-bg px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-100 shadow-md p-6 sm:p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-blue-50 rounded-full text-brand-navy">
            <Shield className="w-8 h-8 text-brand-navy" />
          </div>
          <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight">Admin Portal</h1>
          <p className="text-xs text-brand-text-muted">
            Access the CRM leads database and content pipeline tools.
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-brand-error text-xs font-semibold p-3 rounded-lg border border-red-100 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-navy">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-navy">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white font-medium"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-navy text-white font-bold py-3 rounded-lg hover:bg-blue-900 transition-colors shadow-md flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Credentials Reminder card */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-[10px] sm:text-xs text-brand-text-muted space-y-1">
          <span className="font-bold text-brand-navy block uppercase tracking-wide">Developer Credentials</span>
          <p>Username: <span className="font-semibold text-brand-navy font-mono">admin</span></p>
          <p>Password: <span className="font-semibold text-brand-navy font-mono">adminpassword123</span></p>
        </div>

      </div>
    </div>
  );
}

export default AdminLogin;
