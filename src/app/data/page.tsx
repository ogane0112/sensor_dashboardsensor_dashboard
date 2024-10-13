import { CombinedEnvironmentalData, EnvironmentalDataChart } from '@/components/environmental-data';

export default function EnvironmentalDashboard() {
    return (
      <div className="space-y-8 ml-10">
        <CombinedEnvironmentalData />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <EnvironmentalDataChart dataType="hum" title="湿度の推移" color="rgb(53, 162, 235)" yAxisLabel="湿度 (%)" />
          <EnvironmentalDataChart dataType="tem" title="気温の推移" color="rgb(255, 99, 132)" yAxisLabel="気温 (°C)" />
          <EnvironmentalDataChart dataType="pres" title="気圧の推移" color="rgb(75, 192, 192)" yAxisLabel="気圧 (hPa)" />
        </div>
      </div>
    );
  }