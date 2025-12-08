import { readLines } from "../utils/file";

export async function partOne() {
    const lines = await readLines("../inputs/07.txt");
    // Find the first splitter
    const results = lines.reduce(({beams, splits}, line) => {
        let newBeams = new Set<number>();
        for (const beam of beams) {
            if (line.charAt(beam) === "^") {
                newBeams.add(beam-1);
                newBeams.add(beam+1);
                splits += 1;
            } else {
                newBeams.add(beam);
            }
        }
        return {
            beams: newBeams,
            splits
        }
    }, {
        beams: new Set([lines[0]!.indexOf('S')]),
        splits: 0
    })

    return results.splits;
}

export async function partTwo() {
    // It's easier to work backwards.
    // So what we do is count every column backwards,
    // merging timeline counts on each splitter,
    // and then take only the column that comes out of the start.

    const lines = await readLines("../inputs/07.txt");

    const beams = Array(lines[0]!.length).fill(1);

    // reduce from the bottom up
    const finalLines = lines.reduceRight((a, x) => {
        const newBeams = [...a];
        for (let i=0; i<a.length; i++) {
            // If the next column is a splitter, _overwrite_ its timelines
            // What you want to do is add the left and right splits
            // And discard the bottom, because nothing can come out the bottom of a splitter.
            if (x[i+1] === "^") newBeams[i+1] = a[i];
            if (x[i-1] === "^") newBeams[i-1] += a[i];
        }
        return newBeams;
    }, beams)

    // Now that we have the final total of timelines for each column, find the one with
    // the start.
    return finalLines[lines[0]?.indexOf("S")!]

}