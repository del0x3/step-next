import { describe, it, expect } from 'vitest';
import {
  computeVisualStates,
  countHiddenSteps,
  findRevealedStepIds,
} from '../fogEngine';

// --- Helpers ---

function makeStep(overrides) {
  return {
    id: String(Math.random()).slice(2, 10),
    title: 'Step',
    description: '',
    type: 'free',
    milestone: null,
    completed: false,
    order: 0,
    ...overrides,
  };
}

function makeSteps(count, completedCount = 0) {
  return Array.from({ length: count }, (_, i) =>
    makeStep({ id: `s${i}`, order: i, completed: i < completedCount })
  );
}

// --- computeVisualStates ---

describe('computeVisualStates', () => {
  it('should return empty array for empty input', () => {
    expect(computeVisualStates([])).toEqual([]);
  });

  it('should return empty array for null/undefined input', () => {
    expect(computeVisualStates(null)).toEqual([]);
    expect(computeVisualStates(undefined)).toEqual([]);
  });

  it('should mark single incomplete step as active', () => {
    const steps = [makeStep({ id: 's0', order: 0, completed: false })];
    const result = computeVisualStates(steps);
    expect(result).toHaveLength(1);
    expect(result[0].visualState).toBe('active');
  });

  it('should mark single completed step as completed', () => {
    const steps = [makeStep({ id: 's0', order: 0, completed: true })];
    const result = computeVisualStates(steps);
    expect(result).toHaveLength(1);
    expect(result[0].visualState).toBe('completed');
  });

  it('should mark all completed steps as completed', () => {
    const steps = makeSteps(5, 5);
    const result = computeVisualStates(steps);
    expect(result.every((s) => s.visualState === 'completed')).toBe(true);
  });

  it('should assign correct states for a typical progression', () => {
    // 2 completed, 5 incomplete
    const steps = makeSteps(7, 2);
    const result = computeVisualStates(steps);

    expect(result[0].visualState).toBe('completed'); // s0
    expect(result[1].visualState).toBe('completed'); // s1
    expect(result[2].visualState).toBe('active'); // s2 - first incomplete
    expect(result[3].visualState).toBe('available'); // s3 - second incomplete
    expect(result[4].visualState).toBe('locked'); // s4 - third incomplete
    expect(result[5].visualState).toBe('hidden'); // s5 - fourth+
    expect(result[6].visualState).toBe('hidden'); // s6 - fourth+
  });

  it('should assign active+available+locked for exactly 3 incomplete', () => {
    const steps = makeSteps(5, 2); // 2 completed, 3 incomplete
    const result = computeVisualStates(steps);

    expect(result[2].visualState).toBe('active');
    expect(result[3].visualState).toBe('available');
    expect(result[4].visualState).toBe('locked');
  });

  it('should assign active+available for exactly 2 incomplete', () => {
    const steps = makeSteps(4, 2); // 2 completed, 2 incomplete
    const result = computeVisualStates(steps);

    expect(result[2].visualState).toBe('active');
    expect(result[3].visualState).toBe('available');
  });

  it('should sort steps by order regardless of input order', () => {
    const steps = [
      makeStep({ id: 's2', order: 2, completed: false }),
      makeStep({ id: 's0', order: 0, completed: true }),
      makeStep({ id: 's1', order: 1, completed: false }),
    ];
    const result = computeVisualStates(steps);

    expect(result[0].id).toBe('s0');
    expect(result[0].visualState).toBe('completed');
    expect(result[1].id).toBe('s1');
    expect(result[1].visualState).toBe('active');
    expect(result[2].id).toBe('s2');
    expect(result[2].visualState).toBe('available');
  });

  it('should not mutate the original array', () => {
    const steps = makeSteps(3, 1);
    const original = [...steps];
    computeVisualStates(steps);
    expect(steps).toEqual(original);
  });

  it('should not persist visualState on the original step objects', () => {
    const steps = makeSteps(3, 1);
    computeVisualStates(steps);
    expect(steps[0].visualState).toBeUndefined();
    expect(steps[1].visualState).toBeUndefined();
  });

  it('should handle no completed steps (all incomplete)', () => {
    const steps = makeSteps(5, 0);
    const result = computeVisualStates(steps);

    expect(result[0].visualState).toBe('active');
    expect(result[1].visualState).toBe('available');
    expect(result[2].visualState).toBe('locked');
    expect(result[3].visualState).toBe('hidden');
    expect(result[4].visualState).toBe('hidden');
  });

  it('should handle the demo data pattern: 1 completed, 3 incomplete with locked type', () => {
    const steps = [
      makeStep({ id: 's0', order: 0, type: 'current', completed: true }),
      makeStep({ id: 's1', order: 1, type: 'free', completed: false }),
      makeStep({ id: 's2', order: 2, type: 'milestone', completed: false }),
      makeStep({ id: 's3', order: 3, type: 'locked', completed: false }),
    ];
    const result = computeVisualStates(steps);

    expect(result[0].visualState).toBe('completed');
    expect(result[1].visualState).toBe('active');
    expect(result[2].visualState).toBe('available');
    expect(result[3].visualState).toBe('locked');
  });
});

// --- countHiddenSteps ---

describe('countHiddenSteps', () => {
  it('should return 0 when no steps are hidden', () => {
    const steps = makeSteps(3, 1);
    const result = computeVisualStates(steps);
    expect(countHiddenSteps(result)).toBe(0);
  });

  it('should count hidden steps correctly', () => {
    const steps = makeSteps(7, 2);
    const result = computeVisualStates(steps);
    // Steps 5 and 6 (fourth+ incomplete) are hidden
    expect(countHiddenSteps(result)).toBe(2);
  });

  it('should return 0 when all steps are completed', () => {
    const steps = makeSteps(5, 5);
    const result = computeVisualStates(steps);
    expect(countHiddenSteps(result)).toBe(0);
  });

  it('should return 0 for empty array', () => {
    expect(countHiddenSteps([])).toBe(0);
  });
});

// --- findRevealedStepIds ---

describe('findRevealedStepIds', () => {
  it('should return empty array when no reveals happen', () => {
    const prev = computeVisualStates(makeSteps(3, 1));
    const next = computeVisualStates(makeSteps(3, 1));
    expect(findRevealedStepIds(prev, next)).toEqual([]);
  });

  it('should detect step revealed from hidden to locked', () => {
    // Before: s0 completed, s1 active, s2 available, s3 locked, s4 hidden
    const before = makeSteps(5, 1);
    const prevStates = computeVisualStates(before);

    // After: s0 completed, s1 completed, s2 active, s3 available, s4 locked
    const after = makeSteps(5, 2);
    const nextStates = computeVisualStates(after);

    const revealed = findRevealedStepIds(prevStates, nextStates);
    // s4 went from hidden to locked
    expect(revealed).toContain('s4');
  });

  it('should detect step revealed from locked to available', () => {
    const before = makeSteps(4, 1);
    const prevStates = computeVisualStates(before);
    // s0 completed, s1 active, s2 available, s3 locked

    const after = makeSteps(4, 2);
    const nextStates = computeVisualStates(after);
    // s0 completed, s1 completed, s2 active, s3 available

    const revealed = findRevealedStepIds(prevStates, nextStates);
    // s3 went from locked to available
    expect(revealed).toContain('s3');
  });

  it('should detect step revealed from hidden to available', () => {
    // 6 steps, 1 completed => s1 active, s2 available, s3 locked, s4 hidden, s5 hidden
    const before = makeSteps(6, 1);
    const prevStates = computeVisualStates(before);

    // 6 steps, 3 completed => s3 active, s4 available, s5 locked
    const after = makeSteps(6, 3);
    const nextStates = computeVisualStates(after);

    const revealed = findRevealedStepIds(prevStates, nextStates);
    expect(revealed).toContain('s4');
    expect(revealed).toContain('s5');
  });

  it('should handle null prev/next gracefully', () => {
    expect(findRevealedStepIds(null, null)).toEqual([]);
    expect(findRevealedStepIds(null, [])).toEqual([]);
    expect(findRevealedStepIds([], null)).toEqual([]);
  });

  it('should not count a step staying in the same state as revealed', () => {
    // locked -> locked should NOT be a reveal
    const steps5 = makeSteps(5, 0);
    const prev = computeVisualStates(steps5);
    // s0 active, s1 available, s2 locked, s3 hidden, s4 hidden

    // Complete only a different step -- but in our linear model, let's check:
    // If nothing changes, no reveals
    const next = computeVisualStates(steps5);
    expect(findRevealedStepIds(prev, next)).toEqual([]);
  });
});
