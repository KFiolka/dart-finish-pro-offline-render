import { ALL_THROWS, FINISH_THROWS, BOGEY_NUMBERS } from './constants';
import { DartThrow, DartPathStep, FinishResult, UserPreferences, MissScenario } from './types';

// --- Helper: Path Ranking ---

/**
 * Bewertet einen Pfad basierend auf Darts-Anzahl und Benutzerpräferenzen.
 * Niedrigerer Wert ist besser.
 */
const rankPath = (path: DartThrow[], prefs: UserPreferences): number => {
  if (!path || path.length === 0) return 99999;

  let cost = 0;
  // Kürzere Wege (weniger Darts) werden stark bevorzugt
  cost += (path.length - 1) * 1000;

  const firstThrow = path[0];
  const lastThrow = path[path.length - 1];

  if (!firstThrow || !lastThrow) return 99999;

  // Bonus für Lieblings-Doppel am Ende
  if (prefs.favoriteDoubles.includes(lastThrow.label)) {
    cost -= 100;
  } else if (['D20', 'D16', 'D10'].includes(lastThrow.label)) {
    cost -= 50; // Bonus für Standard-Doppel
  }

  // Bonus für Lieblings-Triple am Anfang (bei 3 Darts)
  if (path.length === 3 && prefs.favoriteTriples.includes(firstThrow.label)) {
    cost -= 20;
  }

  // Bull-Finish Malus (außer bei 170 oder wenn nötig), da riskanter
  if (lastThrow.type === 'Bull' && path.length > 1) {
    cost += 150;
  }

  return cost;
};

// --- Core Solver ---

const solveRecursively = (
  targetScore: number, 
  dartsLeft: number, 
  currentPath: DartThrow[]
): DartThrow[][] => {
  const validPaths: DartThrow[][] = [];

  // Basis-Fall: Nur noch 1 Dart übrig
  if (dartsLeft === 1) {
    const finisher = FINISH_THROWS.find(t => t.value === targetScore);
    if (finisher) {
      validPaths.push([...currentPath, finisher]);
    }
    return validPaths;
  }

  // Rekursions-Schritt
  // Wir müssen mindestens 2 Punkte (D1) für den/die nächsten Darts übrig lassen
  const maxPossible = targetScore - 2;
  if (maxPossible <= 0) return [];

  // Relevante Würfe filtern, um Performance zu halten
  const candidates = ALL_THROWS.filter(t => t.value <= maxPossible);

  for (const t of candidates) {
    const remaining = targetScore - t.value;
    
    if (dartsLeft === 2) {
       // Dart 1 von 2 -> Der nächste MUSS ein Finish sein
       const finisher = FINISH_THROWS.find(f => f.value === remaining);
       if (finisher) {
           validPaths.push([...currentPath, t, finisher]);
       }
    } else if (dartsLeft === 3) {
        // Dart 1 von 3 -> Dart 2 muss ein Finish übrig lassen
        const maxSub = remaining - 2;
        if (maxSub > 0) {
            const subCandidates = ALL_THROWS.filter(sc => sc.value <= maxSub);
            for (const t2 of subCandidates) {
                const rem2 = remaining - t2.value;
                const finisher = FINISH_THROWS.find(f => f.value === rem2);
                if (finisher) {
                    validPaths.push([...currentPath, t, t2, finisher]);
                }
            }
        }
    }
  }

  return validPaths;
};

/**
 * Findet einen "Setup-Weg" (Punkte scoren), wenn kein Finish möglich ist.
 */
const findBestSetupPath = (score: number, dartsLeft: number, prefs: UserPreferences): DartThrow[] => {
    if (dartsLeft <= 0 || score <= 2) return [];

    const preferred = prefs.favoriteTriples.length > 0 ? prefs.favoriteTriples[0] : 'T20';
    let bestThrow = ALL_THROWS.find(t => t.label === preferred) || ALL_THROWS.find(t => t.label === 'T20');
    
    // Check: Darf nicht zum "Bust" führen (Rest < 2)
    if (!bestThrow || (score - bestThrow.value) < 2) {
        const fallback = ALL_THROWS
            .filter(t => (score - t.value) >= 2)
            .sort((a,b) => b.value - a.value)[0];
        bestThrow = fallback;
    }

    if (!bestThrow) return [];

    const path = [bestThrow];
    if (dartsLeft > 1) {
        path.push(...findBestSetupPath(score - bestThrow.value, dartsLeft - 1, prefs));
    }
    return path;
}

// --- Scenario & Text Generation ---

const calculateMissScenario = (
  intendedPath: DartPathStep[], 
  prefs: UserPreferences
): MissScenario | null => {
  if (!intendedPath || intendedPath.length === 0) return null;

  const first = intendedPath[0];
  if (first.type !== 'Triple') return null;

  const missLabel = `S${first.scoreNumber}`;
  const missThrow = ALL_THROWS.find(t => t.label === missLabel);
  if (!missThrow) return null;

  const startScore = first.remaining + first.value;
  const scoreAfterMiss = startScore - missThrow.value;
  const dartsLeft = intendedPath.length - 1;

  if (dartsLeft < 1) return null;

  let solutions = solveRecursively(scoreAfterMiss, dartsLeft, []);
  
  if (solutions.length === 0) {
      const setupPath = findBestSetupPath(scoreAfterMiss, dartsLeft, prefs);
      let currentRem = scoreAfterMiss;
      const pathSteps: DartPathStep[] = setupPath.map(s => {
          currentRem -= s.value;
          return { ...s, remaining: currentRem };
      });

      return {
          intended: first,
          actual: missThrow,
          remainingPath: pathSteps,
          description: `SZENARIO: ${missThrow.label} STATT ${first.label}\n\nNach dem Treffer in die einfache ${first.scoreNumber} verbleiben ${scoreAfterMiss} Punkte. Ein Finish ist mit ${dartsLeft === 1 ? 'einem Pfeil' : 'zwei Pfeilen'} nicht mehr möglich.\n\nNutzen Sie die restlichen Darts für ein Setup auf ${pathSteps[0]?.label || 'hohe Triples'}, um den Restscore für die nächste Aufnahme zu minimieren.`
      };
  }

  solutions.sort((a, b) => rankPath(a, prefs) - rankPath(b, prefs));
  const bestPath = solutions[0];
  let currentRem = scoreAfterMiss;
  const pathSteps: DartPathStep[] = bestPath.map(s => {
      currentRem -= s.value;
      return { ...s, remaining: currentRem };
  });

  const finishTarget = pathSteps[pathSteps.length - 1].label;
  const isFav = prefs.favoriteDoubles.includes(finishTarget);

  return {
      intended: first,
      actual: missThrow,
      remainingPath: pathSteps,
      description: `SZENARIO: ${missThrow.label} STATT ${first.label}\n\n${isFav ? 'Kein Problem!' : 'Plan B:'} Korrigieren Sie über ${pathSteps[0].label}. Das stellt Ihnen am Ende ${isFav ? 'Ihr Lieblings-Doppel' : 'das Doppel'} ${finishTarget}.`
  };
};

const generateExplanation = (path: DartThrow[], score: number, prefs: UserPreferences): string => {
  if (!path || path.length === 0) return "Keine Analyse möglich.";
  
  const first = path[0];
  const last = path[path.length - 1];

  if (score === 170) {
    return `Das 170er Finish ist das höchste Checkout im Dartsport.\nNur der Weg über T20, T20 und das Bullseye führt hier zum Erfolg. Ein Ausweichen auf andere Doppel ist mathematisch nicht möglich.`;
  }

  if (score >= 130) {
    return `Ein High-Finish erfordert höchste Präzision. Der Weg über ${first.label} ist der mathematisch sicherste, um sich mit drei Darts ein Doppel-Segment zu stellen.`;
  }

  if (path.length === 1) {
    return `Sie stehen direkt auf einem Checkout. ${prefs.favoriteDoubles.includes(last.label) ? 'Genau auf Ihrem Lieblings-Doppel!' : 'Zielen Sie sauber auf das Doppel-Segment.'}`;
  }

  if (path.length === 2 && first.type === 'Single') {
    return `Ein klassischer Zwei-Dart-Weg. Nutzen Sie das große Single-Segment der ${first.scoreNumber}, um sich ${last.label} sicher zu stellen.`;
  }

  if (prefs.favoriteDoubles.includes(last.label)) {
    return `Dieser Weg ist darauf optimiert, Sie auf Ihr bevorzugtes Doppel ${last.label} zu bringen. Konzentrieren Sie sich beim ersten Dart auf ${first.label}.`;
  }

  return `Ein solider Weg zum Checkout auf ${last.label}. Die ersten Darts dienen der Vorbereitung (Setup).`;
};

// --- Main Interface ---

export const getOptimalCheckout = (score: number, prefs: UserPreferences, maxDarts: number = 3): FinishResult => {
  const defaultError = { score, path: [], explanation: "Fehler.", isImpossible: true, missScenarios: [], dartsUsed: 0 };

  try {
    if (score > 170 || score < 2 || BOGEY_NUMBERS.includes(score)) {
      return {
        ...defaultError,
        explanation: score > 170 ? "Score zu hoch." : "Bogey Number - kein Finish möglich.",
      };
    }

    let allPaths: DartThrow[][] = [];
    
    // Versuche küzestmögliche Wege zuerst, aber limitiert durch maxDarts
    for (let d = 1; d <= maxDarts; d++) {
      const paths = solveRecursively(score, d, []);
      if (paths.length > 0) {
        allPaths = paths;
        break;
      }
    }

    if (allPaths.length === 0) {
      // Setup wenn kein Finish möglich ist
      const setup = findBestSetupPath(score, maxDarts, prefs);
      if (setup.length === 0) return { ...defaultError, explanation: "Kein gültiger Weg gefunden." };
      
      let tempScore = score;
      const steps: DartPathStep[] = setup.map(t => {
        tempScore -= t.value;
        return { ...t, remaining: tempScore };
      });

      return {
        score,
        path: steps,
        explanation: "Kein Finish mit den verbleibenden Darts möglich. Nutzen Sie diese Darts für ein optimales Setup.",
        isImpossible: false,
        missScenarios: [],
        dartsUsed: steps.length
      };
    }

    allPaths.sort((a, b) => rankPath(a, prefs) - rankPath(b, prefs));
    const best = allPaths[0];

    let tempScore = score;
    const steps: DartPathStep[] = best.map(t => {
      tempScore -= t.value;
      return { ...t, remaining: tempScore };
    });

    const scenarios: MissScenario[] = [];
    // Szenarien nur berechnen, wenn wir noch mindestens 2 Darts haben
    if (maxDarts >= 2) {
      const scenario = calculateMissScenario(steps, prefs);
      if (scenario) scenarios.push(scenario);
    }

    return {
      score,
      path: steps,
      explanation: generateExplanation(best, score, prefs),
      isImpossible: false,
      missScenarios: scenarios,
      dartsUsed: steps.length
    };

  } catch (e) {
    console.error("Engine Error:", e);
    return defaultError;
  }
};
