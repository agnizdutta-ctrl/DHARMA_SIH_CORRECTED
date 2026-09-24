import React from 'react';
import { BattleLogEntry } from '../../engine/types';

interface BattleLogProps {
  logs: BattleLogEntry[];
}

export const BattleLog: React.FC<BattleLogProps> = ({ logs }) => {
  return (
    <div
      id="court-battle-log"
      className="w-full h-full flex flex-col bg-[#D4E4DC]/40 rounded-2xl border border-[#1A3326]/10 p-3 shadow-inner"
    >
      <div className="flex items-center justify-between pb-2 border-b border-[#1A3326]/10 mb-2">
        <h4 className="font-kate text-xs font-bold uppercase tracking-wider text-[#1A3326]">
          Imperial Chronicle Log
        </h4>
        <span className="text-[10px] text-[#1A3326]/60 font-semibold">Live Turns</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
        {logs.length === 0 ? (
          <p className="text-[#1A3326]/50 italic text-[11px] py-4 text-center">
            The scribes await the first play...
          </p>
        ) : (
          logs.map((log) => {
            const isSteal = log.actionType === 'rival_steal' || log.actionType === 'karma_steal';
            const isCrisis = log.actionType === 'crisis';
            const isSkip = log.actionType === 'skip';

            return (
              <div
                key={log.id}
                className={`p-2 rounded-xl text-[11.5px] leading-relaxed transition ${
                  isSteal
                    ? 'bg-[#C0392B]/10 border-l-4 border-[#C0392B] text-[#922B21]'
                    : isCrisis
                    ? 'bg-purple-500/10 border-l-4 border-purple-600 text-purple-950'
                    : isSkip
                    ? 'bg-amber-500/10 border-l-4 border-amber-600 text-amber-950'
                    : 'bg-white/60 text-[#1A3326]'
                }`}
              >
                <div className="flex justify-between items-center text-[9px] font-bold opacity-75 mb-0.5">
                  <span className="uppercase">Round {log.round}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>
                <p className="font-centrion font-semibold">{log.message}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
