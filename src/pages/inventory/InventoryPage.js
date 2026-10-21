import ResourcePage from '../../shared/components/ResourcePage';

const columns = [
  { key: 'product', label: 'PRODUCTO' }, { key: 'category', label: 'CATEGORÍA' },
  { key: 'quantity', label: 'CANTIDAD' }, { key: 'weight', label: 'PESO (KG)' },
  { key: 'value', label: 'VALOR' },
];

function InventoryPage() {
  return <ResourcePage title="Existencias actuales" description="Consulta productos y cantidades disponibles." columns={columns} />;
}

export default InventoryPage;