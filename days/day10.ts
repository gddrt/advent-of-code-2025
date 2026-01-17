import { readLines } from "../utils/file";
import solver from "javascript-lp-solver";
import type { Model, Solution } from "javascript-lp-solver";

type PartTwoInput = {switches: number[][], joltages: number[]}

async function parseInput(fileName: string) {
    const lines = await readLines(fileName);
    return lines
        .map((line) => {
            // Sorry for the indecipherable regex.
            // A sample line is
            // [.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
            // Separate that into the three parts.
            // (note: this regex is not _entirely_ accurate -- it doesn't
            //  validate the syntax perfectly, but we can trust the input)
            const matches = line
                .match(/^\[([\.#]+)\]\s([\(\)\d,\s]+)\s\{([\d,]+)\}$/)

            // There are 3 groups; matches[0] is the entire line.
            if (matches?.length !== 4) throw Error("Bad input!");
            
            // This problem requires bitwise operations. In javascript
            // that's done on integers (well, numbers)

            // properly, the bits should be read right-to-left. But
            // it doesn't actually matter.

            // The indicator lights. # on, . off
            const lights = Array.from(matches[1]!).reduce((a, x, i) => {
                if (x === '#') return a + Math.pow(2, i);
                return a
            }, 0)

            // The switches.
            const switches = matches[2]?.split(' ').map((x) => {
                // x = one switch group, eg. "(1,2)"
                return x.substring(1, x.length-1) // trim parentheses
                    .split(',')
                    .reduce((a, x) => {
                        return a + Math.pow(2, Number(x))
                    }, 0)
            });
            // Type-narrowing (and error-checking)
            if (switches === undefined) throw Error("You didn't read your switches well.");
            
            return {
                lights,
                switches
            }
        })
}

export async function partOne() {
    const lines = await parseInput('../inputs/10.txt');

    const fewestSum = lines.reduce((a, { lights, switches }) => {
        // Track all the switch results we've already seen (starting
        // with 0, eg. all off.)
        const seen = new Set<number>([0]);

        // Track the results we are currently calculating
        let activeCombos = new Set<number>([0]);

        // For each "active" switch result, calculate all permutations
        // (eg. what happens if we press every switch)
        // If we encounter a duplicate result, we can stop calculating
        // because we know there is a more efficient way to arrive there.
        // Keep iterating until we find an answer.
        let iterCount = 0;
        while (iterCount < 100000) {
            iterCount++;
            const newCombos = new Set<number>();

            for (const combo of activeCombos) {
                for (const single of switches) {
                    const result = combo ^ single; // bitwise XOR

                    // We found a combo that turns everything on
                    // Success!
                    if (result === lights) return a + iterCount;

                    // We found a result we've already checked.
                    // We can ignore it, because we are already
                    // looking at all future permutations of it.
                    if (seen.has(result)) continue;

                    // We found a new result.
                    seen.add(result);
                    newCombos.add(result);
                }
            }
            if (newCombos.size === 0) {
                // We failed, no new combinations to try.
                throw new Error(`We failed! (Iterations: ${iterCount})`)
            }
            
            // We didn't succeed this iteration, try again.
            activeCombos = newCombos;
        }

        throw Error("Infinite loop? Failed after 100k iterations");
    }, 0);

    return fewestSum;
}

async function parseInputTwo(fileName: string): Promise<PartTwoInput[]> {
    const lines = await readLines(fileName);
    return lines
        .map((line) => {
            // Sorry for the indecipherable regex.
            // A sample line is
            // [.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
            // Separate that into the three parts.
            // (note: this regex is not _entirely_ accurate -- it doesn't
            //  validate the syntax perfectly, but we can trust the input)
            const matches = line
                .match(/^\[([\.#]+)\]\s([\(\)\d,\s]+)\s\{([\d,]+)\}$/)

            // There are 3 groups; matches[0] is the entire line.
            if (matches?.length !== 4) throw Error("Bad input!");
            
            // Part two doesn't work with bitwise.

            // The switches.
            const switches = matches[2]?.split(' ').map((x) => {
                // x = one switch group, eg. "(1,2)"
                return x.substring(1, x.length-1) // trim parentheses
                    .split(',')
                    .map(Number)
            });

            // The joltages
            const joltages = matches[3]?.split(',').map(Number)

            // Type-narrowing (and error-checking)
            if (switches === undefined || joltages === undefined) throw Error("You didn't read your input well.");

            return { switches, joltages }
        })
}

function solveLPProblem( line: PartTwoInput ) {
    // Construct a model instance with the correct parameters

    const { switches, joltages } = line; 
    const constraints = Object.fromEntries(joltages.map((x, i) => {
        return [i.toString(), { equal: x }]
    }))
    const variables = Object.fromEntries(switches.map((x, i) => {
        return [
            i.toString(),
            {
                count: 1,
                ...Object.fromEntries(x.map(y => [y.toString(), 1]))
            }
        ]
    }));

    const model: Model = {
        optimize: "count",
        opType: "min",
        constraints,
        variables,
        ints: Object.fromEntries(
            Object.keys(variables).map(x => [x, 1])
        )
    }

    // Assume it's solvable. They wouldn't give us impossible input.
    const { result } = solver.Solve(model) as Solution

    return result;
}

export async function partTwo() {
    const lines = await parseInputTwo('../inputs/10.txt');

    return lines.reduce((a, x) => a + solveLPProblem(x), 0);
}