import { readLines } from "../utils/file";

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

async function partOne() {
    // idea: use memoization.
    // on starting state, run each switch and save the output to a map

    const lines = await parseInput('../inputs/10.txt');

    const fewestSum = lines.reduce((a, { lights, switches }) => {
        const switchMap: {
            [key: number]: number
        } = {}
        switchMap[0] = 0;

        // maybe i don't need memoization. maybe I just need to keep track
        // of combos I've seen, because necessarily, duplicating a combo
        // is inefficient

        const seen = new Set<number>([0]);
        let activeCombos = new Set<number>([0]);

        let iterCount = 0;
        while (iterCount < 100000) {
            iterCount++;
            const newCombos = new Set<number>();

            for (const combo of activeCombos) {
                for (const single of switches) {
                    const result = combo ^ single;
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