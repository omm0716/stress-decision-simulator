import { useState, useMemo } from 'react';
import type {
  SimulatorInputs,
  EssentialExpenseItem,
  ExpenseLeakItem,
  IncomeShockEvent,
  CarPurchaseConfig,
  HomePurchaseConfig,
} from './types/simulator';
import { runStressSimulation } from './utils/engine';
import { Header } from './components/Header';
import { GuideBanner } from './components/GuideBanner';
import { InputPanel } from './components/InputPanel';
import { ChartPanel } from './components/ChartPanel';
import { MentalReportCard } from './components/MentalReportCard';
import { OpportunityCostCard } from './components/OpportunityCostCard';
import { YearlyDataTable } from './components/YearlyDataTable';

const DEFAULT_ESSENTIAL_EXPENSES: EssentialExpenseItem[] = [
  {
    id: 'ess-rent',
    name: '초년생 원룸 월세 & 관리비',
    category: 'rent',
    monthlyCost: 56,
    description: '보증금 제외 순수 월세 50만 + 공용관리비 6만 (초년생 자취 기준)',
    isActive: true,
  },
  {
    id: 'ess-mart',
    name: '마트 장보기 & 기본 식사(집밥)',
    category: 'groceries',
    monthlyCost: 35,
    description: '주 1~2회 마트 식자재 장보기(쌀·계란·고기·채소) 및 평일 점심 식대',
    isActive: true,
  },
  {
    id: 'ess-util',
    name: '공과금(전기·가스·수도) & 핸드폰 요금',
    category: 'utilities',
    monthlyCost: 15,
    description: '도시가스·전기·수도 평균 7만 + 통신비(핸드폰·인터넷) 8만',
    isActive: true,
  },
  {
    id: 'ess-nec',
    name: '최소 생필품(샤워·세제·휴지) & 대중교통',
    category: 'necessities',
    monthlyCost: 14,
    description: '샴푸·바디워시·치약·세제·휴지 등 생필품 6만 + 기후동행/K-패스 교통비 8만',
    isActive: true,
  },
];

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

const DEFAULT_CAR_PURCHASE: CarPurchaseConfig = {
  enabled: false,
  purchaseYear: 2,
  carPrice: 4800,
  downPayment: 1000,
  loanMonths: 60,
  loanRate: 5.5,
  monthlyMaintenance: 45,
  annualDepreciationRate: 15,
};

const DEFAULT_HOME_PURCHASE: HomePurchaseConfig = {
  enabled: false,
  purchaseYear: 4,
  homePrice: 65000,
  downPayment: 25000,
  mortgageYears: 30,
  mortgageRate: 4.2,
  annualAppreciationRate: 2.5,
};

const DEFAULT_INCOME_SHOCKS: IncomeShockEvent[] = [
  {
    id: 'shock-1',
    name: '1차 이직 공백',
    year: 3,
    durationMonths: 3,
    monthlySurvivalExpense: 150,
    isActive: true,
  },
  {
    id: 'shock-2',
    name: '구조조정/권고사직',
    year: 6,
    durationMonths: 4,
    monthlySurvivalExpense: 180,
    isActive: false,
  },
];

const DEFAULT_INPUTS: SimulatorInputs = {
  initialSeed: 1500,
  monthlyNetIncome: 240,
  monthlySavings: 120,
  essentialExpenses: DEFAULT_ESSENTIAL_EXPENSES,
  targetYears: 10,
  expectedAnnualReturn: 8,
  annualSavingsGrowthRate: 3,
  expenseLeaks: DEFAULT_EXPENSE_LEAKS,
  incomeShocks: DEFAULT_INCOME_SHOCKS,
  carPurchase: DEFAULT_CAR_PURCHASE,
  homePurchase: DEFAULT_HOME_PURCHASE,
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
    <div className="min-h-screen flex flex-col selection:bg-[#9e7836] selection:text-[#fff]">
      {/* 상단 황동 계기판 헤더 */}
      <Header onApplyPreset={handleApplyPreset} />

      {/* 메인 기관실 작업 영역 */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        {/* 상단 3단계 작동 교범 배너 */}
        <GuideBanner />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 좌측: 증기 밸브 & 압력 조절 패널 (5 cols) */}
          <section className="lg:col-span-5 space-y-6">
            <InputPanel inputs={inputs} onChange={setInputs} />
          </section>

          {/* 우측: 압력 기록계, 보일러 감정서, 기회비용 청구서, 복식부기 원장 (7 cols) */}
          <section className="lg:col-span-7 space-y-6">
            <ChartPanel result={result} />
            <MentalReportCard result={result} />
            <OpportunityCostCard result={result} />
            <YearlyDataTable result={result} />
          </section>
        </div>
      </main>

      {/* 하단 주철 명판 푸터 */}
      <footer className="border-t-2 border-[#5c4524] bg-[#110d0a] py-6 text-center text-xs text-[#9c8669]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
          <div>
            ⚙ IMPERIAL DECISION STRESS APPARATUS (EST. 1889) — 19세기 산업혁명 보일러 압력 &amp; 회계 원장 에디션
          </div>
          <div className="text-[11px] text-[#7a6852]">
            CAST-IRON &amp; BRASS MECHANICAL ENGINE • ZERO SERVER DEPENDENCY
          </div>
        </div>
      </footer>
    </div>
  );
}
