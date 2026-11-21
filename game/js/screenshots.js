// Deterministic showcase states used to capture honest renders of the running game.
// These are also handy for reviewing a room without hunting for every difference first.
export const SHOT_PRESETS = {
  cover: {
    caseIndex: 1,
    found: [0, 2, 4, 5, 8, 10],
    remaining: 128,
    hintsLeft: 2,
    hintText: 'Six differences found. Six more are keeping very still.',
  },
  library: {
    caseIndex: 0,
    found: [1, 2, 4, 6, 8],
    remaining: 73,
    hintsLeft: 2,
    hintIndex: 9,
  },
  conservatory: {
    caseIndex: 2,
    found: [0, 1, 3, 6, 9, 12],
    remaining: 51,
    hintsLeft: 1,
    hintIndex: 4,
  },
  clear: {
    caseIndex: 0,
    found: 'all',
    remaining: 68,
    hintsLeft: 2,
    showClear: true,
  },
  final: {
    caseIndex: 2,
    found: 'all',
    remaining: 44,
    hintsLeft: 1,
    showFinal: true,
  },
};

export function readShotPreset(search = window.location.search) {
  const params = new URLSearchParams(search);
  const name = params.get('shot');
  if (!name) return null;
  return { ...(SHOT_PRESETS[name] || SHOT_PRESETS.cover), name };
}
