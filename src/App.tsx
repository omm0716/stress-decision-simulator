import { useState, useMemo } from 'react';
import type { SimulatorInputs, ExpenseLeakItem } from './types/simulator';
import { runStressSimulation } from './utils/engine';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { ChartPanel } from './components/ChartPanel';
import { MentalReportCard } from './components/MentalReportCard';
import { OpportunityCostCard } from './components/OpportunityCostCard';
import { YearlyDataTable } from './components/YearlyDataTable';

const DEFAULT_EXPENSE_LEAKS: ExpenseLeakItem[] = [
  {
    id: 'leak-delivery',
    name: '배달음식 & 야식',
    category: 'habit',
    period: 'monthly',
    frequency: 8,
    costPerUnit: 2.5,
    defenseRate: 40,
    isActive: true,
  },
  {
    id: 'leak-ott',
    name: 'OTT & 디지털 구독 (넷플/유튜브/쿠팡)',
    category: 'subscription',
    period: 'monthly',
    frequency: 1,
    costPerUnit: 3.5,
    defenseRate: 0,
    isActive: true,
  },
  {
    id: 'leak-coffee',
    name: '카페 & 테이크아웃 커피',
    category: 'habit',
    period: 'monthly',
    frequency: 16,
    costPerUnit: 0.5,
    defenseRate: 25,
    isActive: true,
  },
  {
    id: 'leak-game',
    name: '게임 월정액/패스/가챠',
    category: 'subscription',
    period: 'monthly',
    frequency: 1,
    costPerUnit: 5.0,
    defenseRate: 20,
    isActive: true,
  },
  {
    id: 'leak-taxi',
    name: '심야 택시 & 카카오T',
    category: 'habit',
    period: 'monthly',
    frequency: 2,
    costPerUnit: 2.5,
    defenseRate: 20,
    isActive: true,
  },
  {
    id: 'leak-emergency',
    name: '연간 경조사/명절/치과 돌발 지출',
    category: 'emergency',
    period: 'yearly',
    frequency: 2,
    costPerUnit: 50.0,
    defenseRate: 0,
    isActive: true,
  },
];

const DEFAULT_INPUTS: SimulatorInputs = {
  initialSeed: 1500, // 1500만원
  monthlySavings: 100, // 100만원
  targetYears: 10,
  expectedAnnualReturn: 8,
  annualSavingsGrowthRate: 3,

  // 현실 커스텀 지출 누수 목록
  expenseLeaks: DEFAULT_EXPENSE_LEAKS,

  // 수입 중단 리얼리티 쇼크 (3년차 4개월 실직)
  enableIncomeShock: true,
  incomeShockYear: 3,
  incomeShockDurationMonths: 4,
  monthlySurvivalExpense: 150,

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
      {/* 상단 네비게이션 & 프리셋 */}
      <Header onApplyPreset={handleApplyPreset} />

      {/* 메인 작업 영역 */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 좌측: 인풋 & 스트레스 설정 패널 (5 cols) */}
          <section className="lg:col-span-5 space-y-6">
            <InputPanel inputs={inputs} onChange={setInputs} />
          </section>

          {/* 우측: 차트, 멘탈 리포트, 기회비용, 연도별 상세 테이블 (7 cols) */}
          <section className="lg:col-span-7 space-y-6">
            <ChartPanel result={result} />
            <MentalReportCard result={result} />
            <OpportunityCostCard result={result} />
            <YearlyDataTable result={result} />
          </section>
        </div>
      </main>

      {/* 하단 푸터 */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            의사결정 스트레스 테스터 (Stress Decision Simulator) — 현실적 OTT·구독 누수 & 수입 중단 쇼크 모델링
          </div>
          <div className="text-[11px] text-slate-600">
            Client-Side Pure Single Page Application • Zero Maintenance
          </div>
        </div>
      </footer>
    </div>
  );
}
