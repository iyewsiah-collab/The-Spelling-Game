import { useState, useEffect } from 'react';
import { Player, GameState, BoardTile, PupilTier } from './types';
import { BOARD_TILES } from './data';
import { GameBoard } from './components/GameBoard';
import { DifferentiatedSpelling } from './components/DifferentiatedSpelling';
import { Lobby } from './components/Lobby';
import { Leaderboard } from './components/Leaderboard';
import { playSound } from './utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dices, Volume2, VolumeX, RefreshCw, HelpCircle, Sparkles, BookOpen, Clock, 
  ArrowRight, ShieldCheck, ChevronRight, MessageCircleCode, Trophy, Heart, HelpCircle as HelpIcon,
  Star
} from 'lucide-react';

export default function App() {
  // Game state
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [phase, setPhase] = useState<GameState['phase']>('lobby');
  const [isRolling, setIsRolling] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [targetTile, setTargetTile] = useState<BoardTile | null>(null);
  const [previousPosition, setPreviousPosition] = useState<number>(0);
  
  // Settings state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Sound play wrappers with check
  const playWrapper = (soundFn: () => void) => {
    if (soundEnabled) soundFn();
  };

  const addLog = (message: string) => {
    setLogs(prev => [message, ...prev].slice(0, 10));
  };

  const handleStartGame = (newPlayers: Player[]) => {
    setPlayers(newPlayers);
    setCurrentPlayerIndex(0);
    setPhase('playing');
    setDiceResult(null);
    setTargetTile(null);
    setLogs([]);
    addLog("🎮 The game has started! Good luck, spellers!");
  };

  const handleRollDice = () => {
    if (isRolling || phase !== 'playing') return;

    setIsRolling(true);
    setDiceResult(null);
    addLog(`🎲 ${players[currentPlayerIndex].name} is rolling the dice...`);

    // Rolling animation ticks
    let ticks = 0;
    const interval = setInterval(() => {
      setDiceResult(Math.floor(Math.random() * 4) + 1); // 1-4 dice
      playWrapper(playSound.diceRoll);
      ticks++;
      if (ticks >= 8) {
        clearInterval(interval);
        finalizeRoll();
      }
    }, 100);
  };

  const finalizeRoll = () => {
    const finalRoll = Math.floor(Math.random() * 4) + 1;
    setDiceResult(finalRoll);
    setIsRolling(false);

    const activePlayer = players[currentPlayerIndex];
    setPreviousPosition(activePlayer.position);
    
    // Calculate new position
    let newPos = activePlayer.position + finalRoll;
    if (newPos > 29) newPos = 29; // Cap at Finish tile

    addLog(`🎲 ${activePlayer.name} rolled a ${finalRoll}! Moving forward ${finalRoll} tiles.`);

    // Animate player moving space-by-space
    let currentStep = activePlayer.position;
    const moveTimer = setInterval(() => {
      if (currentStep < newPos) {
        currentStep++;
        setPlayers(prev => prev.map((p, idx) => idx === currentPlayerIndex ? { ...p, position: currentStep } : p));
        playWrapper(playSound.move);
      } else {
        clearInterval(moveTimer);
        // Landed on target tile
        const tile = BOARD_TILES.find(t => t.index === newPos) || BOARD_TILES[0];
        setTargetTile(tile);
        
        if (tile.index === 29) {
          // Finished!
          handleGameFinished();
        } else {
          // Go to spelling phase
          setPhase('spelling');
        }
      }
    }, 300);
  };

  const handleSpellingSuccess = (
    starsEarned: number, 
    sentenceDetails?: { word: string; sentence: string; feedback: string; approved: boolean; stars: number }
  ) => {
    playWrapper(playSound.success);
    const activePlayer = players[currentPlayerIndex];

    setPlayers(prev => prev.map((p, idx) => {
      if (idx === currentPlayerIndex) {
        const updatedSentences = sentenceDetails 
          ? [...p.sentences, sentenceDetails]
          : p.sentences;
          
        return {
          ...p,
          stars: p.stars + starsEarned,
          correctSpells: p.correctSpells + 1,
          totalAttempts: p.totalAttempts + 1,
          sentences: updatedSentences
        };
      }
      return p;
    }));

    addLog(`✨ Correct! ${activePlayer.name} spelled "${targetTile?.word.toLowerCase()}"! Earned ${starsEarned} stars! ⭐`);

    // Complete spelling
    setTimeout(() => {
      advanceTurn();
    }, 1000);
  };

  const handleSpellingFailure = () => {
    playWrapper(playSound.failure);
    const activePlayer = players[currentPlayerIndex];

    addLog(`❌ Oops! ${activePlayer.name} missed the spelling of "${targetTile?.word.toLowerCase()}".`);
    addLog(`↩️ Sliding back to their original tile (${BOARD_TILES[previousPosition].word.toLowerCase()}).`);

    // Update statistics and slide back to previous position
    setPlayers(prev => prev.map((p, idx) => {
      if (idx === currentPlayerIndex) {
        return {
          ...p,
          totalAttempts: p.totalAttempts + 1,
        };
      }
      return p;
    }));

    playWrapper(playSound.slideBack);
    
    // Smoothly slide back to previous position
    let currentStep = activePlayer.position;
    const slideTimer = setInterval(() => {
      if (currentStep > previousPosition) {
        currentStep--;
        setPlayers(prev => prev.map((p, idx) => idx === currentPlayerIndex ? { ...p, position: currentStep } : p));
        playWrapper(playSound.move);
      } else {
        clearInterval(slideTimer);
        advanceTurn();
      }
    }, 200);
  };

  const advanceTurn = () => {
    setPhase('playing');
    setDiceResult(null);
    setTargetTile(null);

    // Find next active player
    const nextIdx = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextIdx);
    addLog(`👉 It is now ${players[nextIdx].name}'s turn!`);
  };

  const handleGameFinished = () => {
    const activePlayer = players[currentPlayerIndex];
    // Give 5 bonus stars to the player who reached the finish!
    setPlayers(prev => prev.map((p, idx) => {
      if (idx === currentPlayerIndex) {
        return {
          ...p,
          stars: p.stars + 5,
          completed: true
        };
      }
      return p;
    }));

    addLog(`🏆 AMAZING! ${activePlayer.name} has reached the FINISH line and got 5 bonus stars!`);
    
    setTimeout(() => {
      setPhase('finished');
    }, 2000);
  };

  const handleRestart = () => {
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setPhase('lobby');
    setDiceResult(null);
    setTargetTile(null);
    setLogs([]);
  };

  const activePlayer = players[currentPlayerIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-sky-50 to-amber-50/40 flex flex-col antialiased selection:bg-blue-200 relative overflow-x-hidden">
      {/* Playful Floating Bubbles & Cute Emojis for Year 1 Pupils */}
      <div className="absolute top-12 left-[10%] w-24 h-24 rounded-full bg-blue-100/40 blur-xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-20 right-[15%] w-32 h-32 rounded-full bg-amber-100/40 blur-xl pointer-events-none animate-pulse delay-1000"></div>
      <div className="absolute top-[40%] right-[5%] w-20 h-20 rounded-full bg-emerald-100/30 blur-lg pointer-events-none animate-pulse delay-500"></div>
      <div className="absolute top-[70%] left-[8%] w-16 h-16 rounded-full bg-pink-100/40 blur-lg pointer-events-none animate-pulse delay-700"></div>

      {/* Floating Animated Emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <motion.div 
          className="absolute text-4xl"
          style={{ top: '15%', left: '8%' }}
          animate={{ y: [0, -25, 0], x: [0, 15, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          🎈
        </motion.div>
        <motion.div 
          className="absolute text-3xl"
          style={{ top: '35%', right: '12%' }}
          animate={{ y: [0, -20, 0], x: [0, -15, 0], rotate: [0, -15, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          🌟
        </motion.div>
        <motion.div 
          className="absolute text-4xl"
          style={{ top: '65%', left: '5%' }}
          animate={{ y: [0, -30, 0], x: [0, 20, 0], rotate: [0, 12, -12, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          🎨
        </motion.div>
        <motion.div 
          className="absolute text-4xl"
          style={{ bottom: '15%', right: '8%' }}
          animate={{ y: [0, -25, 0], x: [0, -10, 0], rotate: [0, 8, -8, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          🧸
        </motion.div>
        <motion.div 
          className="absolute text-3xl"
          style={{ top: '50%', left: '22%' }}
          animate={{ y: [0, -15, 0], x: [0, 10, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        >
          ✏️
        </motion.div>
        <motion.div 
          className="absolute text-4xl"
          style={{ top: '8%', right: '25%' }}
          animate={{ y: [0, -20, 0], x: [0, 15, 0], rotate: [0, 15, -15, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        >
          🦖
        </motion.div>
        <motion.div 
          className="absolute text-3xl"
          style={{ bottom: '25%', left: '15%' }}
          animate={{ y: [0, -22, 0], x: [0, -12, 0], rotate: [0, -10, 10, 0] }}
          transition={{ duration: 9.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        >
          🍎
        </motion.div>
      </div>
      
      {/* Top Navbar */}
      <nav className="h-20 px-6 md:px-10 flex justify-between items-center bg-white/90 backdrop-blur-md border-b border-blue-100/40 shadow-sm shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-sky-400 rounded-2xl flex items-center justify-center text-white shadow-md shadow-blue-200 animate-bounce">
            <span className="text-2xl">✏️</span>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-800 flex items-center gap-1.5 font-sans">
              <span>LET'S PLAY!</span>
              <span className="text-xs md:text-sm px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-extrabold font-mono tracking-wide">
                🎈 FUN
              </span>
            </h1>
            <p className="text-[10px] font-bold text-blue-600 tracking-[0.2em] uppercase font-mono">The Spelling Game 🌟</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound toggle button */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              soundEnabled ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
            }`}
            title={soundEnabled ? "Mute Sounds" : "Enable Sounds"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Help toggle button */}
          <button
            onClick={() => setShowHelp(!showHelp)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              showHelp ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
            }`}
            title="Help & Rules"
          >
            <HelpIcon className="w-5 h-5" />
          </button>

          {phase !== 'lobby' && (
            <button
              onClick={handleRestart}
              className="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-xl transition-all flex items-center gap-1 text-xs font-bold cursor-pointer"
              title="Reset Game"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8 flex flex-col justify-center">
        
        {/* Help Screen Overlay Panel */}
        {showHelp && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-white border border-slate-100 rounded-[24px] p-6 shadow-xl shadow-slate-200/50 max-w-2xl mx-auto"
          >
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span>How To Play The Spelling Game</span>
            </h3>
            <div className="text-slate-600 text-xs leading-relaxed space-y-2">
              <p>
                Based on the <strong>Cambridge Supermind Year 1 (SB p33)</strong> board game, this digitized spelling game features 28 colorful squares containing objects or numbers from the syllabus.
              </p>
              <ol className="list-decimal list-inside space-y-1.5 pl-2 font-medium">
                <li>Choose your name and select your <strong>Learning Tier</strong> in the lobby to customize your challenges.</li>
                <li>Roll the dice to move your avatar token along the spiraling pathway.</li>
                <li>
                  Land on a square and spell the word!
                  <ul className="list-disc list-inside pl-4 font-normal mt-1 text-slate-500 space-y-1">
                    <li>🟢 <span className="font-bold">Spelling Buddy (Remedial)</span>: Interactive letter bubble click helper. Buzz wiggles when wrong. (1 Star)</li>
                    <li>🔵 <span className="font-bold">Standard (Engagement)</span>: First letter provided, type spelling. (1 Star)</li>
                    <li>🟡 <span className="font-bold">Sentence Maker (Enrichment)</span>: Type spelling (1 Star) + optional sentence builder challenge (up to 3 bonus stars).</li>
                  </ul>
                </li>
                <li>Spell correctly to secure your tile. Fail, and you'll slide back to your turn's starting tile!</li>
                <li>The first player to reach the <strong>FINISH</strong> tile gets 5 bonus stars and wins the game!</li>
              </ol>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Got it, close help!
            </button>
          </motion.div>
        )}

        {/* Phase Dispatcher */}
        {phase === 'lobby' && <Lobby onStartGame={handleStartGame} />}

        {phase === 'finished' && <Leaderboard players={players} onRestart={handleRestart} />}

        {(phase === 'playing' || phase === 'spelling') && (
          <div className="flex flex-col gap-6 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left/Top: Interactive Game Board (Cols: 7) */}
              <div className="lg:col-span-7 flex flex-col">
                <GameBoard
                  players={players}
                  currentPlayerIndex={currentPlayerIndex}
                />
              </div>

              {/* Right/Bottom: Active Controls & Spelling (Cols: 5) */}
              <div className="lg:col-span-5 flex flex-col h-full lg:pt-[84px] justify-stretch">
                
                <AnimatePresence mode="wait">
                  {phase === 'spelling' && targetTile && activePlayer ? (
                    /* Spelling overlay phase card */
                    <motion.div
                      key="spelling-card"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="h-full flex flex-col"
                    >
                      <DifferentiatedSpelling
                        player={activePlayer}
                        tile={targetTile}
                        onSuccess={handleSpellingSuccess}
                        onFailure={handleSpellingFailure}
                      />
                    </motion.div>
                  ) : (
                    /* Standard Roller Card */
                    <motion.div
                      key="roller-card"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 p-6 h-full flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">
                          Current Turn
                        </span>

                        {/* Active Player Status Box */}
                        <div className="flex items-center justify-between mt-2.5 p-4 bg-[#F8FAFC] border border-slate-100 rounded-[20px] shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 rounded-full ${activePlayer?.avatarColor} border-2 border-white shadow flex items-center justify-center text-white text-sm font-black`}>
                              {activePlayer?.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-slate-800 text-sm md:text-base leading-none">
                                {activePlayer?.name}
                              </h4>
                              <span className="text-[10px] uppercase font-mono font-bold text-slate-400 capitalize inline-block mt-1">
                                {activePlayer?.tier} Level
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center gap-1.5 justify-end">
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                              <span className="font-black text-slate-800 text-base">{activePlayer?.stars}</span>
                            </div>
                            <span className="text-[9px] text-slate-400 font-bold block">
                              Spelled: {activePlayer?.correctSpells}/{activePlayer?.totalAttempts}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Dice Roller Visual Area */}
                      <div className="my-8 flex flex-col items-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/60 rounded-[24px] shadow-md flex items-center justify-center relative overflow-hidden group">
                          
                          <AnimatePresence mode="wait">
                            {diceResult !== null ? (
                              <motion.div
                                key={diceResult}
                                initial={{ scale: 0.5, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0.5, rotate: 45 }}
                                className="text-blue-900 flex flex-col items-center justify-center"
                              >
                                <span className="text-4xl font-black font-mono leading-none">{diceResult}</span>
                                <span className="text-[10px] font-bold tracking-wider font-mono opacity-60 uppercase mt-0.5">steps</span>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="idle"
                                className="text-slate-400 flex flex-col items-center justify-center"
                                animate={isRolling ? { rotate: [0, 90, 180, 270, 360], scale: [1, 1.1, 1] } : {}}
                                transition={isRolling ? { repeat: Infinity, duration: 0.4 } : {}}
                              >
                                <Dices className="w-10 h-10 text-blue-500 animate-pulse" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <p className="text-xs text-slate-400 font-medium italic text-center mt-3">
                          {isRolling ? "Rolling dice..." : "Roll the dice to move!"}
                        </p>
                      </div>

                      {/* Roll Dice Action Button */}
                      <button
                        onClick={handleRollDice}
                        disabled={isRolling}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black text-xs md:text-sm h-14 rounded-[20px] transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-1.5 cursor-pointer scale-100 active:scale-[0.98]"
                      >
                        <Dices className="w-4 h-4" />
                        <span>ROLL THE DICE</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Live Game Classroom Activity Log */}
            <div className="bg-[#F8FAFC] border border-slate-100 rounded-[24px] p-5 shadow-sm">
              <h3 className="text-[10px] uppercase font-black text-slate-400 tracking-wider font-mono mb-3">
                Classroom Activity Logs
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {logs.length === 0 ? (
                  <p className="text-slate-400 text-xs italic">No activity yet. Roll the dice to begin!</p>
                ) : (
                  logs.map((log, index) => (
                    <div
                      key={index}
                      className={`text-xs p-2.5 rounded-xl border bg-white text-slate-700 font-medium ${
                        index === 0 ? 'border-blue-100 text-blue-900 bg-blue-50/20' : 'border-slate-100 text-slate-500'
                      }`}
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Humble Footer with zero clutter */}
      <footer className="bg-white border-t border-slate-100 py-4 text-center text-[11px] text-slate-400 font-medium">
        <span>Cambridge Supermind Year 1 Textbook Digital Spelling Companion</span>
      </footer>

    </div>
  );
}
