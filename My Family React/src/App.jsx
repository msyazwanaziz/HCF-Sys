import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Network, LayoutDashboard, Users, GitMerge, Sun, Moon, Languages } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Directory from './pages/Directory';
import FamilyTree from './pages/FamilyTree';
import { useLanguage } from './i18n';

function AppLayout() {
  const [theme, setTheme] = useState(localStorage.getItem('family_theme') || 'dark');
  const location = useLocation();
  const { t, lang, toggleLang } = useLanguage();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('family_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(x => x === 'dark' ? 'light' : 'dark');
  };

  const getPageTitle = () => {
    if (location.pathname === '/') return t('dashboard');
    if (location.pathname === '/directory') return t('directory');
    if (location.pathname === '/tree') return t('tree');
    return t('appName');
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo">
          <Network />
          <span>{t('appName')}</span>
        </div>
        <nav className="nav-menu">
          <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> {t('dashboard')}
          </Link>
          <Link to="/directory" className={`nav-item ${location.pathname === '/directory' ? 'active' : ''}`}>
            <Users size={20} /> {t('directory')}
          </Link>
          <Link to="/tree" className={`nav-item ${location.pathname === '/tree' ? 'active' : ''}`}>
            <GitMerge size={20} /> {t('tree')}
          </Link>
        </nav>
        <div className="sidebar-footer" style={{ gap: '12px' }}>
          <button className="btn-icon" onClick={toggleLang} aria-label="Toggle Language" title={lang === 'en' ? 'Tukar ke Bahasa Melayu' : 'Switch to English'}>
            <Languages size={20} />
          </button>
          <button className="btn-icon" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <h1>{getPageTitle()}</h1>
        </header>

        <div className="views-container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/directory" element={<Directory />} />
              <Route path="/tree" element={<FamilyTree />} />
            </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
