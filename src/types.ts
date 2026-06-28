export type PupilTier = 'remedial' | 'engagement' | 'enrichment';

export interface Player {
  id: string;
  name: string;
  avatarColor: string; // Tailwind color class e.g., 'bg-red-500'
  avatarIcon: string;  // Icon key from Lucide
  tier: PupilTier;
  position: number;    // 0 to 29
  stars: number;
  correctSpells: number;
  totalAttempts: number;
  completed: boolean;
  sentences: { word: string; sentence: string; feedback: string; approved: boolean; stars: number }[];
}

export type GamePhase = 'lobby' | 'playing' | 'spelling' | 'sentence_challenge' | 'finished';

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  phase: GamePhase;
  isRolling: boolean;
  diceResult: number | null;
  targetPosition: number | null;
  spellingWord: string | null;
  spellingAttempts: number;
  showCorrectAnswer: boolean;
  sentenceInput: string;
  sentenceLoading: boolean;
  sentenceFeedback: {
    approved: boolean;
    feedback: string;
    stars: number;
  } | null;
  winnerId: string | null;
}

export interface BoardTile {
  index: number;       // 0 to 29
  label: string;       // Text displayed on board
  word: string;        // Vocabulary word to spell
  category: 'start' | 'school' | 'toy' | 'number' | 'animal' | 'finish';
  color: string;       // BG color class
  gridRow: number;     // 0-5
  gridCol: number;     // 0-4
  arrowDirection?: 'left' | 'right' | 'up' | 'down';
}
