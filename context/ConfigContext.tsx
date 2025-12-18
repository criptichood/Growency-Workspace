import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AppConfig {
  sidebarExpanded: boolean;
  compactMode: boolean;
  reducedMotion: boolean;
  animationsEnabled: boolean;
  showDeveloperTools: boolean;
}

interface ConfigContextType {
  config: AppConfig;
  updateConfig: (updates: Partial<AppConfig>) => void;
  resetConfig: () => void;
}

const DEFAULT_CONFIG: AppConfig = {
  sidebarExpanded: false,
  compactMode: false,
  reducedMotion: false,
  animationsEnabled: true,
  showDeveloperTools: false,
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>(() => {
    const stored = localStorage.getItem('growency_app_config');
    if (stored) {
      try {
        return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
      } catch (e) {
        return DEFAULT_CONFIG;
      }
    }
    return DEFAULT_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem('growency_app_config', JSON.stringify(config));
    
    // Apply global UI modifiers
    const root = window.document.documentElement;
    if (config.compactMode) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
  }, [config]);

  const updateConfig = (updates: Partial<AppConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}