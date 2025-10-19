import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDashboardMetrics } from '../services/api';
import Chart from 'react-apexcharts';

function DashboardPage() {
  const { projectId } = useParams();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true);
        const data = await getDashboardMetrics(projectId);
        setMetrics(data);
      } catch (err) {
        setError('Falha ao carregar métricas: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, [projectId]);

  if (loading) return <div className="text-center text-gray-700">Carregando dashboard...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!metrics) return <div className="text-center text-gray-700">Nenhum dado de dashboard disponível.</div>;

  const totalRequirements = metrics.total;

  const typeChartOptions = {
    chart: { type: 'pie' },
    labels: metrics.byType.map(item => item.type),
    colors: ['#4CAF50', '#2196F3'],
    title: { text: 'Requisitos por Tipo' }
  };
  const typeChartSeries = metrics.byType.map(item => item.count);

  const stepChartOptions = {
    chart: { type: 'bar' },
    xaxis: { categories: metrics.byStep.map(item => item.step) },
    colors: ['#FFC107'],
    title: { text: 'Requisitos por Passo do Processo' }
  };
  const stepChartSeries = [{ name: 'Contagem', data: metrics.byStep.map(item => item.count) }];

  const statusChartOptions = {
    chart: { type: 'donut' },
    labels: metrics.byStatus.map(item => item.status),
    colors: ['#9E9E9E', '#4CAF50', '#2196F3', '#FFEB3B', '#9C27B0'],
    title: { text: 'Requisitos por Status' }
  };
  const statusChartSeries = metrics.byStatus.map(item => item.count);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard do Projeto #{projectId}</h2>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6 text-center">
        <p className="text-xl font-semibold">Total de Requisitos: {totalRequirements}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <Chart options={typeChartOptions} series={typeChartSeries} type="pie" width="100%" />
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <Chart options={stepChartOptions} series={stepChartSeries} type="bar" height="350" />
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <Chart options={statusChartOptions} series={statusChartSeries} type="donut" width="100%" />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;