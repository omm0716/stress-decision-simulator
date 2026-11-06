import React, { useState } from 'react';
import { ScrollText, ChevronDown, ChevronUp, TrendingDown, TrendingUp } from 'lucide-react';
import type { SimulationResult } from '../types/simulator';

interface YearlyDataTableProps {
  result: SimulationResult;
}

const formatMoney = (val: number) => {
  if (Math.abs(val) >= 10000) {
    const eok = (val / 10000).toFixed(1);
    return `${eok}억원`;
  }
  return `${val.toLocaleString()}만원`;
};

export const YearlyDataTable: React.FC<YearlyDataTableProps> = ({ result }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { timeline, worstYear } = result;

  return (
    <div className="steam-panel overflow-hidden">
      {/* 헤더 & 토글 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#2a2017]/50 transition-colors border-b border-[#5c4524] cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <ScrollText className="w-5 h-5 text-[#f0cf85]" />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#c99738] block">
              LEDGER FOLIO NO. IV — DOUBLE-ENTRY CHRONICLE
            </span>
            <h2 className="text-base font-bold text-[#f7e7ce] m-0">연도별 복식부기 회계 원장</h2>
            <p className="text-xs text-[#bfa988] mt-0.5">
              원금 투입, 증기 누출, 실직 역인출 및 폭락 충격의 연차별 상세 기록부
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#f0cf85]">
          <span className="px-2.5 py-1 rounded brass-plaque font-mono">
            총 {timeline.length}개년 기록
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="overflow-x-auto bg-[#130f0c]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1e1711] text-[#d4af37] border-b-2 border-[#6b5129] font-mono">
                <th className="py-3 px-3.5 whitespace-nowrap">연차</th>
                <th className="py-3 px-3.5 whitespace-nowrap">주요 사건 / 보일러 충격</th>
                <th className="py-3 px-3.5 text-right whitespace-nowrap">누적 원금</th>
                <th className="py-3 px-3.5 text-right whitespace-nowrap">누적 누출액</th>
                <th className="py-3 px-3.5 text-right whitespace-nowrap">스트레스 잔고</th>
                <th className="py-3 px-3.5 text-right whitespace-nowrap">순손익 (수익률)</th>
                <th className="py-3 px-3.5 text-right whitespace-nowrap">압력강하(MDD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#332616] font-mono">
              {timeline.map((row) => {
                const isWorst = row.year === worstYear;
                const isNegative = row.stressNetProfit < 0;

                return (
                  <tr
                    key={row.year}
                    className={`hover:bg-[#241b13]/70 transition-colors ${
                      isWorst ? 'bg-[#361714]/50' : ''
                    } ${row.hadIncomeShock ? 'bg-[#2b1f12]/40' : ''}`}
                  >
                    <td className="py-2.5 px-3.5 whitespace-nowrap font-sans font-bold text-[#e6d7be]">
                      <div className="flex items-center gap-1.5">
                        <span>{row.label}</span>
                        {isWorst && (
                          <span className="px-1.5 py-0.2 rounded bg-[#4a1c17] text-[#ff9e8a] text-[10px] font-mono font-bold border border-[#a83829]">
                            최대위기
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-3.5 font-sans">
                      {row.events.length > 0 ? (
                        <div className="flex items-center gap-1 flex-wrap">
                          {row.events.map((ev, idx) => (
                            <span
                              key={idx}
                              className={`px-1.5 py-0.5 rounded text-[11px] font-medium border ${
                                ev.includes('이직') || ev.includes('퇴직') || ev.includes('안식') || ev.includes('실직')
                                  ? 'bg-[#2e2012] text-[#f0cf85] border-[#8c6a32]'
                                  : ev.includes('차량') || ev.includes('집')
                                  ? 'bg-[#192923] text-[#8cd4b5] border-[#456e5d]'
                                  : 'bg-[#3b1814] text-[#ff9e8a] border-[#8f3d2f]'
                              }`}
                            >
                              {ev}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[#6e5a44] text-[11px] font-mono">정상 가동</span>
                      )}
                    </td>

                    <td className="py-2.5 px-3.5 text-right text-[#d8c7ad]">
                      {formatMoney(row.totalPrincipal)}
                    </td>

                    <td className="py-2.5 px-3.5 text-right text-[#e59849]">
                      -{formatMoney(row.accumulatedLeakage)}
                    </td>

                    <td className="py-2.5 px-3.5 text-right font-bold text-[#f7e7ce]">
                      {formatMoney(row.stressBalance)}
                    </td>

                    <td
                      className={`py-2.5 px-3.5 text-right font-semibold ${
                        isNegative ? 'text-[#e05a47]' : 'text-[#7ec8a3]'
                      }`}
                    >
                      <div className="flex items-center justify-end gap-1">
                        {isNegative ? (
                          <TrendingDown className="w-3.5 h-3.5 flex-shrink-0" />
                        ) : (
                          <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
                        )}
                        <span>
                          {isNegative ? '' : '+'}
                          {formatMoney(row.stressNetProfit)} ({row.stressProfitRate > 0 ? '+' : ''}
                          {row.stressProfitRate}%)
                        </span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3.5 text-right">
                      {row.drawdownRate > 0 ? (
                        <span className="text-[#e05a47] font-bold">-{row.drawdownRate}%</span>
                      ) : (
                        <span className="text-[#6e5a44]">0%</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
