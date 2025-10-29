import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { api } from '@/app/lib/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';

interface TrafficEntry {
  date: string;
  count: number;
}

interface Props {
  urlId: number;
}

export const TrafficStats: React.FC<Props> = ({ urlId }) => {
  const [trafficData, setTrafficData] = useState<TrafficEntry[]>([]);
  const [loadingTraffic, setLoadingTraffic] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTraffic = async () => {
      try {
        const res = await api.get<TrafficEntry[]>(`/api/urls/${urlId}/traffic`);
        const formatted = res.data.map((d) => ({
          date: new Date(d.date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
          }),
          count: d.count,
        }));
        setTrafficData(formatted);
      } catch (err) {
        setError('Erro ao buscar dados de tráfego');
      } finally {
        setLoadingTraffic(false);
      }
    };

    fetchTraffic();
  }, [urlId]);

  if (loadingTraffic) {
    return (
      <Box display="flex" justifyContent="center" mt={2}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Tráfego da URL
      </Typography>

      <Box mt={6} className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h6">Visitas Recentes</Typography>
          <Typography variant="body2" color="textSecondary">
            Últimos dias
          </Typography>
        </div>

        {trafficData.length === 0 ? (
          <Typography color="textSecondary">Sem dados de tráfego.</Typography>
        ) : (
          <Box height={300}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trafficData}
                margin={{ top: 10, right: 20, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar
                  dataKey="count"
                  radius={[6, 6, 0, 0]}
                  barSize={20}
                  fill="#3b82f6"
                >
                  {trafficData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? '#93c5fd' : '#3b82f6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Box>
    </Box>
  );
};
