import React, { useState } from 'react';
import {
  Home,
  ShoppingCart,
  Zap,
  Droplets,
  Plus,
  Trash2,
  Check,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import type { EssentialExpenseItem, EssentialCategory } from '../types/simulator';
import { Term } from './Term';

interface EssentialLivingManagerProps {
  monthlyNetIncome: number;
  items: EssentialExpenseItem[];
  totalMonthlyLeak: number;
  onChange: (items: EssentialExpenseItem[]) => void;
}

const ESSENTIAL_BADGES: Record<EssentialCategory, { label: string; color: string }> = {
  rent: { label: '주거·월세', color: 'bg-[#2e2012] text-[#f0cf85] border-[#8c6a32]' },
  groceries: { label: '마트·식재료', color: 'bg-[#1a2b23] text-[#8cd4b5] border-[#456e5d]' },
  utilities: { label: '공과금·통신', color: 'bg-[#1b2430] text-[#9ec5eb] border-[#436180]' },
  necessities: { label: '생필품·위생·교통', color: 'bg-[#2c1d30] text-[#dfa8e8] border-[#6e4678]' },
  custom: { label: '필수 고정비', color: 'bg-[#362415] text-[#e6d7be] border-[#785a28]' },
};

export const EssentialLivingManager: React.FC<EssentialLivingManagerProps> = ({
  monthlyNetIncome,
  items,
  totalMonthlyLeak,
  onChange,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<EssentialCategory>('custom');
  const [newCost, setNewCost] = useState(10);

  const totalEssential = items.reduce((acc, i) => (i.isActive ? acc + i.monthlyCost : acc), 0);
  const baseSavingsCapacity = Math.max(0, monthlyNetIncome - totalEssential);
  const actualInvested = monthlyNetIncome - totalEssential - totalMonthlyLeak;

  const toggleItem = (id: string) => {
    onChange(items.map((item) => (item.id === id ? { ...item, isActive: !item.isActive } : item)));
  };

  const updateCost = (id: string, cost: number) => {
    onChange(items.map((item) => (item.id === id ? { ...item, monthlyCost: cost } : item)));
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const applyLivingPreset = (mode: 'solo-beginner' | 'parents-home' | 'independent-pro') => {
    if (mode === 'solo-beginner') {
      onChange([
        {
          id: 'ess-rent',
          name: '초년생 원룸 월세 & 관리비',
          category: 'rent',
          description: '보증금 제외 매달 나가는 원룸 월세(50만) + 공용 관리비(6만)',
          monthlyCost: 56,
          isActive: true,
        },
        {
          id: 'ess-mart',
          name: '마트 장보기 & 기본 식사(집밥)',
          category: 'groceries',
          description: '쌀, 생수, 라면, 계란, 반찬, 평일 점심 식대 등 최소 생존 식비',
          monthlyCost: 35,
          isActive: true,
        },
        {
          id: 'ess-util',
          name: '공과금(전기·가스·수도) & 핸드폰 요금',
          category: 'utilities',
          description: '도시가스, 전기세, 수도세(7만) + 핸드폰 통신비·인터넷(8만)',
          monthlyCost: 15,
          isActive: true,
        },
        {
          id: 'ess-nec',
          name: '최소 생필품(샤워·세제·휴지) & 대중교통',
          category: 'necessities',
          description: '샴푸, 바디워시, 치약, 휴지, 세제(7만) + 출퇴근 지하철·버스(7만)',
          monthlyCost: 14,
          isActive: true,
        },
      ]);
    } else if (mode === 'parents-home') {
      onChange([
        {
          id: 'ess-rent',
          name: '본가 생활비 각출 (주거비 절감)',
          category: 'rent',
          description: '월세 대신 부모님께 드리는 최소 생활비 또는 주거 분담금',
          monthlyCost: 25,
          isActive: true,
        },
        {
          id: 'ess-mart',
          name: '평일 점심 식대 & 간식 장보기',
          category: 'groceries',
          description: '집밥 외에 출근 시 사 먹는 점심 식사 및 개인 간식·생필 장보기',
          monthlyCost: 20,
          isActive: true,
        },
        {
          id: 'ess-util',
          name: '핸드폰 통신비 & 기본 요금',
          category: 'utilities',
          description: '스마트폰 통신 요금 및 개인 명의 공과금',
          monthlyCost: 7,
          isActive: true,
        },
        {
          id: 'ess-nec',
          name: '개인 위생용품(샤워·화장품) & 대중교통',
          category: 'necessities',
          description: '샴푸·바디워시·기초화장품 및 출퇴근 교통비(기후동행/K-패스)',
          monthlyCost: 12,
          isActive: true,
        },
      ]);
    } else {
      onChange([
        {
          id: 'ess-rent',
          name: '오피스텔 월세·전세대출 이자 & 관리비',
          category: 'rent',
          description: '직장인 투룸/오피스텔 주거비(60만) + 오피스텔 관리비(15만)',
          monthlyCost: 75,
          isActive: true,
        },
        {
          id: 'ess-mart',
          name: '마트 장보기(신선식품·정육) & 직장 식대',
          category: 'groceries',
          description: '주말 대형마트 장보기(생수·고기·과일·요리재료) 및 평일 식사',
          monthlyCost: 45,
          isActive: true,
        },
        {
          id: 'ess-util',
          name: '공과금(냉난방·전기·가스) & 통신·인터넷',
          category: 'utilities',
          description: '여름 에어컨·겨울 난방비 포함 공과금 및 핸드폰·기가인터넷',
          monthlyCost: 18,
          isActive: true,
        },
        {
          id: 'ess-nec',
          name: '생필품(샤워·세탁·위생) & 교통·실비보험',
          category: 'necessities',
          description: '욕실·세탁 생필품, 미용실, 대중교통, 기본 실손보험료',
          monthlyCost: 17,
          isActive: true,
        },
      ]);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const item: EssentialExpenseItem = {
      id: `ess-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      description: newDesc.trim() || '매월 고정적으로 지출되는 필수 생존 비용',
      monthlyCost: Number(newCost),
      isActive: true,
    };
    onChange([...items, item]);
    setNewName('');
    setNewDesc('');
    setShowAddForm(false);
  };

  return (
    <div className="steam-panel p-5 space-y-4">
      <div className="flex items-center justify-between pb-2.5 border-b border-[#5c4524]">
        <div className="flex items-center gap-2.5">
          <ShoppingCart className="w-5 h-5 text-[#7ec8a3]" />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#7ec8a3] block">
              VALVE NO. I-B — BASE SURVIVAL RATIONS &amp; RENT
            </span>
            <h2 className="text-base font-bold text-[#f7e7ce] m-0">
              1-2.{' '}
              <Term
                name="기초 생존 생활비 원장 (숨만 쉬어도 나가는 돈)"
                title="기초 생존 생활비 (Essential Living Cost)"
                description="사치나 유흥이 아니라, 월세·공과금·핸드폰 요금·마트 장보기·샤워용품 등 인간답게 생존하기 위해 매달 무조건 통장에서 빠져나가는 최소 고정비입니다."
                analogy="기관차가 움직이지 않고 정차해 있을 때도 보일러 불씨를 유지하기 위해 소모되는 최소한의 석탄"
              />
            </h2>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-[#182621] text-[#8cd4b5] border border-[#456e5d] font-mono font-bold">
          월 -{totalEssential}만원 고정
        </span>
      </div>

      {/* 월급 증발 파이프라인 (Paycheck Funnel) 시각화 */}
      <div className="bg-[#120e0b] p-3.5 rounded border-2 border-[#6b5129] space-y-2.5">
        <div className="text-xs font-bold text-[#f0cf85] flex items-center justify-between border-b border-[#3d2e1b] pb-1.5">
          <span>⚙ 내 월급 실수령액 증발 파이프라인 (1개월 기준)</span>
          <span className="font-mono text-[11px] text-[#bfa988]">실수령 {monthlyNetIncome}만원 중</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-xs">
          <div className="p-2 rounded bg-[#1f1812] border border-[#4d3a1f]">
            <div className="text-[10px] text-[#bfa988] font-sans">① 세후 월급</div>
            <div className="font-bold text-[#f7e7ce] mt-0.5">{monthlyNetIncome}만</div>
          </div>
          <div className="p-2 rounded bg-[#182621] border border-[#3e6b58]">
            <div className="text-[10px] text-[#8cd4b5] font-sans">② 기초생활비</div>
            <div className="font-bold text-[#8cd4b5] mt-0.5">-{totalEssential}만</div>
          </div>
          <div className="p-2 rounded bg-[#361e12] border border-[#8c6a32]">
            <div className="text-[10px] text-[#f0cf85] font-sans">③ 사치·구독누수</div>
            <div className="font-bold text-[#f0cf85] mt-0.5">-{totalMonthlyLeak.toFixed(0)}만</div>
          </div>
          <div
            className={`p-2 rounded border ${
              actualInvested >= 0
                ? 'bg-[#261d10] border-[#d4af37]'
                : 'bg-[#3d1714] border-[#db4635] animate-pulse'
            }`}
          >
            <div className="text-[10px] text-[#f7dfa5] font-sans font-bold">④ 실제 저축액</div>
            <div className={`font-bold mt-0.5 ${actualInvested >= 0 ? 'text-[#f0cf85]' : 'text-[#ff8a75]'}`}>
              {actualInvested >= 0 ? `+${actualInvested.toFixed(0)}만` : `${actualInvested.toFixed(0)}만(적자)`}
            </div>
          </div>
        </div>

        <div className="text-[11px] text-[#bfa988] leading-relaxed">
          • 기초 생활비만 뺀 <b>최대 저축 가능 여력(황금빛 기준)</b>은 월 <b className="text-[#f0cf85] font-mono">{baseSavingsCapacity}만원</b>이며, 여기에 배달·OTT 등 일상 누수까지 빼면 실제로는 매달 <b className={actualInvested >= 0 ? 'text-[#7ec8a3] font-mono' : 'text-[#e05a47] font-mono'}>{actualInvested.toFixed(1)}만원</b>이 투자 계좌에 남습니다.
        </div>
      </div>

      {/* 주거·생활 형태별 빠른 프리셋 */}
      <div>
        <div className="text-[11px] text-[#bfa988] mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#7ec8a3]" /> 거주 형태별 표준 생계비 프리셋:
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => applyLivingPreset('solo-beginner')}
            className="p-2 rounded bg-[#1f1710] hover:bg-[#2e2217] text-[#f0cf85] border border-[#785a28] text-center transition-colors cursor-pointer"
          >
            <div className="font-bold text-[11px]">🏠 자취 초년생</div>
            <div className="text-[10px] text-[#bfa988] font-mono">월 120만원 (원룸)</div>
          </button>
          <button
            type="button"
            onClick={() => applyLivingPreset('parents-home')}
            className="p-2 rounded bg-[#18241e] hover:bg-[#22332a] text-[#8cd4b5] border border-[#456e5d] text-center transition-colors cursor-pointer"
          >
            <div className="font-bold text-[11px]">🏡 본가 거주(캥거루)</div>
            <div className="text-[10px] text-[#bfa988] font-mono">월 64만원 (월세 절감)</div>
          </button>
          <button
            type="button"
            onClick={() => applyLivingPreset('independent-pro')}
            className="p-2 rounded bg-[#2b1d12] hover:bg-[#3a2819] text-[#ffad75] border border-[#8f532f] text-center transition-colors cursor-pointer"
          >
            <div className="font-bold text-[11px]">🏢 독립 직장인</div>
            <div className="text-[10px] text-[#bfa988] font-mono">월 155만원 (오피스텔)</div>
          </button>
        </div>
      </div>

      {/* 기초 생활비 항목 리스트 (월세, 마트 장보기, 공과금·핸드폰, 샤워·생필품) */}
      <div className="space-y-2.5">
        {items.map((item) => {
          const badge = ESSENTIAL_BADGES[item.category] || ESSENTIAL_BADGES.custom;
          return (
            <div
              key={item.id}
              className={`p-3 rounded border transition-all ${
                item.isActive
                  ? 'bg-[#1a140f]/95 border-[#5c4524]'
                  : 'bg-[#120e0b]/40 border-[#2e2214] opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="checkbox"
                    checked={item.isActive}
                    onChange={() => toggleItem(item.id)}
                    className="w-4 h-4 accent-[#7ec8a3] rounded cursor-pointer"
                  />
                  {item.category === 'rent' && <Home className="w-3.5 h-3.5 text-[#f0cf85]" />}
                  {item.category === 'groceries' && <ShoppingCart className="w-3.5 h-3.5 text-[#7ec8a3]" />}
                  {item.category === 'utilities' && <Zap className="w-3.5 h-3.5 text-[#9ec5eb]" />}
                  {item.category === 'necessities' && <Droplets className="w-3.5 h-3.5 text-[#dfa8e8]" />}
                  <span className="text-xs font-bold text-[#f7e7ce]">{item.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border font-mono ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#8cd4b5]">
                    {item.isActive ? `월 ${item.monthlyCost}만원` : '제외됨'}
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

              <p className="text-[10.5px] text-[#9c8669] mb-2 pl-6">{item.description}</p>

              {item.isActive && (
                <div className="pl-6">
                  <input
                    type="range"
                    min="0"
                    max="150"
                    step="1"
                    value={item.monthlyCost}
                    onChange={(e) => updateCost(item.id, Number(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 직접 추가 버튼 & 폼 */}
      <div>
        {!showAddForm ? (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="w-full py-2 rounded brass-plaque hover:brightness-110 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> + 기타 필수 생존비 항목 추가 (학자금대출·보험료·반려동물 등)
          </button>
        ) : (
          <form onSubmit={handleAddCustom} className="bg-[#140f0c] p-3.5 rounded border border-[#9e7836] space-y-2.5 text-xs">
            <div className="flex justify-between items-center font-bold text-[#f0cf85]">
              <span>⚙ 신규 필수 생존 비용 기입</span>
              <button type="button" onClick={() => setShowAddForm(false)} className="text-[#bfa988] hover:text-white cursor-pointer">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-[#bfa988] block mb-1">항목명</label>
                <input
                  type="text"
                  placeholder="예: 실비보험료, 학자금 상환"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#1f1812] border border-[#5c4524] rounded px-2.5 py-1.5 text-[#f7e7ce]"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] text-[#bfa988] block mb-1">월 지출액 (만원)</label>
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={newCost}
                  onChange={(e) => setNewCost(Number(e.target.value))}
                  className="w-full bg-[#1f1812] border border-[#5c4524] rounded px-2.5 py-1.5 text-[#f7e7ce]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-[#bfa988] block mb-1">분류</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as EssentialCategory)}
                  className="w-full bg-[#1f1812] border border-[#5c4524] rounded px-2.5 py-1.5 text-[#f7e7ce]"
                >
                  <option value="rent">주거·월세</option>
                  <option value="groceries">마트·식재료</option>
                  <option value="utilities">공과금·통신</option>
                  <option value="necessities">생필품·위생·교통</option>
                  <option value="custom">기타 필수 고정비</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-[#bfa988] block mb-1">세부 설명</label>
                <input
                  type="text"
                  placeholder="예: 매월 고정 납부"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#1f1812] border border-[#5c4524] rounded px-2.5 py-1.5 text-[#f7e7ce]"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-1.5 rounded brass-plaque hover:brightness-110 font-bold flex items-center justify-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" /> 기초 생존비 원장에 등록
            </button>
          </form>
        )}
      </div>

      {/* 양피지 설명 */}
      <div className="parchment-note p-2.5 text-[11px] flex items-start gap-2">
        <HelpCircle className="w-3.5 h-3.5 text-[#7ec8a3] mt-0.5 flex-shrink-0" />
        <span>
          <b>현실 연동 효과:</b> 여기서 설정한 기초 생존비(월 {totalEssential}만원)는 매년 물가상승률에 따라 조금씩 인상되며, <b>실직 쇼크가 발생했을 때 매달 내 계좌에서 강제로 빠져나가는 최소 생존비</b>로도 자동 연동됩니다!
        </span>
      </div>
    </div>
  );
};
