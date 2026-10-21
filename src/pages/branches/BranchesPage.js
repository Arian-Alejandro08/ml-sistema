import ResourcePage from '../../shared/components/ResourcePage';

const columns = [
  { key: 'name', label: 'SUCURSAL' }, { key: 'manager', label: 'RESPONSABLE' },
  { key: 'warehouse', label: 'ALMACÉN' }, { key: 'status', label: 'ESTADO' },
];

function BranchesPage() {
  return <ResourcePage title="Sucursales" description="Estado y responsables de cada punto de venta." columns={columns} />;
}

export default BranchesPage;