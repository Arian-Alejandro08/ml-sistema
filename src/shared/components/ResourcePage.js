import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';

function ResourcePage({ title, description, columns, rows = [], actions }) {
  const { search } = useOutletContext();
  const filteredRows = useMemo(
    () => rows.filter(row => Object.values(row).join(' ').toLowerCase().includes(search.toLowerCase())),
    [rows, search]
  );

  return (
    <section className="resource-section" aria-label={title}>
      <div className="resource-summary">
        <div><h2>{title}</h2><p>{description}</p></div>
        {actions ?? <span>{filteredRows.length} registros</span>}
      </div>
      <div className="panel inventory-panel">
        <div className="inventory-table-wrap"><table>
          <thead><tr>{columns.map(column => <th key={column.key}>{column.label}</th>)}</tr></thead>
          <tbody>{filteredRows.map((row, index) => <tr key={`${title}-${index}`}>{columns.map(column => <td key={column.key}>{row[column.key]}</td>)}</tr>)}</tbody>
        </table>{filteredRows.length === 0 && <p className="empty-state">No se encontraron registros.</p>}</div>
      </div>
    </section>
  );
}

export default ResourcePage;