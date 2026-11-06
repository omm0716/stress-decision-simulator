import React, { useState } from 'react';
import { Briefcase, Plus, Trash2, Sparkles, Check, HelpCircle } from 'lucide-react';
import type { IncomeShockEvent } from '../types/simulator';
import { Term } from './Term';

interface IncomeShockManagerProps {
  shocks: IncomeShockEvent[];
  targetYears: number;
  onChange: (shocks: IncomeShockEvent[]) => void;
}

export const IncomeShockManager: React.FC<IncomeShockManagerProps> = ({
  shocks,
  targetYears,
  onChange,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newYear, setNewYear] = useState(3);
  const [newMonths, setNewMonths] = useState(4);
  const [newExpense, setNewExpense] = useState(150);

  const activeCount = shocks.filter((s) => s.isActive).length;

  const toggleShock = (id: string) => {
    onChange(
      shocks.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  const updateField = <K extends keyof IncomeShockEvent>(
    id: string,
    field: K,
    val: IncomeShockEvent[K]
  ) => {
    onChange(
      shocks.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  const removeShock = (id: string) => {
    onChange(shocks.filter((s) => s.id !== id));
  };

  const handleAddPreset = (
    name: string,
    year: number,
    durationMonths: number,
    monthlySurvivalExpense: number
  ) => {
    const newShock: IncomeShockEvent = {
      id: `shock-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      year: Math.min(year, targetYears),
      durationMonths,
      monthlySurvivalExpense,
      isActive: true,
    };
    onChange([...shocks, newShock]);
  };

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newShock: IncomeShockEvent = {
      id: `shock-${Date.now()}`,
      name: newName.trim(),
      year: Math.min(newYear, targetYears),
      durationMonths: Number(newMonths),
      monthlySurvivalExpense: Number(newExpense),
      isActive: true,
    };
    onChange([...shocks, newShock]);
    setNewName('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-base font-semibold text-slate-100 m-0">
              2.{' '}
              <Term
                name="수입 중단(실직/이직) 다중 쇼크"
                title="수입 중단 다중 쇼크"
                description="이직 공백이나 권고사직 등으로 월급이 끊겼을 때 저축 0원은 물론, 필수 생활비를 위해 주식을 바닥 가격에 헐값 매도하게 되는 현실적 위기입니다."
                analogy="엔진이 꺼진 비행기가 비상 활주로를 찾을 때까지 고도를 잃는 상황"
              />
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              10~20년 동안 2~3회 찾아올 수 있는 현실적 소득 절벽 시뮬레이션
            </p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono font-bold">
          {activeCount}개 위기 활성
        </span>
      </div>

      {/* 직접 설명 박스 */}
      <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
        <HelpCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
        <span>
          <b>살면서 실직이 한 번만 올까요?</b> 이직 공백, 권고사직, 번아웃 안식년 등 커리어 동안 수입이 뚝 끊기는 구간은 여러 번 발생합니다. 아래에서 자유롭게 위기 이벤트를 추가해 보세요.
        </span>
      </div>

      {/* 빠른 프리셋 추가 버튼 */}
      <div>
        <div className="text-[11px] text-slate-400 mb-2 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 빠른 추가 프리셋:
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => handleAddPreset('1차 이직 공백', 2, 3, 150)}
            className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition-colors"
          >
            + 2년차 이직 공백 (3개월)
          </button>
          <button
            type="button"
            onClick={() => handleAddPreset('구조조정/희망퇴직', 5, 5, 180)}
            className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 transition-colors"
          >
            + 5년차 권고사직 (5개월)
          </button>
          <button
            type="button"
            onClick={() => handleAddPreset('번아웃 안식년/갭이어', 8, 6, 200)}
            className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 transition-colors"
          >
            + 8년차 안식년 (6개월)
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-[11px] px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" /> 직접 추가
          </button>
        </div>
      </div>

      {/* 직접 입력 폼 */}
      {showAddForm && (
        <form onSubmit={handleCustomAdd} className="bg-slate-950/70 p-3.5 rounded-lg border border-indigo-500/40 space-y-3 text-xs">
          <div className="flex justify-between items-center font-semibold text-indigo-300">
            <span>새 실직/수입 중단 위기 추가</span>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">위기 이름</label>
              <input
                type="text"
                placeholder="예: 2차 이직 준비, 스타트업 폐업"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                required
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">발생 시점 (년차)</label>
              <input
                type="number"
                min="1"
                max={targetYears}
                value={newYear}
                onChange={(e) => setNewYear(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">중단 기간 (개월)</label>
              <input
                type="number"
                min="1"
                max="12"
                value={newMonths}
                onChange={(e) => setNewMonths(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">월 필수 생활비 (만원, 자산 인출)</label>
              <input
                type="number"
                min="50"
                max="500"
                step="10"
                value={newExpense}
                onChange={(e) => setNewExpense(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <Check className="w-3.5 h-3.5" /> 위기 이벤트 등록
          </button>
        </form>
      )}

      {/* 수입 중단 이벤트 목록 */}
      <div className="space-y-2.5">
        {shocks.length === 0 ? (
          <div className="text-center py-4 text-xs text-slate-500 bg-slate-950/30 rounded border border-dashed border-slate-800">
            등록된 수입 중단 위기가 없습니다. 위의 프리셋 버튼으로 추가해 보세요.
          </div>
        ) : (
          shocks.map((shock) => (
            <div
              key={shock.id}
              className={`p-3 rounded-lg border transition-all ${
                shock.isActive
                  ? 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-slate-950/20 border-slate-900 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={shock.isActive}
                    onChange={() => toggleShock(shock.id)}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-200">{shock.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono">
                    {shock.year}년차
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-rose-400">
                    {shock.isActive ? `${shock.durationMonths}개월 무소득 (-${shock.monthlySurvivalExpense}만/월)` : 'OFF'}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeShock(shock.id)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    title="삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {shock.isActive && (
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/60 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                      <span>발생 시점</span>
                      <span className="font-mono text-amber-300">{shock.year}년차</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max={targetYears}
                      value={Math.min(shock.year, targetYears)}
                      onChange={(e) => updateField(shock.id, 'year', Number(e.target.value))}
                      className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                      <span>중단 기간</span>
                      <span className="font-mono text-amber-300">{shock.durationMonths}개월</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={shock.durationMonths}
                      onChange={(e) => updateField(shock.id, 'durationMonths', Number(e.target.value))}
                      className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                      <span>월 생존비용</span>
                      <span className="font-mono text-rose-400">{shock.monthlySurvivalExpense}만원</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="500"
                      step="10"
                      value={shock.monthlySurvivalExpense}
                      onChange={(e) => updateField(shock.id, 'monthlySurvivalExpense', Number(e.target.value))}
                      className="w-full accent-rose-500 bg-slate-800 h-1.5 rounded cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
