/**
 * Fog-of-War Engine -- Progressive Disclosure for Step Next
 *
 * Computes the visual state for each step based on user progress.
 * This is a pure view-layer transformation; it does NOT mutate the data model.
 *
 * Visual state rules (applied to sorted, incomplete steps):
 *   1. All completed steps             -> "completed"
 *   2. First incomplete step           -> "active"   (pulsing, primary CTA)
 *   3. Second incomplete step          -> "available" (70% opacity, tappable)
 *   4. Third incomplete step           -> "locked"   (title visible, lock icon)
 *   5. Fourth+ incomplete steps        -> "hidden"   (blurred silhouette)
 */

/**
 * Computes the visual state for each step based on its position
 * relative to the user's progress.
 *
 * @param {Array} steps - array of step objects (any order)
 * @returns {Array} new array of steps sorted by `order`, each with an added `visualState` property
 */
export function computeVisualStates(steps) {
  if (!steps || steps.length === 0) return [];

  const sorted = [...steps].sort((a, b) => a.order - b.order);
  let incompleteCount = 0;

  return sorted.map((step) => {
    if (step.completed) {
      return { ...step, visualState: 'completed' };
    }

    incompleteCount++;

    if (incompleteCount === 1) {
      return { ...step, visualState: 'active' };
    }
    if (incompleteCount === 2) {
      return { ...step, visualState: 'available' };
    }
    if (incompleteCount === 3) {
      return { ...step, visualState: 'locked' };
    }
    return { ...step, visualState: 'hidden' };
  });
}

/**
 * Returns the count of hidden steps for display in the progress indicator.
 *
 * @param {Array} stepsWithStates - output of computeVisualStates
 * @returns {number}
 */
export function countHiddenSteps(stepsWithStates) {
  return stepsWithStates.filter((s) => s.visualState === 'hidden').length;
}

/**
 * Detects which steps were "revealed" (promoted from hidden/locked to a
 * more visible state) after a completion event.
 *
 * Compare previous and current visual states to find steps that transitioned
 * from a fog state (hidden/locked) into a visible state (active/available/locked).
 *
 * @param {Array} prevStates - previous computeVisualStates result
 * @param {Array} nextStates - new computeVisualStates result
 * @returns {Array<string>} array of step IDs that were revealed
 */
export function findRevealedStepIds(prevStates, nextStates) {
  if (!prevStates || !nextStates) return [];

  const prevMap = new Map(prevStates.map((s) => [s.id, s.visualState]));
  const revealed = [];

  for (const step of nextStates) {
    const prevState = prevMap.get(step.id);
    if (!prevState) continue;

    // Step moved from a fog state to a more visible state
    const wasFogged = prevState === 'hidden' || prevState === 'locked';
    const isNowVisible =
      step.visualState === 'active' ||
      step.visualState === 'available' ||
      step.visualState === 'locked';

    // locked -> locked is NOT a reveal (no change)
    // hidden -> locked IS a reveal
    // hidden -> available IS a reveal
    // locked -> available IS a reveal
    // locked -> active IS a reveal
    if (wasFogged && isNowVisible && prevState !== step.visualState) {
      revealed.push(step.id);
    }
  }

  return revealed;
}
