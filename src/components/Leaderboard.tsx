import React from 'react';
import { Player } from '../types';
import { Trophy, Star, Award, RotateCcw, Quote, CheckCircle } from 'lucide-react';

interface LeaderboardProps {
  players: Player[];
  onRestart: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ players, onRestart }) => {
  // Sort players by stars (highest first), then by correct spellings
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.stars !== a.stars) {
      return b.stars - a.stars;
    }
    return b.correctSpells - a.correctSpells;
  });

  const winner = sortedPlayers[0];

  // Collect all completed Enrichment sentences
  const allSentences = players.flatMap(p => 
    p.sentences.map(s => ({ ...s, playerName: p.name }))
  );

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 p-6 md:p-8 animate-fade-in overflow-hidden">
      {/* Title / Trophy Celebration */}
      <div className="text-center mb-8">
        <div className="inline-flex p-4 bg-blue-50 text-blue-600 rounded-3xl border border-blue-100 mb-4 animate-pulse">
          <Trophy className="w-10 h-10 fill-blue-300" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
          Congratulations, Spelling Champions!
        </h1>
        <p className="text-slate-500 text-xs md:text-sm mt-1 max-w-sm mx-auto">
          Every single speller did an outstanding job reviewing their textbook words today!
        </p>
      </div>

      {/* Podium Winner Card */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 p-6 text-center shadow-md relative mb-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/20 rounded-full blur-xl" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-orange-200/20 rounded-full blur-xl" />

        <span className="text-[10px] bg-amber-100 text-amber-700 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-mono border border-amber-200">
          👑 1st Place Winner
        </span>
        <h2 className="text-2xl font-black text-amber-950 mt-3">{winner.name}</h2>
        
        <div className="flex justify-center items-center gap-6 mt-4">
          <div className="text-center">
            <span className="block text-2xl font-black text-amber-600">⭐ {winner.stars}</span>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Stars</span>
          </div>
          <div className="w-px h-8 bg-amber-200" />
          <div className="text-center">
            <span className="block text-2xl font-black text-amber-600">{winner.correctSpells}</span>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Spelled Right</span>
          </div>
        </div>
      </div>

      {/* Full Leaderboard List */}
      <div className="space-y-3 mb-8">
        <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider mb-2">
          Final Scores
        </h3>
        {sortedPlayers.map((player, idx) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
              idx === 0
                ? 'bg-amber-50/30 border-amber-200'
                : 'bg-slate-50/50 border-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                idx === 0 ? 'bg-amber-400 text-amber-950' : 'bg-slate-200 text-slate-600'
              }`}>
                {idx + 1}
              </span>
              <div className={`w-3.5 h-3.5 rounded-full ${player.avatarColor}`} />
              <div>
                <span className="font-bold text-slate-800 text-sm md:text-base">{player.name}</span>
                <span className="text-[10px] block text-slate-400 capitalize font-medium">
                  {player.tier} • Spelled {player.correctSpells}/{player.totalAttempts} words
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-white border border-slate-100 px-3 py-1.5 rounded-xl shadow-sm">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-black text-slate-700 text-sm md:text-base">
                {player.stars}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Sentences Showcase */}
      {allSentences.length > 0 && (
        <div className="space-y-4 mb-8">
          <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1">
            <Quote className="w-3.5 h-3.5 text-slate-400" />
            <span>Classroom Sentence Showcase</span>
          </h3>
          <div className="grid gap-4 max-h-60 overflow-y-auto pr-1">
            {allSentences.map((s, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-blue-100 bg-blue-50/20 space-y-2 text-left"
              >
                <div className="flex justify-between items-center text-[10px] font-bold text-blue-600">
                  <span>✍️ {s.playerName} using "{s.word}"</span>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: s.stars }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs font-semibold text-slate-800 italic">
                  "{s.sentence}"
                </p>
                <div className="bg-white/80 p-2.5 rounded-lg border border-blue-50/40 text-[11px] text-slate-600 leading-relaxed font-medium">
                  💬 {s.feedback}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Restart button */}
      <div className="border-t border-slate-100 pt-6">
        <button
          onClick={onRestart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3.5 rounded-[20px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-200/50"
        >
          <RotateCcw className="w-4 h-4" />
          <span>PLAY AGAIN</span>
        </button>
      </div>
    </div>
  );
};
