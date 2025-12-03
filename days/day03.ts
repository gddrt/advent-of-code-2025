import { readLines } from "../utils/file";

function getHighestJoltage(line: string) {
    // We have to make the highest "joltage" with two digits in order.
    // The way to do that is to take the first instance of the highest digit.
    const digits = line.split('').map(Number);
    // Don't check the last digit; we need a second digit.
    const highestDigit = Math.max(...digits.slice(0, -1));
    // Find the first instance of the highest digit
    const highestDigitIndex = digits.indexOf(highestDigit);
    // Find the highest leftover digit
    const highestLeftoverDigit = Math.max(...digits.slice(highestDigitIndex + 1));
    // Put them together.
    return highestDigit * 10 + highestLeftoverDigit;
}

function getHighestOverrideJoltage(line: string, joltageDigits: number = 12) {
    // Basically the same as the first part, with some more looping
    const digits = line.split('').map(Number);

    let composedJoltage = 0;
    let lastIndex = 0;
    for (let i=0; i<joltageDigits; i++) {
        // Find the highest digit between (lastIndex) and (-n from the end)
        // where n is the number of digits we still need
        // || undefined is because Array.slice(end=0) gives an empty array.
        const sliceEnd = -(joltageDigits - i - 1) || undefined;
        const sliced = digits.slice(lastIndex, sliceEnd);
        const highestDigit = Math.max(...sliced);

        // Find the first instance of the highest digit.
        // Add lastIndex so that the index is relative to the complete line, not the slice.
        const highestDigitIndex = sliced.indexOf(highestDigit) + lastIndex;

        // Add the digit to our total joltage
        composedJoltage += Math.pow(10, (joltageDigits-1-i)) * highestDigit;

        // Save the lastIndex for our next slice
        lastIndex = highestDigitIndex + 1;
    }
    return composedJoltage;
}

async function baseFunction(fn: (line: string) => number) {
    const lines = await readLines('../inputs/03.txt');
    const joltageSum = lines.reduce((a, x) => a + fn(x), 0)
    return joltageSum;
}

export async function partOne () { return baseFunction(getHighestJoltage); }
export async function partTwo () { return baseFunction(getHighestOverrideJoltage); }