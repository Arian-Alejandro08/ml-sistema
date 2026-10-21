import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, '', '/');
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ token: 'test-token', usuario: { nombre: 'Ethan' } }),
  });
});

function signInWithToken() {
  localStorage.setItem('token', 'test-token');
}

test('signs in, navigates between pages and signs out', async () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'ethan@mail.com' } });
  fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'secreto' } });
  fireEvent.click(screen.getByRole('button', { name: /entrar al sistema/i }));
  expect(await screen.findByRole('heading', { name: /panel general/i })).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith(
    expect.stringContaining('/api/auth/login'),
    expect.objectContaining({ body: JSON.stringify({ correo: 'ethan@mail.com', contrasena: 'secreto' }) })
  );
  expect(localStorage.getItem('token')).toBe('test-token');
  expect(window.location.pathname).toBe('/home');
  expect(screen.getByText(/inventario total/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('link', { name: /inventario/i }));
  expect(window.location.pathname).toBe('/inventario');
  expect(screen.getByRole('heading', { name: /existencias actuales/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('link', { name: /entradas/i }));
  expect(window.location.pathname).toBe('/entradas');
  expect(screen.getByRole('heading', { name: /registro de entradas/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /cerrar sesión/i }));
  expect(window.location.pathname).toBe('/');
  expect(screen.getByRole('heading', { name: /bienvenido de nuevo/i })).toBeInTheDocument();
  expect(localStorage.getItem('token')).toBeNull();
});

test('shows the server message when credentials are rejected', async () => {
  global.fetch.mockResolvedValue({ ok: false, json: async () => ({ mensaje: 'Credenciales incorrectas' }) });
  render(<App />);
  fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'ethan@mail.com' } });
  fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'mal' } });
  fireEvent.click(screen.getByRole('button', { name: /entrar al sistema/i }));
  expect(await screen.findByText('Credenciales incorrectas')).toBeInTheDocument();
  expect(window.location.pathname).toBe('/');
});

test('shows a connection error when the server is unreachable', async () => {
  global.fetch.mockRejectedValue(new Error('network'));
  render(<App />);
  fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'ethan@mail.com' } });
  fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'secreto' } });
  fireEvent.click(screen.getByRole('button', { name: /entrar al sistema/i }));
  expect(await screen.findByRole('alert')).toHaveTextContent(/no hay conexión con el servidor/i);
});

test('shows a database alert and a spinner while a server error is pending', async () => {
  let respond;
  global.fetch.mockReturnValue(new Promise(resolve => { respond = resolve; }));
  render(<App />);
  fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: 'ethan@mail.com' } });
  fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'secreto' } });
  fireEvent.click(screen.getByRole('button', { name: /entrar al sistema/i }));

  const button = await screen.findByRole('button', { name: /entrando/i });
  expect(button).toBeDisabled();
  expect(button.querySelector('.spinner')).toBeInTheDocument();

  respond({ ok: false, status: 500, json: async () => ({}) });
  expect(await screen.findByRole('alert')).toHaveTextContent(/base de datos/i);
  expect(screen.getByRole('button', { name: /entrar al sistema/i })).toBeEnabled();
});

test('shows Administración in the menu only for a super admin', () => {
  signInWithToken();
  localStorage.setItem('usuario', JSON.stringify({ nombre: 'Ana', rol: 'Super Admin' }));
  window.history.replaceState({}, '', '/home');
  render(<App />);
  expect(screen.getByRole('link', { name: /administración/i })).toBeInTheDocument();
});

test('hides Administración from the menu for a gerente', () => {
  signInWithToken();
  localStorage.setItem('usuario', JSON.stringify({ nombre: 'Luis', rol: 'Gerente' }));
  window.history.replaceState({}, '', '/home');
  render(<App />);
  expect(screen.queryByRole('link', { name: /administración/i })).not.toBeInTheDocument();
});

test('redirects unauthenticated users from protected routes to login', () => {
  window.history.replaceState({}, '', '/inventario');
  render(<App />);
  expect(screen.getByRole('heading', { name: /bienvenido de nuevo/i })).toBeInTheDocument();
  expect(window.location.pathname).toBe('/');
});

test('opens the mobile menu and closes it after choosing a route', () => {
  const originalMatchMedia = window.matchMedia;
  window.matchMedia = jest.fn().mockReturnValue({ matches: true });
  signInWithToken();

  try {
    render(<App />);
    const menuButton = screen.getByRole('button', { name: /abrir menú/i });
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(screen.getByRole('link', { name: /inventario/i }));
    expect(window.location.pathname).toBe('/inventario');
    expect(screen.getByRole('button', { name: /abrir menú/i })).toHaveAttribute('aria-expanded', 'false');
  } finally {
    window.matchMedia = originalMatchMedia;
  }
});

test.each([
  ['/home', 'Panel general'],
  ['/inventario', 'Inventario'],
  ['/entradas', 'Entradas'],
  ['/salidas', 'Salidas'],
  ['/categorias', 'Categorías'],
  ['/productos', 'Productos'],
  ['/sucursales', 'Sucursales'],
  ['/administracion', 'Administración'],
  ['/almacenes', 'Almacenes'],
  ['/cuenta', 'Cuenta'],
])('renders route %s', (path, heading) => {
  signInWithToken();
  window.history.replaceState({}, '', path);
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
});