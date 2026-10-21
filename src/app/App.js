import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AccountPage from '../pages/account/AccountPage';
import AdministrationPage from '../pages/administration/AdministrationPage';
import BranchesPage from '../pages/branches/BranchesPage';
import CategoriesPage from '../pages/categories/CategoriesPage';
import EntriesPage from '../pages/entries/EntriesPage';
import ExitsPage from '../pages/exits/ExitsPage';
import DashboardHome from '../pages/home/DashboardHome';
import InventoryPage from '../pages/inventory/InventoryPage';
import LoginPage from '../pages/login/LoginPage';
import ProductsPage from '../pages/products/ProductsPage';
import WarehousesPage from '../pages/warehouses/WarehousesPage';
import DashboardLayout from './DashboardLayout';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(() => Boolean(localStorage.getItem('token')));

  function signIn({ token, usuario }) {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    setIsSignedIn(true);
  }

  function signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setIsSignedIn(false);
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={isSignedIn ? <Navigate to="/home" replace /> : <LoginPage onSignIn={signIn} />} />
        <Route element={isSignedIn ? <DashboardLayout onSignOut={signOut} /> : <Navigate to="/" replace />}>
          <Route path="/home" element={<DashboardHome />} />
          <Route path="/inventario" element={<InventoryPage />} />
          <Route path="/entradas" element={<EntriesPage />} />
          <Route path="/salidas" element={<ExitsPage />} />
          <Route path="/categorias" element={<CategoriesPage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/sucursales" element={<BranchesPage />} />
          <Route path="/administracion" element={<AdministrationPage />} />
          <Route path="/almacenes" element={<WarehousesPage />} />
          <Route path="/cuenta" element={<AccountPage />} />
        </Route>
        <Route path="*" element={<Navigate to={isSignedIn ? '/home' : '/'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;