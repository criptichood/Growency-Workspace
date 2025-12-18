import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetails } from './pages/ProjectDetails';
import { Team } from './pages/Team';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import { TeamProvider } from './context/TeamContext';
import { ProjectProvider } from './context/ProjectContext';
import { ThemeProvider } from './context/ThemeContext';
import { ConfigProvider } from './context/ConfigContext';
import { DashboardLayoutProvider } from './context/DashboardLayoutContext';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <ConfigProvider>
      <TeamProvider>
        <AuthProvider>
          <ProjectProvider>
            <ThemeProvider>
              <DashboardLayoutProvider>
                <HashRouter>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    
                    <Route path="/" element={
                      <ProtectedRoute>
                        <Layout />
                      </ProtectedRoute>
                    }>
                      <Route index element={<Navigate to="/dashboard" replace />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="projects" element={<Projects />} />
                      <Route path="projects/:projectCode" element={<ProjectDetails />} />
                      <Route path="team" element={<Team />} />
                      <Route path="settings" element={<Settings />} />
                    </Route>
                  </Routes>
                </HashRouter>
              </DashboardLayoutProvider>
            </ThemeProvider>
          </ProjectProvider>
        </AuthProvider>
      </TeamProvider>
    </ConfigProvider>
  );
}