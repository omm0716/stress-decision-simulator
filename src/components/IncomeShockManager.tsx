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
    <div className="steam-panel p-5 space-y-4">
      <div className="flex items-center justify-between pb-2.5 border-b border-[#5c4524]">
        <div className="flex items-center gap-2.5">
          <Briefcase className="w-5 h-5 text-[#e59849]" />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#e59849] block">
              VALVE NO. II — FUEL INTERRUPTIONS
            </span>
            <h2 className="text-base font-bold text-[#f7e7ce] m-0">
              2.{' '}
              <Term
                name="수입 중단(실직/이직) 다중 쇼크"
                title="연료 공급 중단 (실직/이직 쇼크)"
                description="이직 공백이나 권고사직 등으로 월급(석탄 공급)이 끊겼을 때 저축 0원은 물론, 필수 생계비를 위해 자산을 바닥 가격에 헐값 매도하게 되는 현실적 위기입니다."
                analogy="석탄 공급이 끊긴 증기기관차가 객차의 목재를 뜯어 화실에 태우는 비상 상황"
              />
            </h2>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-[#2e1f12] text-[#f0cf85] border border-[#8c6a32] font-mono font-bold">
          {activeCount}개 위기 가동
        </span>
      </div>

      {/* 양피지 설명 */}
      <div className="parchment-note p-2.5 text-[11px] leading-relaxed flex items-start gap-2">
        <HelpCircle className="w-3.5 h-3.5 text-[#f0cf85] mt-0.5 flex-shrink-0" />
        <span>
          <b>살면서 실직이 한 번만 올까요?</b> 이직 공백, 구조조정, 번아웃 안식년 등 생애 주기 동안 연료 공급이 끊기는 구간은 여러 번 찾아옵니다. 아래에서 다중 위기를 자유롭게 추가해 보세요.
        </span>
      </div>

      {/* 빠른 프리셋 추가 버튼 */}
      <div>
        <div className="text-[11px] text-[#bfa988] mb-2 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#f0cf85]" /> 빠른 위기 주입 레버:
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => handleAddPreset('1차 이직 공백', 2, 3, 150)}
            className="text-[11px] px-2.5 py-1 rounded bg-[#261c12] hover:bg-[#362819] text-[#f0cf85] border border-[#785a28] transition-colors cursor-pointer"
          >
            + 2년차 이직 공백 (3개월)
          </button>
          <button
            type="button"
            onClick={() => handleAddPreset('구조조정/희망퇴직', 5, 5, 180)}
            className="text-[11px] px-2.5 py-1 rounded bg-[#2b1814] hover:bg-[#3d211b] text-[#ff9e8a] border border-[#8f3d2f] transition-colors cursor-pointer"
          >
            + 5년차 권고사직 (5개월)
          </button>
          <button
            type="button"
            onClick={() => handleAddPreset('번아웃 안식년/갭이어', 8, 6, 200)}
            className="text-[11px] px-2.5 py-1 rounded bg-[#1a2421] hover:bg-[#24332e] text-[#8cd4b5] border border-[#456e5d] transition-colors cursor-pointer"
          >
            + 8년차 안식년 (6개월)
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-[11px] px-2.5 py-1 rounded brass-plaque hover:brightness-110 flex items-center gap-1 transition-all cursor-pointer font-semibold"
          >
            <Plus className="w-3 h-3" /> 직접 기입
          </button>
        </div>
      </div>

      {/* 직접 입력 폼 */}
      {showAddForm && (
        <form onSubmit={handleCustomAdd} className="bg-[#140f0c] p-3.5 rounded border border-[#9e7836] space-y-3 text-xs">
          <div className="flex justify-between items-center font-bold text-[#f0cf85]">
            <span>⚙ 신규 수입 중단 위기 장부 기입</span>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-[#bfa988] hover:text-white cursor-pointer">✕</button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-[#bfa988] block mb-1">위기 명칭</label>
              <input
                type="text"
                placeholder="예: 2차 이직 준비, 공장 휴업"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-[#1f1812] border border-[#5c4524] rounded px-2.5 py-1.5 text-[#f7e7ce]"
                required
              />
            </div>
            <div>
              <label className="text-[11px] text-[#bfa988] block mb-1">발생 시점 (년차)</label>
              <input
                type="number"
                min="1"
                max={targetYears}
                value={newYear}
                onChange={(e) => setNewYear(Number(e.target.value))}
                className="w-full bg-[#1f1812] border border-[#5c4524] rounded px-2.5 py-1.5 text-[#f7e7ce]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-[#bfa988] block mb-1">중단 기간 (개월)</label>
              <input
                type="number"
                min="1"
                max="12"
                value={newMonths}
                onChange={(e) => setNewMonths(Number(e.target.value))}
                className="w-full bg-[#1f1812] border border-[#5c4524] rounded px-2.5 py-1.5 text-[#f7e7ce]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#bfa988] block mb-1">월 필수 생존비 (만원)</label>
              <input
                type="number"
                min="50"
                max="500"
                step="10"
                value={newExpense}
                onChange={(e) => setNewExpense(Number(e.target.value))}
                className="w-full bg-[#1f1812] border border-[#5c4524] rounded px-2.5 py-1.5 text-[#f7e7ce]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-1.5 rounded brass-plaque hover:brightness-110 font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" /> 장부에 위기 추가
          </button>
        </form>
      )}

      {/* 수입 중단 이벤트 목록 */}
      <div className="space-y-2.5">
        {shocks.length === 0 ? (
          <div className="text-center py-4 text-xs text-[#8c765a] bg-[#140f0c]/60 rounded border border-dashed border-[#4d3a1f]">
            등록된 수입 중단 위기가 없습니다. 위의 레버 버튼으로 위기를 추가해 보세요.
          </div>
        ) : (
          shocks.map((shock) => (
            <div
              key={shock.id}
              className={`p-3 rounded border transition-all ${
                shock.isActive
                  ? 'bg-[#261b12]/90 border-[#8c6a32]'
                  : 'bg-[#140f0c]/40 border-[#332616] opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={shock.isActive}
                    onChange={() => toggleShock(shock.id)}
                    className="w-4 h-4 accent-[#d4af37] rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#f7e7ce]">{shock.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#3a2a16] text-[#f0cf85] border border-[#785a28] font-mono">
                    {shock.year}년차
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#e05a47]">
                    {shock.isActive ? `${shock.durationMonths}개월 무소득 (-${shock.monthlySurvivalExpense}만/월)` : 'OFF'}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeShock(shock.id)}
                    className="text-[#8c765a] hover:text-[#e05a47] transition-colors p-1 cursor-pointer"
                    title="삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {shock.isActive && (
                <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-[#4d3a1f] text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-[#bfa988] mb-1">
                      <span>발생 시점</span>
                      <span className="font-mono text-[#f0cf85]">{shock.year}년차</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max={targetYears}
                      value={Math.min(shock.year, targetYears)}
                      onChange={(e) => updateField(shock.id, 'year', Number(e.target.value))}
                      className="w-full cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-[#bfa988] mb-1">
                      <span>중단 기간</span>
                      <span className="font-mono text-[#f0cf85]">{shock.durationMonths}개월</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      value={shock.durationMonths}
                      onChange={(e) => updateField(shock.id, 'durationMonths', Number(e.target.value))}
                      className="w-full cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-[#bfa988] mb-1">
                      <span>월 생존비용</span>
                      <span className="font-mono text-[#e05a47]">{shock.monthlySurvivalExpense}만원</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="500"
                      step="10"
                      value={shock.monthlySurvivalExpense}
                      onChange={(e) => updateField(shock.id, 'monthlySurvivalExpense', Number(e.target.value))}
                      className="w-full cursor-pointer"
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
