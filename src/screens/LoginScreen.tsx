import { useNavigate } from 'react-router-dom';

export default function LoginScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-44px)] pb-8">
      <div className="text-center mb-10">
        <div className="glass w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-car-crash text-4xl text-[#e94560]" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">CrashCourse</h1>
        <p className="text-white/70 mt-2 text-sm">Learn the rules. Avoid the crash.</p>
      </div>

      <div className="glass w-full max-w-[320px] p-6 rounded-2xl">
        <label className="block text-sm font-medium text-white/90 mb-2">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#e94560]/50 mb-4"
        />
        <label className="block text-sm font-medium text-white/90 mb-2">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#e94560]/50 mb-6"
        />
        <button
          onClick={() => navigate('/menu')}
          className="w-full py-3.5 rounded-xl bg-[#e94560] text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#e94560]/25 active:scale-[0.98] transition-transform"
        >
          <i className="fas fa-sign-in-alt" /> Sign in
        </button>
        <p className="text-center text-white/60 text-xs mt-4">
          New here?{' '}
          <span className="text-[#e94560] font-medium cursor-pointer">Sign up</span>
        </p>
      </div>

      <p className="text-white/50 text-xs mt-8 text-center max-w-[280px]">
        By continuing, you agree to our Terms and Privacy Policy.
      </p>
    </div>
  );
}
