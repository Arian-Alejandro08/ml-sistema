import ResourcePage from '../../shared/components/ResourcePage';

const columns = [
  { key: 'name', label: 'ALMACÉN' }, { key: 'location', label: 'UBICACIÓN' },
  { key: 'capacity', label: 'CAPACIDAD' }, { key: 'status', label: 'ESTADO' },
];

function WarehousesPage() {
  return <ResourcePage title="Almacenes" description="Capacidad y estado de las ubicaciones de almacenamiento." columns={columns} />;
}

export default WarehousesPage;