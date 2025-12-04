import { readFile } from "../utils/file";

type Range = [number, number]

function isFakeDouble(n: number) {
    // Convert number to string
    const stringy = n.toString();

    // Number must have even digits to repeat twice
    if (stringy.length % 2 !== 0) return false;

    // Split number into two equal parts and see if they are the same
    const length = stringy.length / 2;
    return (stringy.substring(0, length) === stringy.substring(length))
}

function isFakeMulti(n: number) {
    // Convert number to string
    const stringy = n.toString();
    for (let i=1; i<=stringy.length/2; i++) {
        // minor optimization, must be evenly divisible to be repeating
        if (stringy.length % i !== 0) continue;
        // If pattern is repeating, splitting on the pattern will result in 
        // an array of empty strings
        if (stringy.split(stringy.substring(0, i)).filter(x => x.length).length === 0) return true;
    }
    return false;
}

async function baseFunction(wrappedFn: (n: number) => boolean) {
    // inputs are inclusive ranges in "123-456" format
    const inputs = (await readFile("../inputs/02.txt")).split(',').map((x: string): Range => x.split('-', 2).map(Number) as Range);
    const invalidSum = inputs.reduce((a: number, x: Range) => {
        let amountToAdd = 0;
        for (let i=x[0]; i<=x[1]; i++) {
            if (wrappedFn(i)) amountToAdd += i;
        }
        return a + amountToAdd;
    }, 0)

    return invalidSum;
}

export async function partOne() { return baseFunction(isFakeDouble); }
export async function partTwo() { return baseFunction(isFakeMulti); }
