import ResourcePage from '../../shared/components/ResourcePage';

const columns = [
  { key: 'product', label: 'PRODUCTO' }, { key: 'category', label: 'CATEGORÍA' },
  { key: 'weight', label: 'PRESENTACIÓN (KG)' }, { key: 'value', label: 'VALOR UNITARIO' },
];

function ProductsPage() {
  return <ResourcePage title="Catálogo de productos" description="Productos y presentaciones registradas." columns={columns} />;
}

export default ProductsPage;