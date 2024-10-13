import { EnvironmentalDataChart } from '@/components/environmental-data';

export default function HumidityPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">気温データ</h1>
      <EnvironmentalDataChart dataType="tem" title="気温の推移" color="rgb(255, 99, 132)" yAxisLabel="気温 (°C)" />
    </div>
  );
}