# CrashCourse

A Tinder-style North American driver's license exam prep app. Swipe to answer, get it wrong and watch a crash video to remember why the rule matters.

## Tech Stack

- **React 19 + TypeScript** — UI
- **Vite** — Build
- **Tailwind CSS v4** — Styling
- **Framer Motion** — Swipe card physics & animations
- **Zustand** — State management
- **Capacitor** — iOS native wrapper
- **React Router** — Navigation

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run in browser (dev mode)
npm run dev
```

Open http://localhost:5173/

## Deploy to iPhone (via USB)

Requires: **Xcode** (free from App Store) + **Apple ID** (free, no paid developer account needed)

```bash
# 1. Build web assets
npm run build

# 2. Sync to iOS project
npx cap sync ios

# 3. Open in Xcode
npx cap open ios
```

Then in Xcode:
1. Select your iPhone (connected via USB)
2. **Signing & Capabilities** → set **Team** to your own Apple ID
3. Change **Bundle Identifier** to something unique (e.g. `com.crashcourse.yourname`)
4. Click **▶ Run**

> Free Apple ID limitation: app expires after 7 days, just re-Run to refresh.

## Project Structure

```
src/
├── data/questions.ts       # Quiz questions + video mappings
├── stores/quizStore.ts     # Zustand store (progress, answers, favorites)
├── components/
│   ├── AppShell.tsx         # Layout: background + status bar + tab bar
│   ├── SwipeCard.tsx        # Draggable quiz card (framer-motion)
│   ├── VideoOverlay.tsx     # Full-screen wrong-answer video
│   ├── TabBar.tsx           # Bottom navigation
│   └── GlassCard.tsx        # Reusable glass panel
├── screens/
│   ├── TutorialScreen.tsx   # Onboarding carousel
│   ├── LoginScreen.tsx
│   ├── MenuScreen.tsx       # Practice / Review / Settings
│   ├── QuizScreen.tsx       # Main quiz loop
│   ├── ReviewScreen.tsx
│   ├── ProfileScreen.tsx
│   └── SettingsScreen.tsx
public/
├── videos/                  # Crash feedback videos (sample1-4.mp4)
└── tutorialVideos/          # Onboarding demo videos
```

## For Teammates

After cloning:
```bash
npm install
npm run build
npx cap sync ios
npx cap open ios
```
Then set your own Apple ID in Xcode Signing & Capabilities → done.
