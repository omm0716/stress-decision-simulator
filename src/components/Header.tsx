import React from 'react';
import { Cog, Gauge, Flame } from 'lucide-react';
import type { SimulatorInputs } from '../types/simulator';

interface HeaderProps {
  onApplyPreset: (preset: Partial<SimulatorInputs>) => void;
}

export const Header: React.FC<HeaderProps> = ({ onApplyPreset }) => {
  return (
    <header className="border-b-2 border-[#785a28] bg-[#17120e]/95 backdrop-blur-md sticky top-0 z-30 shadow-2xl">
      {/* 상단 황동 각인 스트립 */}
      <div className="bg-gradient-to-r from-[#261c12] via-[#3d2d19] to-[#261c12] border-b border-[#5c4524] py-1 px-4 text-center">
        <span className="text-[10px] tracking-[0.22em] uppercase font-mono text-[#d4af37]/90">
          ⚙ IMPERIAL CAPITAL &amp; STEAM PRESSURE APPARATUS • EST. 1889 • PATENT NO. IV-889 ⚙
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3.5 md:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* 황동 기어 엠블럼 */}
          <div className="relative p-2.5 rounded brass-plaque flex items-center justify-center">
            <Cog className="w-7 h-7 text-[#f0cf85] animate-[spin_24s_linear_infinite]" />
            <Flame className="w-3.5 h-3.5 text-[#e0533c] absolute" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl md:text-2xl font-bold tracking-wide text-[#f7e7ce] m-0 drop-shadow">
                의사결정 스트레스 시험기
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded brass-plaque">
                1889 INDUSTRIAL EDITION
              </span>
            </div>
            <p className="text-xs text-[#bfa988] mt-0.5">
              장밋빛 행복회로 증기를 빼고, <span className="text-[#e05a47] font-semibold">최악의 보일러 폭발 압력(폭락·실직·생존비·대형지출)</span>과 <span className="text-[#f0cf85] font-semibold">멘탈 마지노선</span>을 계측합니다.
            </p>
          </div>
        </div>

        {/* 기계식 프리셋 레버 버튼 */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#d4af37] mr-1 flex items-center gap-1 font-mono">
            <Gauge className="w-3.5 h-3.5" /> 표준 계측 규격:
          </span>
          <button
            type="button"
            onClick={() =>
              onApplyPreset({
                initialSeed: 500,
                monthlyNetIncome: 220,
                monthlySavings: 100,
                essentialExpenses: [
                  {
                    id: 'ess-rent',
                    name: '초년생 원룸 월세 & 관리비',
                    category: 'rent',
                    monthlyCost: 55,
                    description: '보증금 제외 순수 월세 50만 + 관리비 5만',
                    isActive: true,
                  },
                  {
                    id: 'ess-mart',
                    name: '마트 장보기 & 기본 식사(집밥)',
                    category: 'groceries',
                    monthlyCost: 35,
                    description: '마트 식자재 장보기 및 평일 점심 식대',
                    isActive: true,
                  },
                  {
                    id: 'ess-util',
                    name: '공과금(전기·가스·수도) & 핸드폰 요금',
                    category: 'utilities',
                    monthlyCost: 15,
                    description: '전기·가스·수도 7만 + 핸드폰·인터넷 8만',
                    isActive: true,
                  },
                  {
                    id: 'ess-nec',
                    name: '최소 생필품(샤워·세제·휴지) & 대중교통',
                    category: 'necessities',
                    monthlyCost: 15,
                    description: '샴푸·바디워시·휴지 등 생필품 7만 + 대중교통 8만',
                    isActive: true,
                  },
                ],
                targetYears: 5,
                expectedAnnualReturn: 7,
                annualSavingsGrowthRate: 3,
                incomeShocks: [
                  {
                    id: 'shock-preset-1',
                    name: '1차 이직 공백',
                    year: 2,
                    durationMonths: 3,
                    monthlySurvivalExpense: 120,
                    isActive: true,
                  },
                ],
                carPurchase: {
                  enabled: true,
                  purchaseYear: 2,
                  carPrice: 2600,
                  downPayment: 500,
                  loanMonths: 60,
                  loanRate: 5.5,
                  monthlyMaintenance: 35,
                  annualDepreciationRate: 15,
                },
                homePurchase: {
                  enabled: false,
                  purchaseYear: 5,
                  homePrice: 35000,
                  downPayment: 14000,
                  mortgageYears: 30,
                  mortgageRate: 4.2,
                  annualAppreciationRate: 2.5,
                },
                marketCrashMode: 'moderate',
              })
            }
            className="text-xs px-3 py-1.5 rounded brass-plaque hover:brightness-110 transition-all cursor-pointer font-medium"
          >
            ⚙ 견습 기술자 (월급220·자취+아반떼)
          </button>
          <button
            type="button"
            onClick={() =>
              onApplyPreset({
                initialSeed: 3000,
                monthlyNetIncome: 350,
                monthlySavings: 190,
                essentialExpenses: [
                  {
                    id: 'ess-rent',
                    name: '오피스텔 월세 & 관리비',
                    category: 'rent',
                    monthlyCost: 75,
                    description: '역세권 오피스텔 월세 및 공용관리비',
                    isActive: true,
                  },
                  {
                    id: 'ess-mart',
                    name: '마트 장보기 & 기본 식사(집밥)',
                    category: 'groceries',
                    monthlyCost: 45,
                    description: '대형마트 장보기 및 직장인 점심 식대',
                    isActive: true,
                  },
                  {
                    id: 'ess-util',
                    name: '공과금(전기·가스·수도) & 핸드폰 요금',
                    category: 'utilities',
                    monthlyCost: 20,
                    description: '전기·냉난방·수도 10만 + 통신비 10만',
                    isActive: true,
                  },
                  {
                    id: 'ess-nec',
                    name: '최소 생필품(샤워·세제·휴지) & 대중교통',
                    category: 'necessities',
                    monthlyCost: 20,
                    description: '샤워·위생·세탁 생필품 및 교통비',
                    isActive: true,
                  },
                ],
                targetYears: 10,
                expectedAnnualReturn: 8,
                annualSavingsGrowthRate: 4,
                incomeShocks: [
                  {
                    id: 'shock-preset-2-1',
                    name: '1차 이직 공백',
                    year: 3,
                    durationMonths: 3,
                    monthlySurvivalExpense: 180,
                    isActive: true,
                  },
                  {
                    id: 'shock-preset-2-2',
                    name: '구조조정 권고사직',
                    year: 6,
                    durationMonths: 4,
                    monthlySurvivalExpense: 200,
                    isActive: true,
                  },
                ],
                carPurchase: {
                  enabled: true,
                  purchaseYear: 3,
                  carPrice: 4800,
                  downPayment: 1000,
                  loanMonths: 60,
                  loanRate: 5.5,
                  monthlyMaintenance: 45,
                  annualDepreciationRate: 15,
                },
                homePurchase: {
                  enabled: true,
                  purchaseYear: 5,
                  homePrice: 65000,
                  downPayment: 25000,
                  mortgageYears: 30,
                  mortgageRate: 4.2,
                  annualAppreciationRate: 2.5,
                },
                marketCrashMode: 'blackswan',
              })
            }
            className="text-xs px-3 py-1.5 rounded brass-plaque hover:brightness-110 transition-all cursor-pointer font-medium"
          >
            ⚙ 영끌 공장장 (월급350·그랜저+6.5억집)
          </button>
          <button
            type="button"
            onClick={() =>
              onApplyPreset({
                initialSeed: 10000,
                monthlyNetIncome: 480,
                monthlySavings: 385,
                essentialExpenses: [
                  {
                    id: 'ess-rent',
                    name: '본가 분담금 (월세 절감 모드)',
                    category: 'rent',
                    monthlyCost: 20,
                    description: '본가 거주로 주거비 극소화',
                    isActive: true,
                  },
                  {
                    id: 'ess-mart',
                    name: '마트 장보기 & 기본 식사(집밥)',
                    category: 'groceries',
                    monthlyCost: 45,
                    description: '건강식 장보기 및 식대',
                    isActive: true,
                  },
                  {
                    id: 'ess-util',
                    name: '공과금 & 알뜰폰 요금',
                    category: 'utilities',
                    monthlyCost: 12,
                    description: '알뜰폰 요금제 + 공과금 분담',
                    isActive: true,
                  },
                  {
                    id: 'ess-nec',
                    name: '최소 생필품(샤워·세제·휴지) & 대중교통',
                    category: 'necessities',
                    monthlyCost: 18,
                    description: '생필품 및 대중교통 정기권',
                    isActive: true,
                  },
                ],
                targetYears: 15,
                expectedAnnualReturn: 9,
                annualSavingsGrowthRate: 5,
                incomeShocks: [],
                carPurchase: {
                  enabled: false,
                  purchaseYear: 2,
                  carPrice: 2000,
                  downPayment: 500,
                  loanMonths: 60,
                  loanRate: 5.5,
                  monthlyMaintenance: 30,
                  annualDepreciationRate: 15,
                },
                homePurchase: {
                  enabled: false,
                  purchaseYear: 5,
                  homePrice: 60000,
                  downPayment: 20000,
                  mortgageYears: 30,
                  mortgageRate: 4.2,
                  annualAppreciationRate: 2.5,
                },
                marketCrashMode: 'blackswan',
              })
            }
            className="text-xs px-3 py-1.5 rounded brass-plaque hover:brightness-110 transition-all cursor-pointer font-medium"
          >
            ⚙ 대자본가 (무차량·절약 풀투자)
          </button>
        </div>
      </div>
    </header>
  );
};
