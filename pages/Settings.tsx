import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ProfileCard } from '../components/settings/ProfileCard';
import { SecurityCard } from '../components/settings/SecurityCard';
import { SocialProfilesCard } from '../components/settings/SocialProfilesCard';
import { NotificationsCard } from '../components/settings/NotificationsCard';
import { AppearanceCard } from '../components/settings/AppearanceCard';

export function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage your account preferences and workspace configuration.</p>
      </div>

      <div className="space-y-6">
        <ProfileCard user={user} onLogout={logout} />
        
        <SecurityCard />
        
        <SocialProfilesCard />
        
        <NotificationsCard />
        
        <AppearanceCard currentTheme={theme} onThemeChange={setTheme} />
      </div>
    </div>
  );
}