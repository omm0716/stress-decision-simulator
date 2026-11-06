import React, { useState } from 'react';
import {
  Utensils,
  Plus,
  Trash2,
  Tv,
  Gamepad2,
  Car,
  Coffee,
  Beer,
  Sparkles,
  Check,
} from 'lucide-react';
import type { ExpenseLeakItem, ExpenseCategory } from '../types/simulator';
import { calculateItemMonthlyLeak } from '../utils/engine';

interface ExpenseLeakManagerProps {
  items: ExpenseLeakItem[];
  onChange: (items: ExpenseLeakItem[]) => void;
}

const CATEGORY_STYLES: Record<ExpenseCategory, { label: string; badge: string }> = {
  subscription: { label: '월정액 구독', badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30' },
  habit: { label: '습관성 소비', badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
  emergency: { label: '돌발 지출', badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30' },
  custom: { label: '직접 입력', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
};

export const ExpenseLeakManager: React.FC<ExpenseLeakManagerProps> = ({ items, onChange }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<ExpenseCategory>('habit');
  const [newPeriod, setNewPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [newFrequency, setNewFrequency] = useState(4);
  const [newCostPerUnit, setNewCostPerUnit] = useState(2);
  const [newDefenseRate, setNewDefenseRate] = useState(30);

  const totalMonthlyLeak = items.reduce((acc, item) => acc + calculateItemMonthlyLeak(item), 0);

  const toggleItem = (id: string) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, isActive: !item.isActive } : item))
    );
  };

  const updateDefenseRate = (id: string, rate: number) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, defenseRate: rate } : item))
    );
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const handleAddPreset = (
    name: string,
    category: ExpenseCategory,
    period: 'monthly' | 'yearly',
    frequency: number,
    costPerUnit: number,
    defenseRate: number
  ) => {
    const newItem: ExpenseLeakItem = {
      id: `leak-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      category,
      period,
      frequency,
      costPerUnit,
      defenseRate,
      isActive: true,
    };
    onChange([...items, newItem]);
  };

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: ExpenseLeakItem = {
      id: `leak-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      period: newPeriod,
      frequency: Number(newFrequency),
      costPerUnit: Number(newCostPerUnit),
      defenseRate: Number(newDefenseRate),
      isActive: true,
    };
    onChange([...items, newItem]);
    setNewName('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Utensils className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-semibold text-slate-100 m-0">
            3. 라이프스타일 누수 커스텀 ({items.filter((i) => i.isActive).length}개 활성)
          </h2>
        </div>
        <div className="text-xs px-2.5 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30 font-mono font-bold">
          월 -{totalMonthlyLeak.toFixed(1)}만원 누수
        </div>
      </div>

      {/* 원클릭 프리셋 추가 버튼들 */}
      <div className="mb-4">
        <div className="text-[11px] text-slate-400 mb-2 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 빠른 추가 프리셋:
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => handleAddPreset('OTT·유튜브 구독', 'subscription', 'monthly', 1, 3.5, 0)}
            className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 flex items-center gap-1 transition-colors"
          >
            <Tv className="w-3 h-3" /> + OTT 구독 (월 3.5만)
          </button>
          <button
            type="button"
            onClick={() => handleAddPreset('게임 패스·과금', 'subscription', 'monthly', 1, 5, 20)}
            className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 flex items-center gap-1 transition-colors"
          >
            <Gamepad2 className="w-3 h-3" /> + 게임 과금 (월 5만)
          </button>
          <button
            type="button"
            onClick={() => handleAddPreset('심야 택시·카카오T', 'habit', 'monthly', 3, 2, 25)}
            className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 flex items-center gap-1 transition-colors"
          >
            <Car className="w-3 h-3" /> + 심야 택시 (월 6만)
          </button>
          <button
            type="button"
            onClick={() => handleAddPreset('카페·테이크아웃 커피', 'habit', 'monthly', 18, 0.5, 30)}
            className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 transition-colors"
          >
            <Coffee className="w-3 h-3" /> + 카페 커피 (월 9만)
          </button>
          <button
            type="button"
            onClick={() => handleAddPreset('술자리 & 회식 2차', 'habit', 'monthly', 2, 6, 20)}
            className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 flex items-center gap-1 transition-colors"
          >
            <Beer className="w-3 h-3" /> + 술자리 (월 12만)
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-[11px] px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" /> 직접 입력
          </button>
        </div>
      </div>

      {/* 직접 입력 폼 */}
      {showAddForm && (
        <form onSubmit={handleCustomAdd} className="bg-slate-950/70 p-3.5 rounded-lg border border-indigo-500/40 mb-4 space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold text-indigo-300">
            <span>새 지출 누수 항목 등록</span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">항목 이름</label>
              <input
                type="text"
                placeholder="예: 피규어 수집, 옷 쇼핑"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
                required
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">카테고리</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as ExpenseCategory)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white"
              >
                <option value="subscription">월정액 구독</option>
                <option value="habit">습관성 소비</option>
                <option value="emergency">돌발 지출</option>
                <option value="custom">직접 입력</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">주기</label>
              <select
                value={newPeriod}
                onChange={(e) => setNewPeriod(e.target.value as 'monthly' | 'yearly')}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white"
              >
                <option value="monthly">월간 (매월)</option>
                <option value="yearly">연간 (돌발)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">횟수 ({newPeriod === 'monthly' ? '월' : '연'})</label>
              <input
                type="number"
                min="1"
                max="50"
                value={newFrequency}
                onChange={(e) => setNewFrequency(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">금액(만원)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="1000"
                value={newCostPerUnit}
                onChange={(e) => setNewCostPerUnit(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">방어율(%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="5"
                value={newDefenseRate}
                onChange={(e) => setNewDefenseRate(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <Check className="w-3.5 h-3.5" /> 항목 추가하기
          </button>
        </form>
      )}

      {/* 누수 항목 목록 */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {items.map((item) => {
          const catInfo = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.custom;
          const monthlyLeak = calculateItemMonthlyLeak(item);

          return (
            <div
              key={item.id}
              className={`p-3 rounded-lg border transition-all ${
                item.isActive
                  ? 'bg-slate-950/70 border-slate-800'
                  : 'bg-slate-950/20 border-slate-900 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.isActive}
                    onChange={() => toggleItem(item.id)}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-200">{item.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${catInfo.badge}`}>
                    {catInfo.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-rose-400">
                    {item.isActive ? `월 -${monthlyLeak.toFixed(1)}만원` : 'OFF'}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    title="항목 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 세부 수치 및 방어율 슬라이더 */}
              {item.isActive && (
                <div className="space-y-1.5 pt-1 border-t border-slate-800/60 text-xs">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>
                      기본 발생: {item.period === 'monthly' ? '월' : '연'} {item.frequency}회 × {item.costPerUnit}만원
                    </span>
                    <span className="text-slate-300 font-mono">
                      방어율(참아낸 비율): <b className={item.defenseRate >= 50 ? 'text-emerald-400' : 'text-amber-400'}>{item.defenseRate}%</b>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={item.defenseRate}
                    onChange={(e) => updateDefenseRate(item.id, Number(e.target.value))}
                    className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded cursor-pointer"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
