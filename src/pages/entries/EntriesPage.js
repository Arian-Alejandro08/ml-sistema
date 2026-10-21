import ResourcePage from '../../shared/components/ResourcePage';

const columns = [
  { key: 'date', label: 'FECHA' }, { key: 'reference', label: 'REFERENCIA' },
  { key: 'warehouse', label: 'ALMACÉN' }, { key: 'items', label: 'PRODUCTOS' },
  { key: 'status', label: 'ESTADO' },
];

function EntriesPage() {
  return <ResourcePage title="Registro de entradas" description="Recepciones recientes de mercancía por almacén." columns={columns} />;
}

export default EntriesPage;