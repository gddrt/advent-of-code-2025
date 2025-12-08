import { readLines } from "../utils/file";

type Range = [number, number]
async function parseInput(): Promise<{
    ranges: Range[],
    ingredients: number[]
}> {
    const lines = await readLines('../inputs/05toy.txt');
    const ranges = lines
        .filter(x => x.match(/^\d+-\d+$/))
        .map(x => x.split('-').map(Number) as Range)
    const ingredients = lines
        .filter(x => x.match(/^\d+$/))
        .map(Number)

    return { ranges, ingredients }
}

export async function partOne() {
    const { ranges, ingredients } = await parseInput();

    return ingredients
        .filter(x => {
            for (const [a, b] of ranges) {
                if (x >= a && x <= b) return true
            }
            return false;
        }).length
}

function optimizeRanges(ranges: Range[]) {
    let optimizedRanges: Range[] = [];
    outer:
    for (const [low, high] of ranges) {
        // Check each range we've already added to see if we can "optimize" an existing one.
        for (const optRange of optimizedRanges) {
            let modified = false;
            let original = [...optRange];
            // Lower bound is inside existing range. Maybe extend the upper bound.
            if (low >= optRange[0] - 1 && low <= optRange[1] + 1) {
                optRange[1] = Math.max(optRange[1], high);
                modified = true;
            }
            // Upper bound is inside existing range. Maybe extend the lower bound
            if (high >= optRange[0] - 1 && high <= optRange[1] + 1) {
                optRange[0] = Math.min(optRange[0], low);
                modified = true;
            }

            if (modified) { continue outer; }
        }
        // Did not change; add range to optimized list
        optimizedRanges.push([low, high])
    }

    return optimizedRanges;
}

export async function partTwo() {
    let { ranges } = await parseInput();

    while (true) {
        let begin = ranges.length;
        ranges = optimizeRanges(ranges);
        if (begin === ranges.length) break;
    }

    return ranges.reduce((a, [low, high]) => {
        return a + (high - low) + 1;
    }, 0);
}