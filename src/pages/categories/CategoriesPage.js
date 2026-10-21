import ResourcePage from '../../shared/components/ResourcePage';

const columns = [{ key: 'name', label: 'CATEGORÍA' }, { key: 'amount', label: 'PRODUCTOS' }];

function CategoriesPage() {
  return <ResourcePage title="Categorías de producto" description="Clasificación de productos registrados en el sistema." columns={columns} />;
}

export default CategoriesPage;