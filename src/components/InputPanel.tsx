import React from 'react';
import { DollarSign, Flame, Utensils, AlertTriangle, Skull, ShieldCheck } from 'lucide-react';
import type { SimulatorInputs } from '../types/simulator';

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

  // 월간 지출 누수액 계산 (미리보기용)
  const monthlyDeliveryLeak = inputs.deliveryFrequency * (1 - inputs.deliveryDefenseRate / 100) * inputs.deliveryCostPerTime;
  const monthlyEmergencyLeak = (inputs.annualEmergencyEvents * inputs.emergencyCostPerEvent) / 12;
  const totalLeakMonthly = Math.round(monthlyDeliveryLeak + monthlyEmergencyLeak);

  return (
    <div className="space-y-6">
      {/* 1. 기본 자산 목표 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800/80">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-semibold text-slate-100 m-0">1. 기본 투자 계획</h2>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-slate-400">초기 시드 머니</label>
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
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
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
          </div>
        </div>
      </div>

      {/* 2. 현실 라이프스타일 지출 누수 (Life Friction) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-semibold text-slate-100 m-0">2. 라이프스타일 누수 변수</h2>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
            월 -{totalLeakMonthly}만원 누수 중
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-slate-400">월 배달/충동 외식 유혹 횟수</label>
              <span className="text-xs font-mono font-bold text-amber-400">{inputs.deliveryFrequency} 회/월</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={inputs.deliveryFrequency}
              onChange={(e) => updateField('deliveryFrequency', Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-slate-400">배달 유혹 방어율 (참아낸 비율)</label>
              <span className={`text-xs font-mono font-bold ${inputs.deliveryDefenseRate >= 70 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {inputs.deliveryDefenseRate}% {inputs.deliveryDefenseRate <= 30 && '(위험: 거의 다 시킴)'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={inputs.deliveryDefenseRate}
              onChange={(e) => updateField('deliveryDefenseRate', Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-slate-400">연간 돌발 이벤트 (경조사/명절/병원비)</label>
              <span className="text-xs font-mono font-bold text-slate-200">연 {inputs.annualEmergencyEvents} 회 (회당 50만원)</span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="1"
              value={inputs.annualEmergencyEvents}
              onChange={(e) => updateField('annualEmergencyEvents', Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 3. 폭락장 스트레스 시나리오 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800/80">
          <Flame className="w-5 h-5 text-rose-500" />
          <h2 className="text-base font-semibold text-slate-100 m-0">3. 시장 폭락 스트레스 모드</h2>
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
              <div className="text-[11px] text-slate-400">급락 없이 꾸준히 복리 상승 (비현실적 장밋빛)</div>
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
              <div className="text-[11px] text-slate-400">시뮬레이션 중반부에 한 번 -28% 급락장 충격</div>
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
              <div className="text-[11px] text-slate-400">2008년 리먼 사태급 연쇄 폭락으로 멘탈 극한 시험</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
