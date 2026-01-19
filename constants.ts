import { DartThrow } from './types';

// Bogey numbers (impossible to check out with 3 darts)
export const BOGEY_NUMBERS = [169, 168, 166, 165, 163, 162, 159];

// Generate all possible throws on a board
export const ALL_THROWS: DartThrow[] = [];

// 1. Singles, Doubles, Triples (1-20)
for (let i = 1; i <= 20; i++) {
  ALL_THROWS.push({ label: `S${i}`, value: i, multiplier: 1, type: 'Single', scoreNumber: i });
  ALL_THROWS.push({ label: `D${i}`, value: i * 2, multiplier: 2, type: 'Double', scoreNumber: i });
  ALL_THROWS.push({ label: `T${i}`, value: i * 3, multiplier: 3, type: 'Triple', scoreNumber: i });
}

// 2. Bulls
ALL_THROWS.push({ label: '25', value: 25, multiplier: 1, type: 'SingleBull', scoreNumber: 25 });
ALL_THROWS.push({ label: 'Bull', value: 50, multiplier: 2, type: 'Bull', scoreNumber: 25 });

// valid finish throws (Doubles and Bullseye)
export const FINISH_THROWS = ALL_THROWS.filter(t => t.type === 'Double' || t.type === 'Bull');

// Default user preferences
export const DEFAULT_PREFS = {
  favoriteDoubles: ['D20', 'D16', 'D10', 'D8'],
  favoriteTriples: ['T20', 'T19', 'T18']
};