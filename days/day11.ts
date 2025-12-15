import { readLines } from "../utils/file";

async function parseInput(): Promise<{
    [key: string]: string[]
}> {
    const lines = await readLines('../inputs/11.txt');
    return Object.fromEntries(
        lines.map(x => {
            const [key, values] = x.split(': ') as [string, string];
            return [key, values.split(' ')]
        })
    );
}

export async function partOne() {
    const connections = await parseInput();
    const recursivePather = (key: string): number => {
        if (connections[key]![0] === 'out') return 1;
        return connections[key]!.reduce((a, x) => a + recursivePather(x), 0)
    }

    return recursivePather('you')
}

export async function partTwo() {
    const connections = await parseInput();

    // We can't use naïve recursion here, there are too many permutations.
    // We need to memoize results.
    const connectionMap: {
        [key: string]: number
    } = {};

    // Similar to part one, but we have to track whether we visited both "dac" and "fft"
    const recursivePather = (
        key: string,
        dac: boolean = false,
        fft: boolean = false
    ): number => {
        // If we've reached the end, only count the permutation
        // if both dac and fft were visited. Otherwise 0.
        if (connections[key]![0] === 'out') return (dac && fft) ? 1 : 0;

        // Our cache key is the branch name, and whether we have yet visited dac and fft.
        const connectionKey = `${key}-${dac ? 1 : 0}${fft ? 1 : 0}`;
        // (this is a _bit_ expensive, so it's more efficient to do after the easy end check)
        if (connectionMap[connectionKey] !== undefined) return connectionMap[connectionKey];

        // since we need to do many more permutations after this, cache the result.
        const result = connections[key]!.reduce((a, x) => a + recursivePather(
            x,
            dac || x === "dac",
            fft || x === "fft"
        ), 0);
        connectionMap[connectionKey] = result;
        return result;
    }

    return recursivePather('svr');
}
