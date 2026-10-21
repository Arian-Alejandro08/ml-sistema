import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import ResourcePage from '../../shared/components/ResourcePage';

const columns = [{ key: 'setting', label: 'PREFERENCIA' }, { key: 'value', label: 'VALOR' }];
const API_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:3000';

function AccountPage() {
  const { updateUsuario } = useOutletContext();
  // 1. Estados para manejar los datos, la carga y el modo de edición
  const [usuario, setUsuario] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', correo: '' });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  // 2. Al abrir la página, buscamos la información fresca en la BD
  useEffect(() => {
    const fetchPerfil = async () => {
      const token = localStorage.getItem('token');
      if (!token) return; // Si no hay token, no hacemos nada

      try {
        const response = await fetch(`${API_URL}/api/auth/perfil`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}` // Enviamos el JWT como llave de acceso
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUsuario(data);
          setFormData({ nombre: data.nombre, correo: data.correo });
        }
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      }
    };

    fetchPerfil();
  }, []);

  // 3. Función para enviar los cambios a la base de datos
  const handleGuardarCambios = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setGuardando(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/perfil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData) // Enviamos el nuevo nombre y correo
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.mensaje || 'No se pudieron guardar los cambios.');
        return;
      }
      setUsuario(data.usuario); // Actualizamos la vista de la tabla
      updateUsuario(data.usuario);
      setModoEdicion(false);    // Ocultamos el formulario
    } catch {
      setError('No hay conexión con el servidor.');
    } finally {
      setGuardando(false);
    }
  };

  function abrirEdicion() {
    setFormData({ nombre: usuario.nombre, correo: usuario.correo });
    setError('');
    setModoEdicion(true);
  }

  if (!usuario) return <section className="resource-section"><p className="empty-state">Cargando información de la base de datos...</p></section>;

  // Preparamos las filas para tu ResourcePage
  const rows = [
    { setting: 'Nombre', value: usuario.nombre },
    { setting: 'Correo', value: usuario.correo },
    { setting: 'Rol', value: usuario.rol } // Agregamos el rol directamente de la BD
  ];

  if (!modoEdicion) {
    return (
      <ResourcePage
        title="Mi cuenta"
        description="Datos sincronizados desde Azure SQL."
        columns={columns}
        rows={rows}
        actions={<button type="button" className="primary-button" style={{ padding: '0 15px' }} onClick={abrirEdicion}>Editar mis datos</button>}
      />
    );
  }

  return (
    <section className="resource-section" aria-label="Editar perfil">
      <div className="resource-summary">
        <div><h2>Editar perfil</h2><p>Actualiza tu nombre y correo electrónico.</p></div>
      </div>
      <form className="panel form-card" onSubmit={handleGuardarCambios}>
        <div className="form-grid">
          <label className="form-field"><span>Nombre completo</span>
            <input value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
          </label>
          <label className="form-field"><span>Correo electrónico</span>
            <input type="email" value={formData.correo} onChange={(e) => setFormData({ ...formData, correo: e.target.value })} required />
          </label>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-actions">
          <button type="submit" className="primary-button" disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar cambios'}</button>
          <button type="button" className="secondary-button" onClick={() => setModoEdicion(false)} disabled={guardando}>Cancelar</button>
        </div>
      </form>
    </section>
  );
}

export default AccountPage;