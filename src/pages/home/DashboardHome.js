function DashboardHome() {
  return (
    <>
      <section className="metric-grid" aria-label="Indicadores de inventario">
        <article className="metric"><p>INVENTARIO TOTAL</p><strong>— <small>kg</small></strong></article>
        <article className="metric"><p>ENTRADAS DEL MES</p><strong>— <small>MXN</small></strong></article>
        <article className="metric"><p>SALIDAS DEL MES</p><strong>— <small>unid.</small></strong></article>
        <article className="metric"><p>SUCURSALES ACTIVAS</p><strong>—</strong></article>
      </section>

      <section className="analytics-grid">
        <article className="panel trend-panel">
          <div className="panel__heading"><h2>Entradas vs. Salidas</h2><span>toneladas · 6 meses</span></div>
          <p className="empty-state">Sin datos para mostrar.</p>
        </article>
        <article className="panel category-panel">
          <div className="panel__heading"><h2>Mezcla por categoría</h2></div>
          <p className="empty-state">Sin datos para mostrar.</p>
        </article>
      </section>

      <section className="panel inventory-panel" aria-label="Productos en inventario">
        <div className="inventory-table-wrap"><table>
          <thead><tr><th>PRODUCTO</th><th>CATEGORÍA</th><th>CANTIDAD</th><th>PESO (KG)</th><th>VALOR</th></tr></thead>
          <tbody />
        </table><p className="empty-state">No hay productos registrados.</p></div>
      </section>
    </>
  );
}

export default DashboardHome;