import React from 'react';
import { Coins, Flame, AlertTriangle, Skull, ShieldCheck, HelpCircle } from 'lucide-react';
import type { SimulatorInputs } from '../types/simulator';
import { IncomeShockManager } from './IncomeShockManager';
import { ExpenseLeakManager } from './ExpenseLeakManager';
import { HeavyPurchasePanel } from './HeavyPurchasePanel';

interface InputPanelProps {
  inputs: SimulatorInputs;
  onChange: (inputs: SimulatorInputs) => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({ inputs, onChange }) => {
  const updateField = <K extends keyof SimulatorInputs>(key: K, value: SimulatorInputs[K]) => {
    onChange({
      ...inputs,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. 기본 자본 & 석탄 화력(소득) 계획 */}
      <div className="steam-panel p-5">
        <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#5c4524]">
          <div className="flex items-center gap-2.5">
            <Coins className="w-5 h-5 text-[#f0cf85]" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#c99738] block">
                VALVE NO. I — BASE CAPITAL
              </span>
              <h2 className="text-base font-bold text-[#f7e7ce] m-0">1. 기본 자본 &amp; 소득 계획</h2>
            </div>
          </div>
          <span className="text-[11px] text-[#bfa988] font-mono px-2 py-0.5 rounded bg-[#140f0c] border border-[#4d3a1f]">
            기초 화력
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-[#d8c7ad]">
                초기 시드 머니 (현재 종잣돈)
              </label>
              <span className="text-xs font-mono font-bold text-[#f0cf85]">
                {inputs.initialSeed.toLocaleString()} 만원
                {inputs.initialSeed >= 10000 && ` (${(inputs.initialSeed / 10000).toFixed(1)}억원)`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20000"
              step="100"
              value={inputs.initialSeed}
              onChange={(e) => updateField('initialSeed', Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <p className="text-[10px] text-[#9c8669] mt-1">
              지금 당장 증기 기관(투자 계좌)에 투입되어 있는 초기 자본금입니다.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-[#d8c7ad]">매월 추가 저축/투자액</label>
              <span className="text-xs font-mono font-bold text-[#f0cf85]">
                {inputs.monthlySavings.toLocaleString()} 만원/월
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={inputs.monthlySavings}
              onChange={(e) => updateField('monthlySavings', Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <p className="text-[10px] text-[#9c8669] mt-1">
              필수 생계비를 제외하고 매달 보일러에 추가로 넣을 수 있는 순수 연료입니다.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-[#d8c7ad]">가동 기간</label>
                <span className="text-xs font-mono font-bold text-[#f7e7ce]">{inputs.targetYears}년</span>
              </div>
              <input
                type="range"
                min="3"
                max="30"
                step="1"
                value={inputs.targetYears}
                onChange={(e) => updateField('targetYears', Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-[#d8c7ad]">목표 연수익률</label>
                <span className="text-xs font-mono font-bold text-[#f7e7ce]">{inputs.expectedAnnualReturn}%</span>
              </div>
              <input
                type="range"
                min="2"
                max="25"
                step="0.5"
                value={inputs.expectedAnnualReturn}
                onChange={(e) => updateField('expectedAnnualReturn', Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-[#d8c7ad]">연봉/저축 인상</label>
                <span className="text-xs font-mono font-bold text-[#7ec8a3]">+{inputs.annualSavingsGrowthRate}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={inputs.annualSavingsGrowthRate}
                onChange={(e) => updateField('annualSavingsGrowthRate', Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>
          </div>

          {/* 양피지 설명 박스 */}
          <div className="parchment-note p-2.5 text-[11px] leading-relaxed flex items-start gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#f0cf85] mt-0.5 flex-shrink-0" />
            <span>
              <b>기관사 지침:</b> 연봉/저축 인상률을 3%로 두면 숙련도가 쌓이며 매년 투입 연료량이 늘어나는 현실적 복리 모델이 완성됩니다.
            </span>
          </div>
        </div>
      </div>

      {/* 2. 다중 수입 중단 (실직/이직 공백) 리얼리티 쇼크 */}
      <IncomeShockManager
        shocks={inputs.incomeShocks}
        targetYears={inputs.targetYears}
        onChange={(newShocks) => updateField('incomeShocks', newShocks)}
      />

      {/* 3. 라이프스타일 누수 커스텀 매니저 */}
      <ExpenseLeakManager
        items={inputs.expenseLeaks}
        onChange={(newItems) => updateField('expenseLeaks', newItems)}
      />

      {/* 4. 극단적 대형 지름 스트레스 (차량 & 내 집 마련) */}
      <HeavyPurchasePanel
        car={inputs.carPurchase}
        home={inputs.homePurchase}
        targetYears={inputs.targetYears}
        onCarChange={(newCar) => updateField('carPurchase', newCar)}
        onHomeChange={(newHome) => updateField('homePurchase', newHome)}
      />

      {/* 5. 폭락장 스트레스 시나리오 */}
      <div className="steam-panel p-5">
        <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#5c4524]">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-[#e05a47]" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#e05a47] block">
                VALVE NO. V — PRESSURE SHOCK
              </span>
              <h2 className="text-base font-bold text-[#f7e7ce] m-0">5. 시장 폭락 압력 모드</h2>
            </div>
          </div>
          <span className="text-[11px] text-[#bfa988] font-mono px-2 py-0.5 rounded bg-[#140f0c] border border-[#4d3a1f]">
            보일러 부하
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          <button
            type="button"
            onClick={() => updateField('marketCrashMode', 'none')}
            className={`p-3 rounded border text-left flex items-start gap-3 transition-all cursor-pointer ${
              inputs.marketCrashMode === 'none'
                ? 'bg-[#2a2117] border-[#d4af37] ring-1 ring-[#d4af37]/60'
                : 'bg-[#140f0c]/80 border-[#4d3a1f] hover:border-[#785a28]'
            }`}
          >
            <ShieldCheck className={`w-5 h-5 mt-0.5 ${inputs.marketCrashMode === 'none' ? 'text-[#7ec8a3]' : 'text-[#7a6852]'}`} />
            <div>
              <div className="text-xs font-bold text-[#f7e7ce]">평온한 순항 (무풍 장밋빛)</div>
              <div className="text-[11px] text-[#bfa988]">압력 급락 없이 매년 목표 수익률대로 곱게 상승하는 비현실적 온실 시나리오</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => updateField('marketCrashMode', 'moderate')}
            className={`p-3 rounded border text-left flex items-start gap-3 transition-all cursor-pointer ${
              inputs.marketCrashMode === 'moderate'
                ? 'bg-[#362214] border-[#e59849] ring-1 ring-[#e59849]/60'
                : 'bg-[#140f0c]/80 border-[#4d3a1f] hover:border-[#785a28]'
            }`}
          >
            <AlertTriangle className={`w-5 h-5 mt-0.5 ${inputs.marketCrashMode === 'moderate' ? 'text-[#f0cf85]' : 'text-[#7a6852]'}`} />
            <div>
              <div className="text-xs font-bold text-[#f0cf85]">현실적 증기 역류 (-28% 급락)</div>
              <div className="text-[11px] text-[#bfa988]">운행 중반부에 1회 -28% 급락장 내습 (일반적인 산업 경기 순환 주기)</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => updateField('marketCrashMode', 'blackswan')}
            className={`p-3 rounded border text-left flex items-start gap-3 transition-all cursor-pointer ${
              inputs.marketCrashMode === 'blackswan'
                ? 'bg-[#3b1814] border-[#e05a47] ring-1 ring-[#e05a47]'
                : 'bg-[#140f0c]/80 border-[#4d3a1f] hover:border-[#785a28]'
            }`}
          >
            <Skull className={`w-5 h-5 mt-0.5 ${inputs.marketCrashMode === 'blackswan' ? 'text-[#e05a47]' : 'text-[#7a6852]'}`} />
            <div>
              <div className="text-xs font-bold text-[#f48fb1] text-[#ff8a75]">대공황 보일러 과열 (-35% &amp; -45% 연타)</div>
              <div className="text-[11px] text-[#bfa988]">1873년 장기불황·2008년 금융위기급 연쇄 폭락으로 자본과 멘탈의 한계를 시험</div>
            </div>
          </button>
        </div>

        <div className="mt-3 parchment-note p-2.5 text-[11px] leading-relaxed flex items-start gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-[#e05a47] mt-0.5 flex-shrink-0" />
          <span>
            <b>압력 시험을 왜 미리 해야 할까요?</b> 보일러 압력계가 붉은 구역으로 치솟을 때 공포에 질려 밸브를 포기(바닥 손절)하지 않으려면, 최악의 잔고를 미리 눈으로 목격해 두어야 합니다.
          </span>
        </div>
      </div>
    </div>
  );
};
