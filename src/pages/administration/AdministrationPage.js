import React, { useState, useEffect, useCallback } from 'react';
import './administration.css';

const API_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:3000';
const USUARIO_VACIO = { nombre: '', correo: '', rol: '', estado: 'Activo', contrasena: '' };

function AdministracionPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [formData, setFormData] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const cargarUsuarios = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/api/auth/usuarios`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error("Error al cargar usuarios", error);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  function abrirNuevo() {
    setEditandoId(null);
    setFormData(USUARIO_VACIO);
    setError('');
  }

  function abrirEdicion(user) {
    setEditandoId(user.id_usuario);
    setFormData({ nombre: user.nombre, correo: user.correo, rol: user.rol, estado: user.estado, contrasena: '' });
    setError('');
  }

  function cerrarFormulario() {
    setFormData(null);
    setEditandoId(null);
    setError('');
  }

  async function guardarUsuario(event) {
    event.preventDefault();
    setGuardando(true);
    setError('');

    const editando = editandoId !== null;
    const body = { ...formData };
    if (!body.contrasena) delete body.contrasena;

    try {
      const response = await fetch(`${API_URL}/api/auth/usuarios${editando ? `/${editandoId}` : ''}`, {
        method: editando ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body)
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.mensaje || 'No se pudo guardar el usuario.');
        return;
      }
      cerrarFormulario();
      await cargarUsuarios();
    } catch {
      setError('No hay conexión con el servidor.');
    } finally {
      setGuardando(false);
    }
  }

  function cambiarCampo(campo) {
    return event => setFormData({ ...formData, [campo]: event.target.value });
  }

  return (
    <section className="resource-section" aria-label="Usuarios y permisos">
      <div className="resource-summary">
        <div><h2>Usuarios y permisos</h2><p>Accesos y roles de administración del sistema.</p></div>
        {!formData && <button type="button" className="primary-button" style={{ padding: '0 15px' }} onClick={abrirNuevo}>+ Agregar usuario</button>}
      </div>

      {formData && (
        <form className="panel form-card" onSubmit={guardarUsuario}>
          <h3>{editandoId === null ? 'Nuevo usuario' : 'Editar usuario'}</h3>
          <div className="form-grid">
            <label className="form-field"><span>Nombre</span>
              <input value={formData.nombre} onChange={cambiarCampo('nombre')} required />
            </label>
            <label className="form-field"><span>Correo</span>
              <input type="email" value={formData.correo} onChange={cambiarCampo('correo')} required />
            </label>
            <label className="form-field"><span>Rol</span>
              <input value={formData.rol} onChange={cambiarCampo('rol')} required />
            </label>
            <label className="form-field"><span>Estado</span>
              <select value={formData.estado} onChange={cambiarCampo('estado')}>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </label>
            <label className="form-field"><span>{editandoId === null ? 'Contraseña' : 'Nueva contraseña (opcional)'}</span>
              <input type="password" autoComplete="new-password" value={formData.contrasena} onChange={cambiarCampo('contrasena')} required={editandoId === null} />
            </label>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="primary-button" disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar'}</button>
            <button type="button" className="secondary-button" onClick={cerrarFormulario} disabled={guardando}>Cancelar</button>
          </div>
        </form>
      )}

      <div className="panel inventory-panel users-panel">
        <div className="inventory-table-wrap">
          <table>
            <thead>
              <tr><th>USUARIO</th><th>CORREO</th><th>ROL</th><th>ESTADO</th><th>ACCIONES</th></tr>
            </thead>
            <tbody>
              {usuarios.map(user => (
                <tr key={user.id_usuario}>
                  <td>{user.nombre}</td>
                  <td>{user.correo}</td>
                  <td>{user.rol}</td>
                  <td><span className="category-tag"><i className={`tag-dot ${user.estado === 'Activo' ? 'tag-dot--active' : 'tag-dot--inactive'}`} />{user.estado}</span></td>
                  <td><button type="button" className="secondary-button" onClick={() => abrirEdicion(user)}>Editar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {cargando && <p className="empty-state">Cargando lista de usuarios...</p>}
          {!cargando && usuarios.length === 0 && <p className="empty-state">No se encontraron registros.</p>}
        </div>
      </div>
    </section>
  );
}

export default AdministracionPage;