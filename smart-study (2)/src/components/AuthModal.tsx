import React, { useState } from 'react';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  School, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2,
  X,
  AlertCircle,
  EyeOff,
  LogOut,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { StudentProfile } from '../types';
import { API } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: StudentProfile) => void;
  onStayLoggedOut?: () => void;
  isLoggedOut?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onStayLoggedOut,
  isLoggedOut = false,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [className, setClassName] = useState('Class 10');
  const [school, setSchool] = useState('Delhi Public School');
  const [board, setBoard] = useState('CBSE');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleQuickDemoLogin = async () => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      const res = await API.login({ email: 'aarav.sharma@eduspark.ai', password: 'demopassword123' });
      if (res.success && res.student) {
        onLoginSuccess(res.student);
        onClose();
      } else {
        // Fallback local demo profile
        const demoProfile: StudentProfile = {
          id: 'student-demo-1',
          name: 'Aarav Sharma',
          email: 'aarav.sharma@eduspark.ai',
          className: 'Class 10',
          school: 'Delhi Public School, R.K. Puram',
          board: 'CBSE',
          subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'],
          preferredLanguage: 'English',
          dailyTargetMinutes: 120,
          targetExamGoal: '95%+ in Class 10 Board Examinations',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          xp: 3450,
          level: 14,
          rankTitle: 'Scholar Prodigy',
          studyStreakDays: 12,
        };
        onLoginSuccess(demoProfile);
        onClose();
      }
    } catch (e: any) {
      setAuthError(e.message || 'Demo login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStayLoggedOut = () => {
    if (onStayLoggedOut) {
      onStayLoggedOut();
    }
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (mode === 'forgot') {
      setForgotSubmitted(true);
      setTimeout(() => {
        setForgotSubmitted(false);
        setMode('login');
      }, 2000);
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await API.login({ email, password });
        if (res.success && res.student) {
          onLoginSuccess(res.student);
          onClose();
        } else {
          setAuthError(res.message || 'Login failed. Please check credentials.');
        }
      } else if (mode === 'signup') {
        const res = await API.register({
          name,
          email,
          password,
          className,
          school,
          board,
        });
        if (res.success && res.student) {
          onLoginSuccess(res.student);
          onClose();
        } else {
          setAuthError(res.message || 'Signup failed. Please try again.');
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-brand-600 text-white font-black shadow-md">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {mode === 'login' && 'Student Login'}
                {mode === 'signup' && 'Create Student Account'}
                {mode === 'forgot' && 'Reset Password'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {mode === 'login' && 'Access your personalized learning progress & notes'}
                {mode === 'signup' && 'Join thousands of CBSE, ICSE & State board toppers'}
                {mode === 'forgot' && 'Enter your registered email address'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification banner */}
        {authError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{authError}</span>
          </div>
        )}

        {/* Demo Quick Login Button */}
        {mode === 'login' && (
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-2xl bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-bold flex items-center justify-between hover:bg-brand-100 dark:hover:bg-brand-900/60 transition-colors shadow-xs"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Instant Demo Account (Aarav - Class 10 CBSE)</span>
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Student Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Class / Grade
                </label>
                <select
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Board
                </label>
                <select
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500"
                >
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="State Board">State Board</option>
                  <option value="IB / Cambridge">IB / Cambridge</option>
                </select>
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {forgotSubmitted && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Password reset link sent to your email!</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-98 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </span>
            ) : (
              <span>
                {mode === 'login' && 'Sign In with Account'}
                {mode === 'signup' && 'Create Verified Student Account'}
                {mode === 'forgot' && 'Send Password Reset Link'}
              </span>
            )}
          </button>
        </form>

        {/* Option to Stay Logged Out / Continue as Guest */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleStayLoggedOut}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400" />
            <span>Stay Logged Out (Continue as Guest)</span>
          </button>

          {/* Toggle Mode */}
          <div className="text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthError(null); setMode('signup'); }}
                  className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Sign up now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthError(null); setMode('login'); }}
                  className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
