import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export function DashboardView({ ficha, onSelectAprendiz }) {
  const meta = ficha?.meta || {};
  const aprendices = ficha?.aprendices || [];
  const juicios = ficha?.juicios || [];
  const competencias = ficha?.competencias || [];
  const raps = ficha?.resultadosAprendizaje || [];

  const totalAprendices = aprendices.length;
  const totalJuicios = juicios.length;
  const aprobados = juicios.filter(j => j.estadoJuicio === 'APROBADO').length;
  const pendientes = juicios.filter(j => j.estadoJuicio === 'POR EVALUAR').length;
  const porcentajeGlobal = totalJuicios > 0 ? ((aprobados / totalJuicios) * 100).toFixed(1) : 0;

  const estadosAprendiz = {};
  aprendices.forEach(a => {
    estadosAprendiz[a.estado] = (estadosAprendiz[a.estado] || 0) + 1;
  });

  const compStats = competencias.map(c => {
    const juiciosComp = juicios.filter(j => j.competenciaCodigo === c.codigo);
    const jAprobados = juiciosComp.filter(j => j.estadoJuicio === 'APROBADO').length;
    const total = juiciosComp.length;
    const pct = total > 0 ? (jAprobados / total) * 100 : 0;
    return {
      codigo: c.codigo,
      nombre: c.denominacion,
      aprobados: jAprobados,
      total,
      pct: Math.round(pct)
    };
  }).sort((a, b) => b.pct - a.pct);

  const funcStats = {};
  juicios.forEach(j => {
    const fName = j.funcionario && j.funcionario.trim() ? j.funcionario : 'Sin Asignar / En Proceso';
    if (!funcStats[fName]) {
      funcStats[fName] = { total: 0, aprobados: 0, pendientes: 0 };
    }
    funcStats[fName].total++;
    if (j.estadoJuicio === 'APROBADO') funcStats[fName].aprobados++;
    else funcStats[fName].pendientes++;
  });

  const doughnutData = {
    labels: ['Aprobados', 'Por Evaluar'],
    datasets: [
      {
        data: [aprobados, pendientes],
        backgroundColor: ['#10B981', '#F59E0B'],
        borderColor: ['#059669', '#D97706'],
        borderWidth: 1,
        hoverOffset: 4
      }
    ]
  };

  const barData = {
    labels: compStats.slice(0, 8).map(c => c.nombre.length > 28 ? c.nombre.substring(0, 26) + '...' : c.nombre),
    datasets: [
      {
        label: '% Aprobación',
        data: compStats.slice(0, 8).map(c => c.pct),
        backgroundColor: 'rgba(57, 169, 0, 0.8)',
        borderColor: '#39A900',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Aprobación: ${ctx.raw}%`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { callback: (val) => `${val}%` }
      },
      x: {
        ticks: { font: { size: 11 } }
      }
    }
  };

  return (
    <div className="dashboard-content">
      {/* Banner de Metadatos de la Ficha */}
      <div className="sena-card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-subtle) 100%)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-success">FICHA {meta.ficha}</span>
              <span className="badge badge-info">{meta.modalidad}</span>
              <span className="badge badge-neutral">Versión {meta.version}</span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>
              {meta.programa}
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginTop: '0.45rem', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              <span>{meta.centro || 'Centro de Formación SENA'}</span>
              <span>•</span>
              <span>Reporte: {meta.fechaReporte || 'N/A'}</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Avance General de la Ficha
            </div>
            <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1.1 }}>
              {porcentajeGlobal}%
            </div>
            <div className="progress-container" style={{ width: '180px', height: '7px', margin: '0.35rem 0' }}>
              <div className="progress-bar" style={{ width: `${porcentajeGlobal}%` }}></div>
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {aprobados} de {totalJuicios} juicios evaluados
            </span>
          </div>
        </div>
      </div>

      {/* Grid de KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-info">
            <div className="kpi-label">Aprendices Matriculados</div>
            <div className="kpi-value">{totalAprendices}</div>
            <div className="kpi-subtext">
              {estadosAprendiz['EN FORMACION'] || 0} en formación activa
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-info">
            <div className="kpi-label">Juicios Aprobados</div>
            <div className="kpi-value" style={{ color: '#10B981' }}>{aprobados.toLocaleString()}</div>
            <div className="kpi-subtext">Calificados satisfactoriamente</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-info">
            <div className="kpi-label">Juicios Por Evaluar</div>
            <div className="kpi-value" style={{ color: '#D97706' }}>{pendientes.toLocaleString()}</div>
            <div className="kpi-subtext">Pendientes por calificar</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-info">
            <div className="kpi-label">Estructura Curricular</div>
            <div className="kpi-value">
              {competencias.length} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {raps.length} RAPs</span>
            </div>
            <div className="kpi-subtext">Competencias y resultados</div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <div className="sena-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Aprobación por Competencia</h3>
              <p className="card-subtitle">Ranking de competencias con mayor porcentaje de avance</p>
            </div>
            <span className="badge badge-success">Top 8</span>
          </div>
          <div style={{ height: '270px' }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="sena-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Distribución de Evaluaciones & Estados</h3>
              <p className="card-subtitle">Relación de juicios calificados vs pendientes</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center', height: '270px' }}>
            <div style={{ height: '220px', position: 'relative' }}>
              <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom' } }
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700 }}>ESTADOS APRENDICES</div>
                {Object.entries(estadosAprendiz).map(([est, count]) => (
                  <div key={est} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem', fontSize: '0.84rem' }}>
                    <span style={{ fontWeight: 600 }}>{est}</span>
                    <span className="badge badge-neutral">{count}</span>
                  </div>
                ))}
              </div>

              <div style={{ padding: '0.75rem', background: 'rgba(57, 169, 0, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary-border)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: 700 }}>TASA DE APROBACIÓN</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>{porcentajeGlobal}%</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Total juicios auditados: {totalJuicios}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla con scroll vertical automático */}
      <div className="sena-card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Registro de Juicios por Funcionario / Instructor</h3>
            <p className="card-subtitle">Auditoría de quién evaluó y número de calificaciones registradas</p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="sena-table">
            <thead>
              <tr>
                <th>Funcionario / Instructor</th>
                <th>Total Juicios</th>
                <th>Aprobados</th>
                <th>Por Evaluar</th>
                <th>Tasa de Aprobación</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(funcStats).map(([funcionario, stats]) => {
                const pct = stats.total > 0 ? ((stats.aprobados / stats.total) * 100).toFixed(1) : 0;
                return (
                  <tr key={funcionario}>
                    <td><strong>{funcionario}</strong></td>
                    <td><span className="badge badge-neutral">{stats.total}</span></td>
                    <td><span className="badge badge-success">{stats.aprobados}</span></td>
                    <td><span className="badge badge-warning">{stats.pendientes}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="progress-container" style={{ width: '70px', height: '6px', margin: 0 }}>
                          <div className="progress-bar" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
