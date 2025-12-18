import { useConfig, AppConfig } from '../context/ConfigContext';

/**
 * useStore hook provides a unified way to access and update 
 * application-wide persistent settings and preferences.
 */
export function useStore() {
  const { config, updateConfig, resetConfig } = useConfig();

  return {
    settings: config,
    updateSettings: updateConfig,
    resetSettings: resetConfig
  };
}