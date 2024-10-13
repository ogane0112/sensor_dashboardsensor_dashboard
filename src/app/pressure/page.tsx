import { EnvironmentalDataChart } from '@/components/environmental-data';

export default function HumidityPage() {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl  font-bold mb-6 text-center lg:text-left">気圧データ</h1>
      <EnvironmentalDataChart dataType="pres" title="気圧の推移" color="rgb(75, 192, 192)" yAxisLabel="気圧 (hPa)" />
    </div>
  );
}