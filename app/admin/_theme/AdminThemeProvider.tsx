'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { type AdminTheme, isAdminTheme, VALID_ADMIN_THEMES } from './admin-theme-constants';

interface AdminThemeContextValue {
  theme: AdminTheme;
  setTheme: (theme: AdminTheme) => void;
}

const AdminThemeContext = createContext<AdminThemeContextValue | null>(null);

const STORAGE_KEY = 'admin-theme';
const DEFAULT_THEME: AdminTheme = 'slate-console';

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AdminTheme>(DEFAULT_THEME);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isAdminTheme(stored)) {
      setThemeState(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (next: AdminTheme) => setThemeState(next);

  return (
    <AdminThemeContext.Provider value={{ theme, setTheme }}>
      <div id="admin-shell" data-admin-theme={theme} className="admin-shell" suppressHydrationWarning>
        {children}
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var valid=${JSON.stringify(VALID_ADMIN_THEMES)};var t=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});var el=document.getElementById('admin-shell');if(el&&valid.indexOf(t)!==-1)el.setAttribute('data-admin-theme',t);}catch(e){}})();`,
        }}
      />
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme(): AdminThemeContextValue {
  const ctx = useContext(AdminThemeContext);
  if (!ctx) throw new Error('useAdminTheme must be used within an AdminThemeProvider');
  return ctx;
}
