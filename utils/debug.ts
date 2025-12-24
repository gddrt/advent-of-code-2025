let iterCounter = 0;

/**
 * Can call this inside an iterating function to find the magnitude of iterations
 * Logs to console on each OoM.
 */
export function countIteration () {
    if (Math.log10(++iterCounter) % 1 === 0) {
        console.log(`Reached ${iterCounter} iterations.`);
    }
}