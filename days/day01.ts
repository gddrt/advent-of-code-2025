import { readLines } from "../utils/file";

type Direction = "R" | "L";

export async function partOne() {
    const lines = await readLines("../inputs/01.txt");

    let zeroCounts = 0;

    lines.reduce((a: number, x: string) => {
        const direction = x.substring(0, 1) as Direction;
        const value = Number(x.substring(1)) * (direction === "R" ? 1 : -1) ;
        const remainder = (a + value) % 100;
        if (remainder === 0) zeroCounts += 1;
        return remainder;
    }
    , 50)

    return zeroCounts;
}

export async function partTwo() {
    const lines = await readLines("../inputs/01.txt");

    let zeroClicks = 0;

    lines.reduce((a: number, x: string) => {
        const direction = x.substring(0, 1) as Direction;
        const absValue = Number(x.substring(1))
        // Do nothing if we don't move the dial
        if (absValue === 0) return a;

        // Count all full spins first
        zeroClicks += Math.floor(absValue / 100)

        // Take only the leftover value
        const leftValue = (absValue * (direction === "R" ? 1 : -1)) % 100;

        // Maybe count one last spin. But only if we didn't start at zero
        if (a !== 0 && (a + leftValue <= 0 || a + leftValue >= 100)) zeroClicks += 1;

        let remainder = (a + leftValue) % 100;
        if (remainder < 0) remainder += 100;

        return remainder;
    }
    , 50)

    return zeroClicks;
}
