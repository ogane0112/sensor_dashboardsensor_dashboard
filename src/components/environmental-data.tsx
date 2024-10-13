// @ts-nocheck
"use client"

import React, { useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  ScaleOptions,
  TooltipItem,
} from 'chart.js';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface EnvironmentalData {
  id: number;
  hum: number | null;
  tem: number | null;
  pres: number | null;
  timestamp: string;
}

interface ChartDataPoint {
  x: number;
  y: number | null;
}

type DataType = 'hum' | 'tem' | 'pres';

const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const createChartOptions = (title: string, yAxisLabel: string, xMin: number, xMax: number): ChartOptions<'line'> => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: title,
      font: {
        size: 18,
      },
    },
    tooltip: {
      callbacks: {
        title: (context: TooltipItem<'line'>[]) => {
          return `観察開始から ${context[0].parsed.x} 分経過`;
        },
      },
    },
  },
  scales: {
    x: {
      type: 'linear' as const,
      title: {
        display: true,
        text: '観察開始からの経過時間 (分)',
      },
      ticks: {
        callback: (value: number | string) => `${value}分`,
      },
      min: xMin,
      max: xMax,
    } as ScaleOptions<'linear'>,
    y: {
      beginAtZero: false,
      title: {
        display: true,
        text: yAxisLabel,
      },
    } as ScaleOptions<'linear'>,
  },
});

export function EnvironmentalDataChart({ dataType, title, color, yAxisLabel }: { dataType: DataType, title: string, color: string, yAxisLabel: string }) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [xMin, setXMin] = useState<number>(0);
  const [xMax, setXMax] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('research')
        .select(`id,${dataType}`)
        .order('id', { ascending: false })
        .limit(30);

      if (error) {
        console.error(`Error fetching ${dataType} data:`, error);
      } else if (data) {
        const chartData: ChartDataPoint[] = data.map(item => ({
          x: item.id * 5,
          y: item[dataType] as number | null,
        }));
        const xValues = chartData.map(point => point.x);
        setXMin(Math.min(...xValues));
        setXMax(Math.max(...xValues));
        setChartData(chartData);
      }
      setLoading(false);
    }

    fetchData();
  }, [dataType]);

  const lineChartData: ChartData<'line'> = {
    datasets: [
      {
        label: title,
        data: chartData,
        borderColor: color,
        backgroundColor: color.replace(')', ', 0.5)').replace('rgb', 'rgba'),
        tension: 0.1,
      },
    ],
  };

  const options = createChartOptions(title, yAxisLabel, xMin, xMax);

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {loading ? (
        <div className="animate-pulse bg-gray-200 h-64 w-full rounded flex items-center justify-center">
          <p className="text-gray-500">データを読み込んでいます...</p>
        </div>
      ) : (
        <div className="h-64">
          <Line options={options} data={lineChartData} />
        </div>
      )}
      <p className="text-sm text-gray-500 mt-2 text-right">※ 右端が最新のデータを示しています</p>
    </div>
  );
}

export function CombinedEnvironmentalData() {
  const [data, setData] = useState<EnvironmentalData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [xMin, setXMin] = useState<number>(0);
  const [xMax, setXMax] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('research')
        .select('id,pres,tem,hum')
        .order('id', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Error fetching combined data:', error);
      } else if (data) {
        const xValues = data.map(item => item.id * 5);
        setXMin(Math.min(...xValues));
        setXMax(Math.max(...xValues));
        setData(data as EnvironmentalData[]);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  const chartData: ChartData<'line'> = {
    datasets: [
      {
        label: '湿度 (%)',
        data: data.map(item => ({ x: item.id * 5, y: item.hum })),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y1',
      },
      {
        label: '気温 (°C)',
        data: data.map(item => ({ x: item.id * 5, y: item.tem })),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y1',
      },
      {
        label: '気圧 (hPa)',
        data: data.map(item => ({ x: item.id * 5, y: item.pres })),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        yAxisID: 'y2',
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '研究室内環境データの推移',
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          title: (context: TooltipItem<'line'>[]) => {
            return `観察開始から ${context[0].parsed.x} 分経過`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'linear' as const,
        title: {
          display: true,
          text: '観察開始からの経過時間 (分)',
        },
        ticks: {
          callback: (value: number | string) => `${value}分`,
        },
        min: xMin,
        max: xMax,
      } as ScaleOptions<'linear'>,
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: '湿度 (%) / 気温 (°C)',
        },
      } as ScaleOptions<'linear'>,
      y2: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: '気圧 (hPa)',
        },
        grid: {
          drawOnChartArea: false,
        },
      } as ScaleOptions<'linear'>,
    },
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">環境データ総合</h2>
      {loading ? (
        <div className="animate-pulse bg-gray-200 h-96 w-full rounded flex items-center justify-center">
          <p className="text-gray-500">データを読み込んでいます...</p>
        </div>
      ) : (
        <div className="h-96">
          <Line options={options} data={chartData} />
        </div>
      )}
      <p className="text-sm text-gray-500 mt-2 text-right">※ 右端が最新のデータを示しています</p>
    </div>
  );
}

export default function EnvironmentalDashboard() {
  return (
    <div className="space-y-8">
      <CombinedEnvironmentalData />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <EnvironmentalDataChart dataType="hum" title="湿度の推移" color="rgb(53, 162, 235)" yAxisLabel="湿度 (%)" />
        <EnvironmentalDataChart dataType="tem" title="気温の推移" color="rgb(255, 99, 132)" yAxisLabel="気温 (°C)" />
        <EnvironmentalDataChart dataType="pres" title="気圧の推移" color="rgb(75, 192, 192)" yAxisLabel="気圧 (hPa)" />
      </div>
    </div>
  );
}
//何故か危険扱いされる


