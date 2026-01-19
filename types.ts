export type ThrowType = 'Single' | 'Double' | 'Triple' | 'Bull' | 'SingleBull';

export interface DartThrow {
  label: string;
  value: number;
  multiplier: 1 | 2 | 3;
  type: ThrowType;
  scoreNumber: number; // 1-20 or 25
}

export interface DartPathStep extends DartThrow {
  remaining: number; // Score remaining AFTER this throw
}

export interface MissScenario {
  intended: DartThrow;
  actual: DartThrow;
  remainingPath: DartPathStep[]; // The path for the remaining 2 darts
  description: string;
}

export interface FinishResult {
  score: number;
  path: DartPathStep[];
  explanation: string;
  isImpossible: boolean;
  missScenarios: MissScenario[];
  dartsUsed: number;
}

export interface UserPreferences {
  favoriteDoubles: string[]; // e.g., ["D20", "D16"]
  favoriteTriples: string[]; // e.g., ["T20", "T19"]
}