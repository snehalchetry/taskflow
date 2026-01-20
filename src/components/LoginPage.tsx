
import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (email: string) => boolean;
  onGoToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGoToRegister }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const success = onLogin(email);
      if (!success) {
        setError('User not registered. Please create an account.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <main className="flex w-full min-h-screen bg-background-dark overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0f1113] items-center justify-center overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] border border-primary/30 rounded-full rotate-12"></div>
          <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] border border-primary/20 rounded-lg -rotate-12"></div>
        </div>
        <div className="relative z-10 p-12 max-w-lg">
          <div className="w-full aspect-square bg-gradient-to-br from-[#1c3131] to-[#0f1113] rounded-2xl border border-white/5 shadow-2xl flex items-center justify-center mb-8 overflow-hidden group">
            <div 
              className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-110" 
              style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuALfHKrVqQpr6j5iyQ6rsD5VQLOc9GS2zYVkREEV4KW1HgQgZhjq5GGHSPCkb0RDjktWAVYLNt7Yij04S-C4ernBzMHox50UEJJt__aiUNm18RJENZDkHxxp3Ct8BHpxqmHAQezK5fWG7VGrK5cFlgis2LRTCJfHZysz8aXR9v6q7P9o0Cay_95mpe1pu1eGkptohGIyyi9nbEur-0PwvIyfBwf7k42OKnfroKPNQWGsuq3fkJLhxxcHXB3q-0VtBHY18W2QllGICU5')` }}
            ></div>
          </div>
          <h2 className="text-4xl font-black tracking-tight mb-4 text-white">Efficiency in Motion.</h2>
          <p className="text-slate-400 text-lg">Experience the next generation of task management.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 md:p-20 bg-background-dark">
        <div className="w-full max-w-[440px] space-y-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-background-dark font-bold">layers</span>
              </div>
              <p className="text-3xl font-black tracking-tighter uppercase text-white">TaskFlow</p>
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-white">Focus Awaits.</h1>
            <p className="text-[#97c4c4] text-base font-normal">Welcome back! Please enter your details.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm font-semibold animate-pulse">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
              <input 
                className="flex w-full rounded-lg border border-[#376262] bg-[#1c3131] h-14 placeholder:text-[#97c4c4]/40 p-[15px] text-base font-normal focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-white" 
                placeholder="demo@taskflow.io" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-slate-400">Password</label>
              <input 
                className="flex w-full rounded-lg border border-[#376262] bg-[#1c3131] h-14 placeholder:text-[#97c4c4]/40 p-[15px] focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-white" 
                placeholder="••••••••" 
                type="password"
                required
              />
            </div>

            <button 
              disabled={isLoading}
              className="w-full bg-primary text-background-dark font-bold text-lg h-14 rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50" 
              type="submit"
            >
              {isLoading ? (
                <span className="animate-spin material-symbols-outlined">progress_activity</span>
              ) : (
                <>Log In <span className="material-symbols-outlined">arrow_forward</span></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#97c4c4] pt-4">
            New to Taskflow? 
            <button onClick={onGoToRegister} className="text-primary font-bold hover:underline underline-offset-4 ml-1">Create an account</button>
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
