import React from 'react';
import { DollarSign, Flame, AlertTriangle, Skull, ShieldCheck, Briefcase, HelpCircle } from 'lucide-react';
import type { SimulatorInputs } from '../types/simulator';
import { ExpenseLeakManager } from './ExpenseLeakManager';

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
      {/* 1. 기본 투자 & 소득 계획 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-semibold text-slate-100 m-0">1. 기본 투자 & 소득 계획</h2>
          </div>
          <span className="text-[11px] text-slate-500 font-sans">1단계: 기본 체력 입력</span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-slate-400">
                초기 시드 머니 (현재 종잣돈)
              </label>
              <span className="text-xs font-mono font-bold text-emerald-400">
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
              className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500 mt-0.5">
              지금 당장 투자나 저축 계좌에 묶여 있는 시작 자금입니다.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-slate-400">매월 추가 저축/투자액</label>
              <span className="text-xs font-mono font-bold text-emerald-400">
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
              className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500 mt-0.5">
              숨만 쉬어도 나가는 필수 지출(월세/식비)을 제외하고 매달 남길 수 있는 금액입니다.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-slate-400">목표 기간</label>
                <span className="text-xs font-mono font-bold text-slate-200">{inputs.targetYears}년</span>
              </div>
              <input
                type="range"
                min="3"
                max="30"
                step="1"
                value={inputs.targetYears}
                onChange={(e) => updateField('targetYears', Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-slate-400">기대 연수익률</label>
                <span className="text-xs font-mono font-bold text-slate-200">{inputs.expectedAnnualReturn}%</span>
              </div>
              <input
                type="range"
                min="2"
                max="25"
                step="0.5"
                value={inputs.expectedAnnualReturn}
                onChange={(e) => updateField('expectedAnnualReturn', Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-slate-400">연봉/저축 인상</label>
                <span className="text-xs font-mono font-bold text-emerald-300">+{inputs.annualSavingsGrowthRate}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={inputs.annualSavingsGrowthRate}
                onChange={(e) => updateField('annualSavingsGrowthRate', Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* 친절한 직접 설명 박스 */}
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>
              <b>Tip:</b> 연봉/저축 인상률을 3%로 두면, 경력이 쌓이며 매년 저축액이 자연스럽게 늘어나는 현실적인 복리 모델이 완성됩니다.
            </span>
          </div>
        </div>
      </div>

      {/* 2. 돌발 수입 중단 (실직/이직 공백) 리얼리티 쇼크 */}
      <div className={`border rounded-xl p-5 shadow-lg transition-all ${
        inputs.enableIncomeShock ? 'bg-amber-950/20 border-amber-500/50' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Briefcase className={`w-5 h-5 ${inputs.enableIncomeShock ? 'text-amber-400' : 'text-slate-400'}`} />
            <div>
              <h2 className="text-base font-semibold text-slate-100 m-0">2. 수입 중단(실직/이직) 쇼크</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">갑자기 월급이 끊겼을 때의 현실 재현</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={inputs.enableIncomeShock}
              onChange={(e) => updateField('enableIncomeShock', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {inputs.enableIncomeShock ? (
          <div className="space-y-4 pt-1">
            {/* 직접적이고 명확한 원리 설명 */}
            <div className="text-xs text-amber-200/95 leading-relaxed bg-amber-950/40 p-3 rounded-lg border border-amber-500/30">
              <div className="font-bold mb-1 flex items-center gap-1.5 text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>왜 이 변수가 가장 치명적일까요?</span>
              </div>
              수입이 끊기면 저축이 0원이 되는 데 그치지 않고, <b>월세·식비 등 생존비용을 메우기 위해 주식/투자금을 가장 폭락한 바닥 가격에서 헐값에 강제 매도</b>하게 됩니다. 개인 투자자가 완주하지 못하는 가장 큰 현실적 이유입니다.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-slate-400">발생 시점</label>
                  <span className="text-xs font-mono font-bold text-amber-300">{inputs.incomeShockYear}년차</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={inputs.targetYears}
                  step="1"
                  value={Math.min(inputs.incomeShockYear, inputs.targetYears)}
                  onChange={(e) => updateField('incomeShockYear', Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-slate-400">무소득 기간</label>
                  <span className="text-xs font-mono font-bold text-amber-300">{inputs.incomeShockDurationMonths}개월 동안</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={inputs.incomeShockDurationMonths}
                  onChange={(e) => updateField('incomeShockDurationMonths', Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-slate-400">무소득 시 월 필수 생존 생활비</label>
                <span className="text-xs font-mono font-bold text-rose-400">{inputs.monthlySurvivalExpense} 만원/월 (자산에서 인출)</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={inputs.monthlySurvivalExpense}
                onChange={(e) => updateField('monthlySurvivalExpense', Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">
                월세, 관리비, 최소 식비 등 숨만 쉬어도 통장에서 무조건 빠져나가는 금액입니다.
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 m-0">
            스위치를 켜면 이직 공백이나 실직으로 인한 수입 중단 충격을 주입할 수 있습니다.
          </p>
        )}
      </div>

      {/* 3. 라이프스타일 누수 커스텀 매니저 */}
      <ExpenseLeakManager
        items={inputs.expenseLeaks}
        onChange={(newItems) => updateField('expenseLeaks', newItems)}
      />

      {/* 4. 폭락장 스트레스 시나리오 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500" />
            <div>
              <h2 className="text-base font-semibold text-slate-100 m-0">4. 시장 폭락 스트레스 모드</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">주식/코인 폭락장을 만났을 때의 시뮬레이션</p>
            </div>
          </div>
          <span className="text-[11px] text-slate-500 font-sans">스트레스 강도</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          <button
            type="button"
            onClick={() => updateField('marketCrashMode', 'none')}
            className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-all ${
              inputs.marketCrashMode === 'none'
                ? 'bg-slate-800 border-slate-500 ring-1 ring-slate-400'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <ShieldCheck className={`w-5 h-5 mt-0.5 ${inputs.marketCrashMode === 'none' ? 'text-emerald-400' : 'text-slate-500'}`} />
            <div>
              <div className="text-xs font-bold text-white">온실 속 화초 (평온한 장)</div>
              <div className="text-[11px] text-slate-400">급락 없이 매년 목표 수익률대로 곱게 오르는 비현실적 장밋빛 시나리오</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => updateField('marketCrashMode', 'moderate')}
            className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-all ${
              inputs.marketCrashMode === 'moderate'
                ? 'bg-rose-950/40 border-rose-500/80 ring-1 ring-rose-500'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <AlertTriangle className={`w-5 h-5 mt-0.5 ${inputs.marketCrashMode === 'moderate' ? 'text-amber-400' : 'text-slate-500'}`} />
            <div>
              <div className="text-xs font-bold text-amber-200">현실적 조정 (-28% 급락)</div>
              <div className="text-[11px] text-slate-400">시뮬레이션 중반부에 1회 -28% 급락장 내습 (일반적인 경제 주기)</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => updateField('marketCrashMode', 'blackswan')}
            className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-all ${
              inputs.marketCrashMode === 'blackswan'
                ? 'bg-rose-950/80 border-rose-500 ring-1 ring-rose-500'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Skull className={`w-5 h-5 mt-0.5 ${inputs.marketCrashMode === 'blackswan' ? 'text-rose-400' : 'text-slate-500'}`} />
            <div>
              <div className="text-xs font-bold text-rose-300">블랙스완 대공황 (-35% & -45% 연타)</div>
              <div className="text-[11px] text-slate-400">2008년 리먼 사태급 연쇄 폭락으로 내 자산과 멘탈의 극한을 시험</div>
            </div>
          </button>
        </div>

        {/* 직접 설명 박스 */}
        <div className="mt-3 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
          <span>
            <b>폭락장을 왜 미리 봐야 할까요?</b> 현실 투자에서는 계좌에 파란 불이 들어오는 순간 대부분 공포를 못 이기고 손절합니다. 최악의 폭락 잔고를 미리 눈으로 보고 마음의 준비를 해두는 것이 투자의 유일한 생존법입니다.
          </span>
        </div>
      </div>
    </div>
  );
};
