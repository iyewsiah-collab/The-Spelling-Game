import React from 'react';
import { Player, BoardTile } from '../types';
import { BOARD_TILES } from '../data';
import { SpellingImage } from './SVGIllustrations';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface GameBoardProps {
  players: Player[];
  currentPlayerIndex: number;
  onTileClick?: (tile: BoardTile) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  players,
  currentPlayerIndex,
  onTileClick,
}) => {
  // Group players by position to handle overlapping tokens
  const playersByPosition: Record<number, Player[]> = {};
  players.forEach((player) => {
    if (!playersByPosition[player.position]) {
      playersByPosition[player.position] = [];
    }
    playersByPosition[player.position].push(player);
  });

  // Arrow rendering helper
  const renderArrow = (direction?: 'left' | 'right' | 'up' | 'down') => {
    if (!direction) return null;
    const arrowClasses = "absolute z-10 text-slate-400 opacity-60 animate-pulse pointer-events-none";
    switch (direction) {
      case 'left':
        return <ArrowLeft className={`${arrowClasses} left-2 top-1/2 -translate-y-1/2 w-4 h-4`} />;
      case 'right':
        return <ArrowRight className={`${arrowClasses} right-2 top-1/2 -translate-y-1/2 w-4 h-4`} />;
      case 'up':
        return <ArrowUp className={`${arrowClasses} top-2 left-1/2 -translate-x-1/2 w-4 h-4`} />;
      case 'down':
        return <ArrowDown className={`${arrowClasses} bottom-2 left-1/2 -translate-x-1/2 w-4 h-4`} />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
      {/* Board Header Info */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2 bg-[#F8FAFC] px-4 py-2.5 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
            <Sparkles className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">The Spelling Game</h2>
            <p className="text-xs text-slate-500 font-mono">Cambridge Supermind Year 1</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {players.map((p, idx) => (
            <div
              key={p.id}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                idx === currentPlayerIndex
                  ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-400 ring-offset-1 scale-105'
                  : 'bg-white border-slate-100'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${p.avatarColor}`} />
              <span className={`text-xs font-semibold ${idx === currentPlayerIndex ? 'text-blue-950 font-bold' : 'text-slate-600'}`}>
                {p.name}
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-1 py-0.5 rounded ml-0.5">
                ⭐ {p.stars}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-5 gap-3 aspect-[5/6] md:aspect-square relative select-none">
        {BOARD_TILES.map((tile) => {
          const tilePlayers = playersByPosition[tile.index] || [];
          const isFinish = tile.index === 29;
          const isStart = tile.index === 0;

          return (
            <div
              key={tile.index}
              style={{
                gridRow: tile.gridRow + 1,
                gridColumn: tile.gridCol + 1,
              }}
              onClick={() => onTileClick?.(tile)}
              className={`relative flex flex-col items-center justify-between p-1.5 md:p-2.5 rounded-2xl border-2 transition-all cursor-pointer group hover:scale-[1.02] hover:shadow-md ${tile.color} overflow-hidden`}
              id={`tile-${tile.index}`}
            >
              {/* Grid cell details */}
              <div className="w-full flex justify-between items-center text-[10px] md:text-xs font-bold font-mono opacity-60">
                <span>{isStart || isFinish ? '' : tile.index}</span>
                <span className="capitalize text-[8px] md:text-[10px] tracking-wider font-sans bg-black/5 px-1 rounded">
                  {tile.category}
                </span>
              </div>

              {/* Vector SVG Illustration */}
              <div className="w-12 h-12 md:w-20 md:h-20 flex items-center justify-center p-1 relative z-1">
                <SpellingImage word={tile.word} className="w-full h-full object-contain filter drop-shadow-sm transition-transform group-hover:scale-110" />
              </div>

              {/* Arrow Indicator inside/from Cell */}
              {renderArrow(tile.arrowDirection)}

              {/* Word preview label on hover for engagement */}
              <div className="w-full text-center mt-0.5">
                <span className="text-[9px] md:text-[11px] font-bold tracking-tight line-clamp-1 capitalize opacity-80 group-hover:opacity-100">
                  {isStart ? 'Start' : isFinish ? 'Finish' : tile.word}
                </span>
              </div>

              {/* Overlay list of players in this cell */}
              {tilePlayers.length > 0 && (
                <div className="absolute inset-0 bg-black/10 flex flex-wrap items-center justify-center gap-1 p-2 rounded-2xl z-20 backdrop-blur-[1px]">
                  {tilePlayers.map((player) => (
                    <motion.div
                      key={player.id}
                      layoutId={`player-token-${player.id}`}
                      className={`w-6 h-6 md:w-9 md:h-9 rounded-full ${player.avatarColor} border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold`}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      title={`${player.name} (${player.tier} tier)`}
                    >
                      {/* Show first initial */}
                      <span className="uppercase text-[10px] md:text-xs font-black">
                        {player.name.substring(0, 2)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
