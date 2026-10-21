import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import '../pages/home/HomePage.css';

const API_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:3000';

const navigation = [
  ['Home', '/home', '⌂'],
  ['Inventario', '/inventario', '⬡'],
  ['Entradas', '/entradas', '↓'],
  ['Salidas', '/salidas', '↑'],
  ['Categorías', '/categorias', '◇'],
  ['Productos', '/productos', '▣'],
  ['Sucursales', '/sucursales', '⌑'],
  ['Administración', '/administracion', '♙'],
  ['Almacenes', '/almacenes', '▤'],
  ['Cuenta', '/cuenta', '○'],
];

function DashboardLayout({ onSignOut }) {
  const [search, setSearch] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [usuario, setUsuario] = useState(() => JSON.parse(localStorage.getItem('usuario') ?? 'null'));
  const location = useLocation();
  const activePage = navigation.find(([, path]) => path === location.pathname)?.[0] ?? 'Home';
  const nombre = usuario?.nombre ?? '';
  const iniciales = nombre.split(' ').filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join('');
  const esSuperAdmin = /^super[\s_-]?admin/i.test(usuario?.rol ?? '');
  const visibleNavigation = navigation.filter(([, path]) => path !== '/administracion' || esSuperAdmin);

  function updateUsuario(nuevoUsuario) {
    localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
    setUsuario(nuevoUsuario);
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${API_URL}/api/auth/perfil`, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => (response.ok ? response.json() : null))
      .then(data => {
        if (data?.nombre) {
          localStorage.setItem('usuario', JSON.stringify(data));
          setUsuario(data);
        }
      })
      .catch(() => {});
  }, []);

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <div className={`dashboard${isSidebarCollapsed ? ' dashboard--collapsed' : ''}${isMobileMenuOpen ? ' dashboard--mobile-open' : ''}`}>
      {isMobileMenuOpen && <button className="sidebar-backdrop" aria-label="Cerrar menú" onClick={closeMobileMenu} />}
      <aside className="sidebar">
        <div className="brand brand--sidebar">
          <span className="brand__mark">ML</span>
          <span className="brand__name">ML Grupo<small>COMERCIAL</small></span>
        </div>
        <nav className="sidebar__nav" aria-label="Navegación principal">
          {visibleNavigation.map(([label, path, icon]) => (
            <NavLink key={path} to={path} end className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`} onClick={closeMobileMenu} title={label}>
              <span className="nav-item__icon" aria-hidden="true">{icon}</span><span className="nav-item__label">{label}</span>
              {['Categorías', 'Productos', 'Sucursales', 'Almacenes'].includes(label) && <span className="nav-item__chevron">›</span>}
            </NavLink>
          ))}
        </nav>
        <button className="signout-button" onClick={onSignOut}>CERRAR SESIÓN <span aria-hidden="true">→</span></button>
      </aside>

      <div className="dashboard__workspace">
        <header className="topbar">
          <button
            className="icon-button menu-toggle"
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
            onClick={() => {
              if (window.matchMedia?.('(max-width: 720px)').matches) {
                setIsMobileMenuOpen(!isMobileMenuOpen);
              } else {
                setIsSidebarCollapsed(!isSidebarCollapsed);
              }
            }}
          >☰</button>
          <label className="search-box"><span aria-hidden="true">⌕</span><input aria-label="Buscar en el sistema" placeholder="Buscar en el sistema..." value={search} onChange={event => setSearch(event.target.value)} /></label>
          <div className="topbar__spacer" />
          <button className="icon-button notification-button" aria-label="Notificaciones">♧<i /></button>
          <button className="icon-button fullscreen-button" aria-label="Pantalla completa" onClick={() => document.documentElement.requestFullscreen?.()}>⛶</button>
          <div className="user-menu"><span className="user-menu__avatar">{iniciales}</span><span className="user-menu__name">{nombre}</span></div>
        </header>

        <main className="dashboard-main">
          <div className="page-heading">
            <div><h1>{activePage === 'Home' ? 'Panel general' : activePage}</h1></div>
          </div>
          <Outlet context={{ search, updateUsuario }} />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;