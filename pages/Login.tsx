import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Command, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../constants';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillCredentials = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('password');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 font-bold text-2xl text-indigo-600 dark:text-indigo-400">
                <div className="p-2 bg-indigo-600 dark:bg-indigo-500 rounded-lg">
                    <Command className="w-6 h-6 text-white" />
                </div>
                <span className="text-gray-900 dark:text-white">{APP_NAME}</span>
            </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300">
          <div className="p-8">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 text-center uppercase tracking-tighter">Welcome back</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8 font-medium">Sign in to your internal workspace account</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-3 text-sm text-red-600 dark:text-red-400 animate-in shake duration-300">
                <AlertCircle size={18} />
                <span className="font-bold">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 font-medium"
                    placeholder="you@growency.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 font-medium"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold">
                <label className="flex items-center gap-2 text-gray-500 dark:text-gray-400 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded-lg border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-gray-100 dark:bg-gray-700 transition-all cursor-pointer" />
                  <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-xl hover:shadow-indigo-500/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2 active:scale-95 text-sm uppercase tracking-wider"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900/40 px-8 py-6 border-t border-gray-100 dark:border-gray-700 transition-colors duration-200">
             <p className="text-[10px] font-black text-center text-gray-400 dark:text-gray-500 mb-4 uppercase tracking-[0.2em]">Demo Credentials</p>
             <div className="grid grid-cols-3 gap-2">
                <button onClick={() => fillCredentials('admin@growency.com')} className="text-[10px] font-bold py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-500 dark:text-gray-400 transition-all shadow-sm">ADMIN</button>
                <button onClick={() => fillCredentials('sales@growency.com')} className="text-[10px] font-bold py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-500 dark:text-gray-400 transition-all shadow-sm">SALES</button>
                <button onClick={() => fillCredentials('dev@growency.com')} className="text-[10px] font-bold py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-500 dark:text-gray-400 transition-all shadow-sm">DEV</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}