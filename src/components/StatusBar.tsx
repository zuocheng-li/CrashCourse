import { Capacitor } from '@capacitor/core';

export default function StatusBar() {
  // On a real device, iOS provides the real status bar — don't render a fake one
  if (Capacitor.isNativePlatform()) {
    return <div style={{ height: 'env(safe-area-inset-top, 44px)' }} />;
  }

  // Web/browser: show simulated iOS status bar
  return (
    <div className="h-11 px-5 flex items-center justify-between text-sm font-semibold text-white relative z-10">
      <span className="tracking-wide">9:41</span>
      <div className="flex items-center gap-1 text-sm">
        <i className="fas fa-signal" />
        <i className="fas fa-wifi" />
        <i className="fas fa-battery-full" />
      </div>
    </div>
  );
}
