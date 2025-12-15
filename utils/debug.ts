let iterCounter = 0;

export function countIteration () {
    if (Math.log10(++iterCounter) % 1 === 0) {
        console.log(`Reached ${iterCounter}`);
    }
}