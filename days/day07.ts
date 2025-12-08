import { readLines } from "../utils/file";

async function getLines() {
    // minor optimization -- we can ignore the spacer lines
    return (await readLines("../inputs/07.txt")).filter(x => x.match(/[^\.]/));
}

export async function partOne() {
    const lines = await getLines();

    // we don't really need to think about this graphically
    // Iterate through the lines, if there's a beam at the same index as a splitter,
    // then the beam splits
    const results = lines.reduce(({beams, splits}, line) => {
        // re-create the set of beams each run, easier than mutating
        let newBeams = new Set<number>();
        for (const beam of beams) {
            if (line.charAt(beam) === "^") {
                // If there's a splitter, the next line has a beam to the left and right of it.
                newBeams.add(beam-1);
                newBeams.add(beam+1);
                splits += 1;
            } else {
                // Otherwise, the next line has one beam at the same index.
                newBeams.add(beam);
            }
        }
        return {
            beams: newBeams,
            splits
        }
    }, {
        beams: new Set([lines[0]!.indexOf('S')]), // initial beam
        splits: 0
    })

    return results.splits;
}

export async function partTwo() {
    // It's easier to work backwards.
    // So what we do is count every column backwards,
    // merging timeline counts on each splitter,
    // and then take only the column that comes out of the start.

    const lines = await getLines();

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