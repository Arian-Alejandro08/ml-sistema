import { useState } from 'react';
import './login.css';

const API_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:3000';

function LoginPage({ onSignIn }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [notice, setNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setNotice(null);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena }),
      });
      const data = await response.json().catch(() => ({}));

      if (response.status >= 500) {
        setNotice({ type: 'error', text: 'No se pudo conectar con la base de datos. Intenta de nuevo en unos minutos.' });
        return;
      }
      if (!response.ok) {
        setNotice({ type: 'error', text: data.mensaje || 'Error al iniciar sesión' });
        return;
      }
      onSignIn(data);
    } catch {
      setNotice({ type: 'error', text: 'No hay conexión con el servidor. Revisa tu red e intenta de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="login-screen">
      <section className="login-story" aria-label="ML Grupo Comercial">
        <div className="brand brand--light">
          <span className="brand__mark">ML</span>
          <span className="brand__name">ML Grupo Comercial</span>
        </div>
        <div className="login-story__copy">
          <p className="eyebrow">ABASTECEDOR · CARNE · POLLO · PESCADO</p>
          <h1>Control total de tu inventario</h1>
        </div>
        <div className="login-story__stats">
          <div><strong>NO</strong><span>DATA</span></div>
          <div><strong>NO</strong><span>DATA</span></div>
          <div><strong>NO</strong><span>DATA</span></div>
        </div>
      </section>

      <section className="login-form-panel">
        <form className="login-form" onSubmit={handleSubmit}>
          <p className="eyebrow">INICIAR SESIÓN</p>
          <h2>Bienvenido de nuevo</h2>
          <p className="login-form__intro">Accede a tu panel de administración.</p>

          <label className="field-label" htmlFor="email">CORREO</label>
          <div className="input-wrap">
            <span aria-hidden="true">✉</span>
            <input id="email" type="email" value={correo} onChange={event => setCorreo(event.target.value)} autoComplete="username" required />
          </div>

          <label className="field-label" htmlFor="password">CONTRASEÑA</label>
          <div className="input-wrap">
            <span aria-hidden="true">♙</span>
            <input id="password" type="password" value={contrasena} onChange={event => setContrasena(event.target.value)} autoComplete="current-password" required />
          </div>

          <div className="login-form__options">
            <label className="remember"><input type="checkbox" defaultChecked /> <span>Recordarme</span></label>
            <button className="text-button" type="button" onClick={() => setNotice({ type: 'info', text: 'Contacta al administrador para restablecer tu contraseña.' })}>¿Olvidaste tu contraseña?</button>
          </div>
          {notice && <p className={`form-notice form-notice--${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>{notice.text}</p>}
          <button className="primary-button login-form__submit" type="submit" disabled={isLoading} aria-busy={isLoading}>
            {isLoading ? <><span className="spinner" aria-hidden="true" />Entrando...</> : 'Entrar al sistema'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;