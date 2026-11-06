import { useState, useMemo } from 'react';
import type { SimulatorInputs } from './types/simulator';
import { runStressSimulation } from './utils/engine';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { ChartPanel } from './components/ChartPanel';
import { MentalReportCard } from './components/MentalReportCard';
import { OpportunityCostCard } from './components/OpportunityCostCard';

const DEFAULT_INPUTS: SimulatorInputs = {
  initialSeed: 1500, // 1500만원
  monthlySavings: 100, // 100만원
  targetYears: 10,
  expectedAnnualReturn: 8,
  deliveryFrequency: 8,
  deliveryCostPerTime: 2.5,
  deliveryDefenseRate: 40,
  annualEmergencyEvents: 2,
  emergencyCostPerEvent: 50,
  marketCrashMode: 'moderate',
  inflationRate: 3,
};

export default function App() {
  const [inputs, setInputs] = useState<SimulatorInputs>(DEFAULT_INPUTS);

  const result = useMemo(() => {
    return runStressSimulation(inputs);
  }, [inputs]);

  const handleApplyPreset = (preset: Partial<SimulatorInputs>) => {
    setInputs((prev) => ({
      ...prev,
      ...preset,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* 고정 상단 네비게이션 & 프리셋 */}
      <Header onApplyPreset={handleApplyPreset} />

      {/* 메인 작업 영역 */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 좌측: 인풋 & 스트레스 설정 패널 (5 cols) */}
          <section className="lg:col-span-5 space-y-6">
            <InputPanel inputs={inputs} onChange={setInputs} />
          </section>

          {/* 우측: 차트 & 멘탈 리포트 & 기회비용 패널 (7 cols) */}
          <section className="lg:col-span-7 space-y-6">
            <ChartPanel result={result} />
            <MentalReportCard result={result} />
            <OpportunityCostCard inputs={inputs} result={result} />
          </section>
        </div>
      </main>

      {/* 하단 푸터 */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            의사결정 스트레스 테스터 (Stress Decision Simulator) — 내 기준에 맞춰 뾰족하게 설계된 사이드 프로젝트
          </div>
          <div className="text-[11px] text-slate-600">
            Client-Side Pure Single Page Application • No Server Required
          </div>
        </div>
      </footer>
    </div>
  );
}
