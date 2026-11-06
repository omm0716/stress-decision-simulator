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
import { Term } from './Term';

interface ExpenseLeakManagerProps {
  items: ExpenseLeakItem[];
  onChange: (items: ExpenseLeakItem[]) => void;
}

const CATEGORY_STYLES: Record<ExpenseCategory, { label: string; badge: string }> = {
  subscription: { label: '정기 공납(구독)', badge: 'bg-[#2c1d30] text-[#dfa8e8] border-[#6e4678]' },
  habit: { label: '일상 증기누출', badge: 'bg-[#362415] text-[#f0cf85] border-[#8c6a32]' },
  emergency: { label: '돌발 파열', badge: 'bg-[#3b1814] text-[#ff9e8a] border-[#8f3d2f]' },
  custom: { label: '수기 기입', badge: 'bg-[#1a2b23] text-[#8cd4b5] border-[#456e5d]' },
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
    <div className="steam-panel p-5">
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#5c4524]">
        <div className="flex items-center gap-2.5">
          <Utensils className="w-5 h-5 text-[#f0cf85]" />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#c99738] block">
              VALVE NO. III — PIPE LEAKAGES
            </span>
            <h2 className="text-base font-bold text-[#f7e7ce] m-0">
              3. 라이프스타일 증기 누수 ({items.filter((i) => i.isActive).length}개 구멍)
            </h2>
          </div>
        </div>
        <div className="text-xs px-2.5 py-1 rounded bg-[#3b1814] text-[#ff9e8a] border border-[#8f3d2f] font-mono font-bold">
          월 -{totalMonthlyLeak.toFixed(1)}만원 누출
        </div>
      </div>

      {/* 양피지 설명 */}
      <div className="mb-4 parchment-note p-2.5 text-[11px] leading-relaxed">
        ⚙ <b>배관의 미세 균열이 무서운 이유:</b> 매월 4만원짜리 구독료는 1년에 48만원에 불과해 보이지만, 10년간 복리(연 8%) 압력으로 환산하면 <b>약 730만원의 미래 동력</b>을 허공에 날리는 것과 같습니다.
      </div>

      {/* 원클릭 프리셋 추가 버튼들 */}
      <div className="mb-4">
        <div className="text-[11px] text-[#bfa988] mb-2 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#f0cf85]" /> 빠른 누수 파이프 연결:
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => handleAddPreset('OTT·유튜브 구독', 'subscription', 'monthly', 1, 3.5, 0)}
            className="text-[11px] px-2.5 py-1 rounded bg-[#261c12] hover:bg-[#362819] text-[#f0cf85] border border-[#785a28] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Tv className="w-3 h-3" /> + OTT 구독 (월 3.5만)
          </button>
          <button
            type="button"
            onClick={() => handleAddPreset('게임 패스·과금', 'subscription', 'monthly', 1, 5, 20)}
            className="text-[11px] px-2.5 py-1 rounded bg-[#261c12] hover:bg-[#362819] text-[#f0cf85] border border-[#785a28] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Gamepad2 className="w-3 h-3" /> + 게임 과금 (월 5만)
          </button>
          <button
            type="button"
            onClick={() => handleAddPreset('심야 마차(택시)', 'habit', 'monthly', 3, 2, 25)}
            className="text-[11px] px-2.5 py-1 rounded bg-[#261c12] hover:bg-[#362819] text-[#f0cf85] border border-[#785a28] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Car className="w-3 h-3" /> + 심야 택시 (월 6만)
          </button>
          <button
            type="button"
            onClick={() => handleAddPreset('살롱 커피·다과', 'habit', 'monthly', 18, 0.5, 30)}
            className="text-[11px] px-2.5 py-1 rounded bg-[#261c12] hover:bg-[#362819] text-[#f0cf85] border border-[#785a28] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Coffee className="w-3 h-3" /> + 카페 커피 (월 9만)
          </button>
          <button
            type="button"
            onClick={() => handleAddPreset('선술집 & 연회', 'habit', 'monthly', 2, 6, 20)}
            className="text-[11px] px-2.5 py-1 rounded bg-[#261c12] hover:bg-[#362819] text-[#f0cf85] border border-[#785a28] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Beer className="w-3 h-3" /> + 술자리 (월 12만)
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-[11px] px-2.5 py-1 rounded brass-plaque hover:brightness-110 flex items-center gap-1 transition-all cursor-pointer font-semibold"
          >
            <Plus className="w-3 h-3" /> 수기 기입
          </button>
        </div>
      </div>

      {/* 직접 입력 폼 */}
      {showAddForm && (
        <form onSubmit={handleCustomAdd} className="bg-[#140f0c] p-3.5 rounded border border-[#9e7836] mb-4 space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-[#f0cf85]">
            <span>⚙ 신규 지출 누수 항목 장부 기입</span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-[#bfa988] hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[11px] text-[#bfa988] block mb-1">항목 명칭</label>
              <input
                type="text"
                placeholder="예: 골동품 수집, 의복 구매"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-[#1f1812] border border-[#5c4524] rounded px-2.5 py-1.5 text-[#f7e7ce]"
                required
              />
            </div>
            <div>
              <label className="text-[11px] text-[#bfa988] block mb-1">분류</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as ExpenseCategory)}
                className="w-full bg-[#1f1812] border border-[#5c4524] rounded px-2.5 py-1.5 text-[#f7e7ce]"
              >
                <option value="subscription">정기 공납(월정액)</option>
                <option value="habit">일상 증기누출(습관)</option>
                <option value="emergency">돌발 파열(경조사)</option>
                <option value="custom">수기 기입</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs">
            <div>
              <label className="text-[11px] text-[#bfa988] block mb-1">주기</label>
              <select
                value={newPeriod}
                onChange={(e) => setNewPeriod(e.target.value as 'monthly' | 'yearly')}
                className="w-full bg-[#1f1812] border border-[#5c4524] rounded px-2 py-1.5 text-[#f7e7ce]"
              >
                <option value="monthly">월간</option>
                <option value="yearly">연간</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-[#bfa988] block mb-1">횟수({newPeriod === 'monthly' ? '월' : '연'})</label>
              <input
                type="number"
                min="1"
                max="50"
                value={newFrequency}
                onChange={(e) => setNewFrequency(Number(e.target.value))}
                className="w-full bg-[#1f1812] border border-[#5c4524] rounded px-2 py-1.5 text-[#f7e7ce]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#bfa988] block mb-1">단가(만원)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="1000"
                value={newCostPerUnit}
                onChange={(e) => setNewCostPerUnit(Number(e.target.value))}
                className="w-full bg-[#1f1812] border border-[#5c4524] rounded px-2 py-1.5 text-[#f7e7ce]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#bfa988] block mb-1">방어율(%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="5"
                value={newDefenseRate}
                onChange={(e) => setNewDefenseRate(Number(e.target.value))}
                className="w-full bg-[#1f1812] border border-[#5c4524] rounded px-2 py-1.5 text-[#f7e7ce]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-1.5 rounded brass-plaque hover:brightness-110 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" /> 장부에 항목 추가
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
              className={`p-3 rounded border transition-all ${
                item.isActive
                  ? 'bg-[#1a140f]/90 border-[#5c4524]'
                  : 'bg-[#120e0b]/40 border-[#2e2214] opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="checkbox"
                    checked={item.isActive}
                    onChange={() => toggleItem(item.id)}
                    className="w-4 h-4 accent-[#d4af37] rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#f7e7ce]">{item.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border font-mono ${catInfo.badge}`}>
                    {catInfo.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#e05a47]">
                    {item.isActive ? `월 -${monthlyLeak.toFixed(1)}만원` : '밸브 잠김'}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-[#8c765a] hover:text-[#e05a47] transition-colors p-1 cursor-pointer"
                    title="항목 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {item.isActive && (
                <div className="space-y-1.5 pt-2 border-t border-[#3d2e1b] text-xs">
                  <div className="flex justify-between text-[11px] text-[#bfa988]">
                    <span>
                      기본 발생: {item.period === 'monthly' ? '월' : '연'} {item.frequency}회 × {item.costPerUnit}만원
                    </span>
                    <span className="text-[#e6d7be] font-mono flex items-center gap-1">
                      <Term
                        name="밸브 잠금(방어율)"
                        title="지출 밸브 잠금률 (절제율)"
                        description="배달이나 쇼핑 유혹이 왔을 때 밸브를 단단히 잠가 증기(현금) 누출을 막아낸 비율입니다."
                        analogy="10번 유혹 중 4번 밸브를 잠갔다면 방어율 40%"
                      />
                      : <b className={item.defenseRate >= 50 ? 'text-[#7ec8a3]' : 'text-[#f0cf85]'}>{item.defenseRate}%</b>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={item.defenseRate}
                    onChange={(e) => updateDefenseRate(item.id, Number(e.target.value))}
                    className="w-full cursor-pointer"
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
