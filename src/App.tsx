import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import LoginScreen from './screens/LoginScreen';
import TutorialScreen from './screens/TutorialScreen';
import MenuScreen from './screens/MenuScreen';
import QuizScreen from './screens/QuizScreen';
import ReviewScreen from './screens/ReviewScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/tutorial" element={<TutorialScreen />} />
          <Route path="/menu" element={<MenuScreen />} />
          <Route path="/quiz" element={<QuizScreen />} />
          <Route path="/review" element={<ReviewScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="*" element={<Navigate to="/tutorial" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
