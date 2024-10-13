"use client"
import React, { useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HumidityPage(): React.ReactElement {
  const [humidityData, setHumidityData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('research')
        .select('timestamp,hum')
        .order('timestamp', { ascending: false })
        .limit(10);
    console.log(data)

      if (error) {
        console.error('Error fetching data:', error);
      } else if (data) {
        const sortedData = data.reverse();
        setHumidityData(sortedData.map(item => item.hum));
        setLabels(sortedData.map(item => item.timestamp));
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  const formatJapaneseTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const japaneseDate = new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC+9
    return japaneseDate.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  };

  const chartData: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: '湿度 (%)',
        data: humidityData,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.1,
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
        text: '湿度の推移',
        font: {
          size: 18,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        suggestedMin: Math.min(...humidityData) - 1,
        suggestedMax: Math.max(...humidityData) + 1,
      },
    },
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">湿度データ</h1>
      {loading ? (
        <div className="animate-pulse bg-gray-200 h-64 w-full rounded flex items-center justify-center">
          <p className="text-gray-500">データを読み込んでいます...</p>
        </div>
      ) : (
        <div className="h-64 md:h-96">
          <Line options={options} data={chartData} />
        </div>
      )}
    </div>
  );
}