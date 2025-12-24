/*
idea
reduce (or expand idk) combinations of shapes. find most efficient ones. efficiency would be measured by rectangle size.

you can filter some bunk answers this way
level 0: count the total area
level 1: count the total fit w/o moving/'tating
*/

import { readLines } from "../utils/file";

export async function partOne() {
    /*
    To figure out how to approach this problem, we'll sort into 3 buckets
    1: Impossible: Present area > tree area
    2: Trivially possible: Number of 3x3 squares under tree >= Number of presents
       (All present shapes fit in a 3x3 area)
    3: TBD: Neither is true, meaning the presents do not fit naively,
       but might with some optimizing.
    */
    const problems = (await readLines('../inputs/12.txt'))
        .map(x => {
            const matches = x.match(/(\d+)x(\d+):\s([\d\s]+)/);
            if (!matches?.length || matches.length < 4) return null;

            const dimensions = [matches[1], matches[2]].map(Number) as [number, number]
            return {
                dimensions,
                area: dimensions[0] * dimensions[1],
                squares: Math.floor(dimensions[0] / 3) * Math.floor(dimensions[1] / 3),
                amount: matches[3]!.split(' ').map(Number)
            }
        }).filter(x => x !== null)

    // we should read the shapes from the input, but we don't have to
    // for now, only worry about area.
    const shapes = [5, 6, 7, 7, 7, 7];
    const results = {
        'valid': 0,
        'invalid': 0,
        'unknown': 0
    };

    for (const prob of problems) {
        const presentArea = prob.amount.reduce((a, x, i) => a + x * shapes[i]!, 0);
        if (presentArea > prob.area) {
            results.invalid++;
            continue;
        }

        if (prob.amount.reduce((a, x) => a + x) <= prob.squares) {
            results.valid++;
            continue;
        }

        results.unknown++;
    }

    return results;
}