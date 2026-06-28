import React, { useState, useEffect, useRef } from 'react';
import { Player, BoardTile, PupilTier } from '../types';
import { SpellingImage } from './SVGIllustrations';
import { Volume2, Sparkles, CheckCircle2, AlertCircle, RefreshCw, Send, Loader2, Award } from 'lucide-react';

interface DifferentiatedSpellingProps {
  player: Player;
  tile: BoardTile;
  onSuccess: (earnedStars: number, sentenceDetails?: { sentence: string; feedback: string; approved: boolean; stars: number }) => void;
  onFailure: () => void;
}

export const DifferentiatedSpelling: React.FC<DifferentiatedSpellingProps> = ({
  player,
  tile,
  onSuccess,
  onFailure,
}) => {
  const word = tile.word.toLowerCase();
  
  // Max attempts configured by pupil learning tier
  const maxAttempts = player.tier === 'remedial' ? 3 : player.tier === 'engagement' ? 2 : 1;
  
  // Extract only spelling letters (skip spaces and hyphens in spelling trays)
  const isLetter = (char: string) => /[a-zA-Z]/.test(char);
  
  // State variables
  const [typedInput, setTypedInput] = useState('');
  const [spelledLetters, setSpelledLetters] = useState<string[]>([]);
  const [scrambledPool, setScrambledPool] = useState<{ id: string; char: string; used: boolean }[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [hasSpelledCorrectly, setHasSpelledCorrectly] = useState(false);
  const [wiggleIndex, setWiggleIndex] = useState<number | null>(null);

  // Split spelling words into clean words so they don't wrap letters like 'r' confusingly to the next line
  const getWordChunks = () => {
    const chunks: { char: string; originalIndex: number }[][] = [];
    let currentChunk: { char: string; originalIndex: number }[] = [];
    
    word.split('').forEach((char, idx) => {
      if (char === ' ') {
        if (currentChunk.length > 0) {
          chunks.push(currentChunk);
          currentChunk = [];
        }
      } else {
        currentChunk.push({ char, originalIndex: idx });
      }
    });
    
    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }
    return chunks;
  };

  // Sentence Builder (Enrichment only)
  const [sentence, setSentence] = useState('');
  const [sentenceLoading, setSentenceLoading] = useState(false);
  const [sentenceFeedback, setSentenceFeedback] = useState<{
    approved: boolean;
    feedback: string;
    stars: number;
  } | null>(null);

  // Speech synthesis reference
  const speakLively = (text: string, rate: number = 1.0) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      utterance.pitch = 1.35; // Lively, friendly, higher pitch (more cute/enthusiastic for children)
      utterance.rate = rate;

      const voices = window.speechSynthesis.getVoices();
      // Look for natural, premium, google, or high-quality voices which sound more lively
      const livelyVoice = voices.find(v => 
        (v.lang.startsWith('en-GB') || v.lang.startsWith('en-US')) && 
        (v.name.toLowerCase().includes('google') || 
         v.name.toLowerCase().includes('natural') || 
         v.name.toLowerCase().includes('samantha') || 
         v.name.toLowerCase().includes('zira') || 
         v.name.toLowerCase().includes('hazel') || 
         v.name.toLowerCase().includes('female'))
      ) || voices.find(v => v.lang.startsWith('en'));

      if (livelyVoice) {
        utterance.voice = livelyVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakWord = () => {
    speakLively(tile.word, 0.85); // slightly slower for spelling clarity
  };

  // Generate scrambled letter pool
  useEffect(() => {
    const letters = word.split('').filter(isLetter);
    let pool = [...letters];
    
    // For standard level ('engagement') pupils, give them only the first letter of the word pre-filled on the tray, and ask them to spell it out.
    // So we remove the first letter from the pool.
    if (player.tier === 'engagement' && pool.length > 0) {
      const idx = pool.indexOf(word[0]);
      if (idx !== -1) {
        pool.splice(idx, 1);
      }
    }

    // Shuffle pool
    const shuffled = pool
      .map((char, index) => ({ id: `${char}-${index}-${Math.random()}`, char, used: false }))
      .sort(() => Math.random() - 0.5);

    setScrambledPool(shuffled);

    // Initial spelling tray pre-fill
    const initialSpelled = new Array(word.length).fill('');
    if (player.tier === 'engagement' && word.length > 0) {
      initialSpelled[0] = word[0];
    }
    setSpelledLetters(initialSpelled);

    setTypedInput('');
    setErrorMessage('');
    setSuccessMessage('');
    setHasSpelledCorrectly(false);
    setSentence('');
    setSentenceFeedback(null);
  }, [tile.word, player.tier]);

  // Fill in non-letter spots automatically (like spaces and hyphens)
  useEffect(() => {
    setSpelledLetters(prev => {
      const updated = [...prev];
      word.split('').forEach((char, idx) => {
        if (!isLetter(char)) {
          updated[idx] = char;
        }
      });
      return updated;
    });
  }, [word]);

  // Click handler for letter pool bubble
  const handleLetterBubbleClick = (item: { id: string; char: string; used: boolean }, poolIndex: number) => {
    if (item.used || hasSpelledCorrectly) return;

    // In Remedial mode, we guide them directly
    if (player.tier === 'remedial') {
      // Find the next empty position that needs a letter
      const nextIndex = spelledLetters.findIndex(l => l === '');
      if (nextIndex === -1) return;

      const expectedChar = word[nextIndex];
      if (item.char === expectedChar) {
        // Correct letter clicked!
        const updatedLetters = [...spelledLetters];
        updatedLetters[nextIndex] = item.char;
        setSpelledLetters(updatedLetters);

        // Mark pool item as used
        setScrambledPool(prev => prev.map((p, idx) => idx === poolIndex ? { ...p, used: true } : p));
        setErrorMessage('');
        
        // Auto-check if completed
        const isComplete = updatedLetters.every(l => l !== '');
        if (isComplete) {
          const finishedWord = updatedLetters.join('');
          if (finishedWord === word) {
            handleSpellingSuccess();
          }
        }
      } else {
        // Incorrect letter! Buzz/wiggle
        setWiggleIndex(poolIndex);
        setTimeout(() => setWiggleIndex(null), 500);
        setErrorMessage('Oops! Think about the sounds in the word.');
        speakLively(item.char);
      }
    } else {
      // Standard click behavior for Engagement mode
      const nextIndex = spelledLetters.findIndex(l => l === '');
      if (nextIndex === -1) return;

      const updatedLetters = [...spelledLetters];
      updatedLetters[nextIndex] = item.char;
      setSpelledLetters(updatedLetters);

      setScrambledPool(prev => prev.map((p, idx) => idx === poolIndex ? { ...p, used: true } : p));
    }
  };

  // Click on a letter on the spelling tray to remove it (Engagement mode only)
  const handleRemoveTrayLetter = (idx: number) => {
    if (player.tier === 'remedial' || hasSpelledCorrectly) return;
    const char = spelledLetters[idx];
    if (!char || !isLetter(char)) return; // Don't remove pre-filled spaces or hyphens

    const updatedLetters = [...spelledLetters];
    updatedLetters[idx] = '';
    setSpelledLetters(updatedLetters);

    // Free the letter back to the pool
    // Find the first matching used letter in scrambled pool and restore it
    setScrambledPool(prev => {
      const matchIdx = prev.findIndex(p => p.char === char && p.used);
      if (matchIdx !== -1) {
        return prev.map((p, i) => i === matchIdx ? { ...p, used: false } : p);
      }
      return prev;
    });
  };

  // Direct keyboard input check
  const handleCheckTypedWord = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = typedInput.toLowerCase().trim();

    if (cleanInput === word) {
      handleSpellingSuccess();
    } else {
      handleSpellingFailure();
    }
  };

  // Engagement Click Check
  const handleCheckScrambledWord = () => {
    const spelled = spelledLetters.join('');
    if (spelled === word) {
      handleSpellingSuccess();
    } else {
      handleSpellingFailure();
    }
  };

  const handleSpellingSuccess = () => {
    setHasSpelledCorrectly(true);
    setErrorMessage('');
    
    const feedbackOptions = [
      {
        text: '🎉 Brilliant! You spelled it correctly!',
        speech: 'Fantastic spelling! Well done!'
      },
      {
        text: '🌟 Superb! That is correct spelling!',
        speech: 'Super job! You are a spelling star!'
      },
      {
        text: '🏆 Outstanding! Perfect spelling!',
        speech: 'Outstanding! You got it exactly right!'
      }
    ];
    
    const selected = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
    setSuccessMessage(selected.text);
    speakLively(selected.speech);
    
    // For remedial and engagement, we can succeed immediately
    if (player.tier !== 'enrichment') {
      setTimeout(() => {
        onSuccess(1);
      }, 2000);
    }
  };

  const handleSpellingFailure = () => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (nextAttempts >= maxAttempts) {
      setErrorMessage(`Good try! The correct spelling is: ${tile.word.toLowerCase()}`);
      setTimeout(() => {
        onFailure();
      }, 3500);
    } else {
      setErrorMessage(`Oops! That's not quite right. Try again! (Attempt ${nextAttempts}/${maxAttempts})`);
      // Reset spelled trays
      if (player.tier === 'engagement') {
        setSpelledLetters(prev => {
          const reset = new Array(word.length).fill('');
          if (word.length > 0) reset[0] = word[0]; // Keep first letter pre-filled for standard pupils
          word.split('').forEach((char, idx) => {
            if (!isLetter(char)) reset[idx] = char;
          });
          return reset;
        });
        setScrambledPool(prev => prev.map(p => ({ ...p, used: false })));
      }
    }
  };

  // Sentence Builder Submit (Enrichment only)
  const handleSubmitSentence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sentence.trim()) return;

    setSentenceLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/check-sentence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: tile.word,
          sentence: sentence,
          playerName: player.name,
        }),
      });

      const data = await res.json();
      setSentenceFeedback(data);

      const feedbackClean = data.feedback.replace(/[^\w\s.,!?'"]/g, ''); // strip emoji for cleaner TTS
      speakLively(feedbackClean);
    } catch (err) {
      console.error(err);
      setErrorMessage('Offline evaluation fallback: sentence accepted.');
      setSentenceFeedback({
        approved: true,
        feedback: "Awesome work! That's a great sentence.",
        stars: 3,
      });
    } finally {
      setSentenceLoading(false);
    }
  };

  const handleFinishEnrichment = () => {
    const totalEarnedStars = 1 + (sentenceFeedback ? sentenceFeedback.stars : 0);
    onSuccess(totalEarnedStars, sentenceFeedback ? {
      word: tile.word,
      sentence: sentence,
      feedback: sentenceFeedback.feedback,
      approved: sentenceFeedback.approved,
      stars: sentenceFeedback.stars,
    } : undefined);
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 p-6 md:p-8 w-full mx-auto overflow-hidden h-full flex flex-col justify-between">
      {/* Target Image & Category Header */}
      <div className="flex flex-col items-center text-center">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 font-mono bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            🌈 Spelling Quest • {player.name}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 font-mono bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            ⭐ {player.tier === 'remedial' ? 'Remedial' : player.tier === 'engagement' ? 'Standard' : 'Enrichment'}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600 font-mono bg-amber-50 px-3 py-1 rounded-full border border-amber-100 animate-pulse">
            🎈 Try {Math.min(attempts + 1, maxAttempts)} of {maxAttempts}
          </span>
        </div>
        
        {/* Large Visual Illustration */}
        <div className="w-40 h-40 md:w-56 md:h-56 bg-slate-50 border-2 border-slate-100/60 rounded-3xl p-4 md:p-6 flex items-center justify-center shadow-inner relative group">
          <SpellingImage word={tile.word} className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-110" />
          
          <button
            onClick={speakWord}
            className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl shadow-md transition-colors"
            title="Hear Pronunciation"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-semibold text-slate-400 capitalize">
            Category: {tile.category}
          </h3>
          <p className="text-xs text-slate-500 italic mt-0.5">
            Click the speaker button to hear me talk!
          </p>
        </div>
      </div>

      {/* Main Dynamic Spelling Interface */}
      <div className="mt-6 border-t border-slate-100 pt-6 flex-1 flex flex-col justify-between">
        
        {/* Spelling Success Display */}
        {hasSpelledCorrectly ? (
          <div className="text-center animate-fade-in flex-grow flex flex-col justify-center">
            <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full mb-3 mx-auto">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>
            <h4 className="text-lg font-bold text-emerald-950">{successMessage}</h4>
            
            {/* Standard Tier Auto-Continues, Enrichment shows Sentence Builder */}
            {player.tier !== 'enrichment' ? (
              <p className="text-xs text-slate-500 mt-2">Saving stars and passing the turn...</p>
            ) : (
              <div className="mt-6 bg-slate-50 p-5 rounded-2xl border border-slate-200/60 text-left">
                <div className="flex items-center gap-1.5 text-amber-600 font-bold text-sm mb-3">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span>Enrichment Challenge: Sentence Builder!</span>
                </div>
                <p className="text-xs text-slate-600 mb-4">
                  Write a nice, complete sentence using the word <span className="font-bold underline text-blue-600">"{tile.word}"</span> to earn up to 3 bonus stars!
                </p>

                {!sentenceFeedback ? (
                  <form onSubmit={handleSubmitSentence} className="space-y-3">
                    <textarea
                      value={sentence}
                      onChange={(e) => setSentence(e.target.value)}
                      placeholder=""
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none bg-[#F8FAFC] font-sans text-slate-800"
                      rows={2}
                      disabled={sentenceLoading}
                    />
                    <button
                      type="submit"
                      disabled={sentenceLoading || !sentence.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-blue-100 cursor-pointer"
                    >
                      {sentenceLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Spelling Buddy is reading...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Sentence for Evaluation</span>
                        </>
                      )}
                    </button>

                    <div className="pt-2 text-center border-t border-slate-100 mt-2">
                      <button
                        type="button"
                        onClick={handleFinishEnrichment}
                        disabled={sentenceLoading}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors py-1 px-3 rounded-lg hover:bg-slate-100 cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>Skip Challenge & Finish Turn</span>
                        <span>➡️</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4 animate-fade-in">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-2">
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-xs font-bold text-slate-500">Teacher's Review</span>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: sentenceFeedback.stars }).map((_, i) => (
                            <Award key={i} className="w-4 h-4 fill-amber-400" />
                          ))}
                          {sentenceFeedback.stars === 0 && <span className="text-xs text-slate-400">0 stars</span>}
                        </div>
                      </div>
                      <p className="text-xs font-medium text-blue-950 italic">
                        "{sentence}"
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed pt-1 whitespace-pre-line font-medium text-slate-700">
                        {sentenceFeedback.feedback}
                      </p>
                    </div>

                    <button
                      onClick={handleFinishEnrichment}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-lg shadow-emerald-100 cursor-pointer"
                    >
                      Awesome! Finish Turn
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-grow flex flex-col justify-between h-full">
            {/* 1. REMEDIAL Tier (Scrambled Correct Letters Only) */}
            {player.tier === 'remedial' ? (
              <div className="space-y-6">
                {/* Spelling Tray Placeholders split by word chunks to prevent awkward, confusing wraps for young children */}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 py-4">
                  {getWordChunks().map((chunk, chunkIdx) => (
                    <div key={chunkIdx} className="flex flex-row gap-1.5 md:gap-2.5 justify-center flex-nowrap">
                      {chunk.map(({ char, originalIndex }) => {
                        const letter = spelledLetters[originalIndex];
                        return (
                          <div
                            key={originalIndex}
                            onClick={() => handleRemoveTrayLetter(originalIndex)}
                            className={`w-10 h-10 md:w-12 md:h-12 border-2 rounded-xl flex items-center justify-center font-black text-lg md:text-xl transition-all ${
                              !isLetter(char)
                                ? 'border-transparent text-slate-400 select-none bg-transparent'
                                : letter
                                ? 'border-blue-400 bg-blue-50 text-blue-900 shadow-sm cursor-pointer hover:bg-blue-100'
                                : 'border-slate-200 border-dashed bg-slate-50/50'
                            }`}
                          >
                            {letter}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Scrambled Letter Pools */}
                <div className="flex flex-wrap justify-center gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                  {scrambledPool.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => handleLetterBubbleClick(item, idx)}
                      disabled={item.used}
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 font-black text-base md:text-lg flex items-center justify-center shadow-md transition-all ${
                        item.used
                          ? 'bg-slate-200 text-slate-400 border-slate-300 scale-90 cursor-not-allowed opacity-30 shadow-none'
                          : wiggleIndex === idx
                          ? 'bg-red-500 text-white border-red-600 animate-wiggle scale-105'
                          : 'bg-white text-slate-800 border-slate-200 hover:scale-110 active:scale-95 hover:border-blue-400 cursor-pointer'
                      }`}
                    >
                      {item.char}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* 2. STANDARD (Engagement) & ENRICHMENT Typing Tier */
              <form onSubmit={handleCheckTypedWord} className="space-y-4">
                {player.tier === 'engagement' && (
                  <div className="flex flex-col items-center gap-2 mb-4 bg-amber-50 p-4 rounded-2xl border border-amber-100 animate-fade-in">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider bg-amber-200/50 px-3 py-1 rounded-full border border-amber-200">
                      ⭐ First Letter Provided ⭐
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-600 font-medium font-sans">Your word starts with:</span>
                      <span className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-md transform hover:scale-105 transition-transform">
                        {word[0]}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 font-mono block text-center">
                    Type the spelling below:
                  </label>
                  <input
                    type="text"
                    value={typedInput}
                    onChange={(e) => {
                      let val = e.target.value.toLowerCase();
                      if (player.tier === 'engagement' && word.length > 0) {
                        // Keep first letter intact
                        if (!val.startsWith(word[0])) {
                          val = word[0] + val;
                        }
                      }
                      setTypedInput(val);
                    }}
                    placeholder={player.tier === 'engagement' ? `type the rest of the word...` : "type spelling here..."}
                    className="w-full p-5 rounded-3xl border-2 border-slate-200 text-lg md:text-2xl font-black text-center lowercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-[#F8FAFC] font-sans"
                    autoFocus
                    autoComplete="off"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!typedInput.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-100 cursor-pointer transform active:scale-[0.98]"
                >
                  Verify Spelling
                </button>
              </form>
            )}

            {/* Error Message Feedback */}
            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-2 text-xs md:text-sm animate-fade-in font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
