import { EnvironmentalDataChart } from '@/components/environmental-data';

export default function HumidityPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">湿度データ</h1>
      <EnvironmentalDataChart dataType="hum" title="湿度の推移" color="rgb(53, 162, 235)" yAxisLabel="湿度 (%)" />
    </div>
  );
}