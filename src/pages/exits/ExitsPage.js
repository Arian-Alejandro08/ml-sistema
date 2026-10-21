import ResourcePage from '../../shared/components/ResourcePage';

const columns = [
  { key: 'date', label: 'FECHA' }, { key: 'reference', label: 'REFERENCIA' },
  { key: 'branch', label: 'SUCURSAL' }, { key: 'items', label: 'PRODUCTOS' },
  { key: 'status', label: 'ESTADO' },
];

function ExitsPage() {
  return <ResourcePage title="Registro de salidas" description="Despachos recientes de inventario a sucursales." columns={columns} />;
}

export default ExitsPage;