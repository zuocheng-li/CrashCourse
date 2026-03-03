import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';

export default function SettingsScreen() {
  const navigate = useNavigate();

  return (
    <div className="pt-4 pb-10">
      <header className="mb-6">
        <h1 className="text-xl font-bold">Settings</h1>
        <p className="text-white/70 text-sm mt-1">App preferences</p>
      </header>

      <GlassCard className="rounded-2xl overflow-hidden divide-y divide-white/10">
        <label className="flex items-center justify-between p-4 cursor-pointer">
          <span className="text-white/90">Sound effects</span>
          <input
            type="checkbox"
            defaultChecked
            className="rounded bg-white/20 border-white/30 text-[#e94560] focus:ring-[#e94560]"
          />
        </label>
        <label className="flex items-center justify-between p-4 cursor-pointer">
          <span className="text-white/90">Video autoplay on wrong</span>
          <input
            type="checkbox"
            defaultChecked
            className="rounded bg-white/20 border-white/30 text-[#e94560] focus:ring-[#e94560]"
          />
        </label>
        <label className="flex items-center justify-between p-4 cursor-pointer">
          <span className="text-white/90">Daily reminder</span>
          <input
            type="checkbox"
            className="rounded bg-white/20 border-white/30 text-[#e94560] focus:ring-[#e94560]"
          />
        </label>
      </GlassCard>

      <div className="mt-8">
        <button
          onClick={() => navigate('/menu')}
          className="w-full py-4 rounded-xl bg-[#e94560] text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#e94560]/25 active:scale-[0.98] transition-transform"
        >
          <i className="fas fa-check mr-1" /> Done
        </button>
      </div>
    </div>
  );
}
