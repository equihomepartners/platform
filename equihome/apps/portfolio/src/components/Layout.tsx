import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={`app-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <header className="app-header">
        <div className="header-left">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <i className={`fas ${sidebarCollapsed ? 'fa-bars' : 'fa-times'}`}></i>
          </button>
          <div className="app-logo">
            <span className="logo-text">Equihome Portfolio</span>
          </div>
        </div>
        <div className="header-right">
          <div className="user-menu">
            <span className="user-name">Admin</span>
            <i className="fas fa-user-circle"></i>
          </div>
        </div>
      </header>

      <aside className="app-sidebar">
        <nav className="sidebar-nav">
          <ul>
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link to="/">
                <i className="fas fa-chart-pie"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className={location.pathname === '/portfolio' ? 'active' : ''}>
              <Link to="/portfolio">
                <i className="fas fa-briefcase"></i>
                <span>Portfolio</span>
              </Link>
            </li>
            <li className={location.pathname === '/scenarios' ? 'active' : ''}>
              <Link to="/scenarios">
                <i className="fas fa-flask"></i>
                <span>Scenarios</span>
              </Link>
            </li>
            <li className={location.pathname === '/parameters' ? 'active' : ''}>
              <Link to="/parameters">
                <i className="fas fa-sliders-h"></i>
                <span>Parameters</span>
              </Link>
            </li>
            <li className={location.pathname === '/tls-integration' ? 'active' : ''}>
              <Link to="/tls-integration">
                <i className="fas fa-traffic-light"></i>
                <span>TLS Integration</span>
              </Link>
            </li>
            <li className={location.pathname === '/underwriting' ? 'active' : ''}>
              <Link to="/underwriting">
                <i className="fas fa-file-contract"></i>
                <span>Underwriting</span>
              </Link>
            </li>
            <li className={location.pathname === '/settings' ? 'active' : ''}>
              <Link to="/settings">
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="app-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
