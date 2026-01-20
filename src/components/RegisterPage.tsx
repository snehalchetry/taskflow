
import React, { useState } from 'react';

interface RegisterPageProps {
  onRegister: (name: string, email: string) => boolean;
  onGoToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onGoToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const success = onRegister(name, email);
      if (!success) {
        setError('Email already in use.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <main className="flex w-full min-h-screen bg-background-dark overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0f1113] items-center justify-center overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] border border-primary/30 rounded-full rotate-12"></div>
        </div>
        <div className="relative z-10 p-12 max-w-lg">
          <h2 className="text-4xl font-black tracking-tight mb-4 text-white">Join the Flow.</h2>
          <p className="text-slate-400 text-lg">Create your modular workspace and start achieving more today.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 md:p-20 bg-background-dark">
        <div className="w-full max-w-[440px] space-y-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-white">Create Account</h1>
            <p className="text-[#97c4c4] text-base font-normal">Step into a more productive version of you.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <div className="p-3 bg-red-500/10 text-red-500 rounded-lg text-sm">{error}</div>}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Full Name</label>
              <input 
                className="flex w-full rounded-lg border border-[#376262] bg-[#1c3131] h-12 p-[15px] text-white outline-none" 
                placeholder="John Doe" 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
              <input 
                className="flex w-full rounded-lg border border-[#376262] bg-[#1c3131] h-12 p-[15px] text-white outline-none" 
                placeholder="name@company.com" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
              <input 
                className="flex w-full rounded-lg border border-[#376262] bg-[#1c3131] h-12 p-[15px] text-white outline-none" 
                placeholder="••••••••" 
                type="password"
                required
              />
            </div>

            <button 
              disabled={isLoading}
              className="w-full bg-primary text-background-dark font-bold text-lg h-14 rounded-lg shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50" 
              type="submit"
            >
              {isLoading ? <span className="animate-spin material-symbols-outlined">progress_activity</span> : 'Get Started'}
            </button>
          </form>

          <p className="text-center text-sm text-[#97c4c4]">
            Already have an account? 
            <button onClick={onGoToLogin} className="text-primary font-bold hover:underline ml-1">Log In</button>
          </p>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
