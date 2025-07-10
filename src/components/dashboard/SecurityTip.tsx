import React from 'react';
import { VscInfo } from 'react-icons/vsc';

export const SecurityTip: React.FC = () => {
  return (
    <div className="fixed bottom-20 right-8 z-50 hidden md:block">
        <div className="flex items-center gap-2 rounded-lg bg-zinc-800/80 px-4 py-2 text-xs text-neutral-400 backdrop-blur-sm">
            <VscInfo />
            <span>Tips: Jangan bagikan token pribadi Anda kepada siapapun.</span>
        </div>
    </div>
  );
};