import React from 'react';
import { ShieldAlert, Zap } from 'lucide-react';
import type { SimulatorInputs } from '../types/simulator';

interface HeaderProps {
  onApplyPreset: (preset: Partial<SimulatorInputs>) => void;
}

export const Header: React.FC<HeaderProps> = ({ onApplyPreset }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-4 py-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white m-0">
                  의사결정 스트레스 테스터
                </h1>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Stress Decision Sim v1.0
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                행복회로를 끄고, <span className="text-rose-400 font-medium">최악의 폭락장</span>과 <span className="text-amber-400 font-medium">멘탈 마지노선</span>을 시뮬레이션합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 프리셋 빠른 선택 */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> 프리셋:
          </span>
          <button
            onClick={() =>
              onApplyPreset({
                initialSeed: 500,
                monthlySavings: 70,
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
            className="text-xs px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            사회초년생 (시드 500+아반떼)
          </button>
          <button
            onClick={() =>
              onApplyPreset({
                initialSeed: 3000,
                monthlySavings: 150,
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
            className="text-xs px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            영끌 직장인 (그랜저+수도권 6.5억)
          </button>
          <button
            onClick={() =>
              onApplyPreset({
                initialSeed: 10000,
                monthlySavings: 300,
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
            className="text-xs px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            파이어족 도전 (무차량·무대출 풀투자)
          </button>
        </div>
      </div>
    </header>
  );
};
