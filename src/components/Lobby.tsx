import React, { useState } from 'react';
import { Player, PupilTier } from '../types';
import { User, ShieldAlert, Sparkles, Smile, Star, Trophy, Users, Award, PlayCircle, Plus, Trash2 } from 'lucide-react';

interface LobbyProps {
  onStartGame: (players: Player[]) => void;
}

const AVATAR_COLORS = [
  { name: 'Red', bg: 'bg-rose-500', hover: 'hover:bg-rose-600' },
  { name: 'Blue', bg: 'bg-blue-600', hover: 'hover:bg-blue-700' },
  { name: 'Green', bg: 'bg-emerald-500', hover: 'hover:bg-emerald-600' },
  { name: 'Yellow', bg: 'bg-amber-500', hover: 'hover:bg-amber-600' },
  { name: 'Purple', bg: 'bg-purple-500', hover: 'hover:bg-purple-600' },
];

const AVATAR_ICONS = ['Smile', 'Star', 'Trophy', 'Award', 'User'];

export const Lobby: React.FC<LobbyProps> = ({ onStartGame }) => {
  const [players, setPlayers] = useState<Omit<Player, 'id' | 'position' | 'stars' | 'correctSpells' | 'totalAttempts' | 'completed' | 'sentences'>[]>([
    { name: 'Alex', avatarColor: 'bg-rose-500', avatarIcon: 'Smile', tier: 'remedial' },
    { name: 'Sarah', avatarColor: 'bg-blue-600', avatarIcon: 'Star', tier: 'engagement' },
    { name: 'Marcus', avatarColor: 'bg-emerald-500', avatarIcon: 'Trophy', tier: 'enrichment' },
  ]);

  const addPlayer = () => {
    if (players.length >= 9) return;
    const colorsUsed = players.map(p => p.avatarColor);
    const unusedColor = AVATAR_COLORS.find(c => !colorsUsed.includes(c.bg)) || AVATAR_COLORS[0];
    
    setPlayers([
      ...players,
      {
        name: `Player ${players.length + 1}`,
        avatarColor: unusedColor.bg,
        avatarIcon: AVATAR_ICONS[players.length % AVATAR_ICONS.length],
        tier: 'engagement',
      },
    ]);
  };

  const removePlayer = (index: number) => {
    if (players.length <= 1) return;
    setPlayers(players.filter((_, idx) => idx !== index));
  };

  const updatePlayer = (index: number, fields: Partial<(typeof players)[0]>) => {
    setPlayers(players.map((p, idx) => (idx === index ? { ...p, ...fields } : p)));
  };

  const applyPreset = (presetType: 'mixed' | 'remedial' | 'enrichment') => {
    if (presetType === 'mixed') {
      setPlayers([
        { name: 'Lucas (Rem)', avatarColor: 'bg-rose-500', avatarIcon: 'Smile', tier: 'remedial' },
        { name: 'Bella (Std)', avatarColor: 'bg-blue-600', avatarIcon: 'Star', tier: 'engagement' },
        { name: 'Ethan (Enr)', avatarColor: 'bg-emerald-500', avatarIcon: 'Trophy', tier: 'enrichment' },
      ]);
    } else if (presetType === 'remedial') {
      setPlayers([
        { name: 'Toby', avatarColor: 'bg-rose-500', avatarIcon: 'Smile', tier: 'remedial' },
        { name: 'Zoe', avatarColor: 'bg-amber-500', avatarIcon: 'Award', tier: 'remedial' },
      ]);
    } else if (presetType === 'enrichment') {
      setPlayers([
        { name: 'Sophia', avatarColor: 'bg-purple-500', avatarIcon: 'Trophy', tier: 'enrichment' },
        { name: 'Oliver', avatarColor: 'bg-emerald-500', avatarIcon: 'Star', tier: 'enrichment' },
      ]);
    }
  };

  const handleStart = () => {
    const formattedPlayers: Player[] = players.map((p, idx) => ({
      ...p,
      id: `${idx}-${Date.now()}`,
      position: 0,
      stars: 0,
      correctSpells: 0,
      totalAttempts: 0,
      completed: false,
      sentences: [],
    }));
    onStartGame(formattedPlayers);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 p-6 md:p-8 animate-fade-in overflow-hidden">
      {/* Lobby Title */}
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 mb-3 shadow-sm">
          <Users className="w-8 h-8" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
          Let's Play The Spelling Game
        </h1>
        <p className="text-slate-500 text-xs md:text-sm mt-1 max-w-md mx-auto leading-relaxed">
          Select names, customize learning profiles, and embark on a spelling adventure designed for all skill levels!
        </p>
      </div>

      {/* Classroom Quick Presets */}
      <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
        <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider block mb-2.5">
          Classroom Ability Presets
        </span>
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => applyPreset('mixed')}
            className="bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            📊 Mixed Ability Group (Sarah, Alex, Marcus)
          </button>
          <button
            onClick={() => applyPreset('remedial')}
            className="bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            🟢 Phonics & Spelling Buddy (Remedial Focus)
          </button>
          <button
            onClick={() => applyPreset('enrichment')}
            className="bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            🟡 Super Spellers (Enrichment Sentence Builder)
          </button>
        </div>
      </div>

      {/* Player List Editor */}
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-700 font-mono uppercase tracking-wider">
            Spellers In Group ({players.length}/9)
          </h2>
          {players.length < 9 && (
            <button
              onClick={addPlayer}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold text-xs bg-blue-50 hover:bg-blue-100/80 px-3 py-1.5 rounded-xl transition-all border border-blue-100/50 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Speller</span>
            </button>
          )}
        </div>

        <div className="grid gap-4">
          {players.map((player, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl border-2 border-slate-100 shadow-sm bg-slate-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in"
            >
              {/* Profile Name & Icon customization */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${player.avatarColor} border-2 border-white shadow-md flex items-center justify-center text-white`}>
                  <Smile className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                
                <div className="space-y-1 flex-1">
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => updatePlayer(index, { name: e.target.value })}
                    className="font-bold text-sm md:text-base text-slate-700 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none bg-transparent py-0.5"
                    placeholder="Enter speller name"
                  />
                  <div className="flex gap-1">
                    {AVATAR_COLORS.map(c => (
                      <button
                        key={c.bg}
                        onClick={() => updatePlayer(index, { avatarColor: c.bg })}
                        className={`w-3.5 h-3.5 rounded-full ${c.bg} border ${
                          player.avatarColor === c.bg ? 'ring-2 ring-blue-400 ring-offset-1' : 'opacity-80'
                        } cursor-pointer`}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Learning Tier Selection */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => updatePlayer(index, { tier: 'remedial' })}
                  className={`flex-1 sm:flex-none px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer text-left sm:text-center flex items-center gap-2 transform active:scale-95 ${
                    player.tier === 'remedial'
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-100'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <div>
                    <span className="block text-[10px] opacity-80 leading-none">Remedial 🟢</span>
                    <span className="text-xs">Spelling Buddy</span>
                  </div>
                </button>

                <button
                  onClick={() => updatePlayer(index, { tier: 'engagement' })}
                  className={`flex-1 sm:flex-none px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer text-left sm:text-center flex items-center gap-2 transform active:scale-95 ${
                    player.tier === 'engagement'
                      ? 'bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-100'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Smile className="w-4 h-4 flex-shrink-0 animate-bounce" />
                  <div>
                    <span className="block text-[10px] opacity-80 leading-none">Standard 🔵</span>
                    <span className="text-xs">Spell & Play</span>
                  </div>
                </button>

                <button
                  onClick={() => updatePlayer(index, { tier: 'enrichment' })}
                  className={`flex-1 sm:flex-none px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer text-left sm:text-center flex items-center gap-2 transform active:scale-95 ${
                    player.tier === 'enrichment'
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-100'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 flex-shrink-0 animate-pulse text-amber-200" />
                  <div>
                    <span className="block text-[10px] opacity-80 leading-none">Enrichment 🟡</span>
                    <span className="text-xs">Sentence Maker</span>
                  </div>
                </button>

                {players.length > 1 && (
                  <button
                    onClick={() => removePlayer(index)}
                    className="p-2 border border-slate-200 hover:border-rose-200 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors flex items-center justify-center"
                    title="Remove Speller"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Game Action */}
      <div className="mt-8 border-t border-slate-100 pt-6">
        <button
          onClick={handleStart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm py-4 rounded-[20px] transition-all shadow-xl shadow-blue-200/50 flex items-center justify-center gap-2 cursor-pointer scale-100 hover:scale-[1.01] active:scale-[0.99]"
        >
          <PlayCircle className="w-5 h-5" />
          <span>START THE SPELLING GAME</span>
        </button>
      </div>
    </div>
  );
};
