import { readLines } from "../utils/file";

type Point = [number, number, number]
type DistanceMap = {
    [key: string]: number
}

function getStraightLineDistance(a: Point, b: Point) {
    return Math.sqrt( a.map((x, i) => Math.pow(x - b[i]!, 2)).reduce((a, x) => a + x));
}

export async function partOne(isActuallyPartTwo=false) {
    // convert lines in format x,y,z to co-ordinate tuples
    const points = (await readLines('../inputs/08.txt')).map(x => x.split(',').map(Number)) as Point[];

    // Record the distance between each point, so we only have to calculate once.
    const distanceMap: DistanceMap = {};

    for (let i=0; i<points.length; i++) {
        for (let j=i+1; j<points.length; j++) {
            distanceMap[`${i}-${j}`] = getStraightLineDistance(points[i]!, points[j]!);
        }
    }

    const sortedDistanceMap = Object.entries(distanceMap)
        .toSorted((a, b) => a[1] - b[1])

    // Find the shortest connections
    const shortestConnections = sortedDistanceMap
        .slice(0, 1000)
        .map(x => x[0].split('-').map(Number)) as [number, number][]

    console.assert(shortestConnections.length === 1000, "You don't have 1000 connections!");

    // now that we have our connection list, need to build the connection maps.

    let connectionMap: (number|undefined)[] = new Array(points.length).fill(undefined);
    const circuits: Set<number>[] = new Array();

    for (const [to, from] of shortestConnections) {
        // If neither box is in a circuit, create one
        if (connectionMap[from] === undefined && connectionMap[to] === undefined) {
            connectionMap[from] = circuits.length;
            connectionMap[to] = circuits.length;
            circuits.push(new Set([from, to]))
        }
        // If both are in a circuit, they should be merged.
        else if (connectionMap[from] !== undefined && connectionMap[to] !== undefined) {
            // But not if it's the same circuit
            if (connectionMap[from] === connectionMap[to]) continue;

            circuits[connectionMap[from]] = circuits[connectionMap[from]]!.union(circuits[connectionMap[to]]!)
            // Clobber the old one with an empty set.
            circuits[connectionMap[to]] = new Set();
            // Update references.
            connectionMap = connectionMap.map(x => x === connectionMap[to] ? connectionMap[from] : x);
        }
        // If only one is in a circuit, the other one should join it
        else if (connectionMap[from] === undefined) {
            circuits[connectionMap[to]!]!.add(from);
            connectionMap[from] = connectionMap[to];
        } else {
            circuits[connectionMap[from]!]!.add(to);
            connectionMap[to] = connectionMap[from];
        }

    }

    // Return the three largest
    if (!isActuallyPartTwo) // andThereforeIsPartOne
    return circuits.map(x => x.size).toSorted((a, b) => b - a).slice(0, 3).reduce((a, x) => a * x);

    // Part two starts from the same point, but just does a bit more work.
    const remainingConnections = Object.entries(distanceMap)
        .toSorted((a, b) => a[1] - b[1])
        .slice(1000)
        .map(x => x[0].split('-').map(Number)) as [number, number][]

    for (const [to, from] of remainingConnections) {
        // If neither box is in a circuit, create one
        if (connectionMap[from] === undefined && connectionMap[to] === undefined) {
            connectionMap[from] = circuits.length;
            connectionMap[to] = circuits.length;
            circuits.push(new Set([from, to]))
            continue;
        }
        // If both are in a circuit, they should be merged.
        else if (connectionMap[from] !== undefined && connectionMap[to] !== undefined) {
            // But not if it's the same circuit
            if (connectionMap[from] === connectionMap[to]) continue;

            circuits[connectionMap[from]] = circuits[connectionMap[from]]!.union(circuits[connectionMap[to]]!)

            // Clobber the old one with an empty set.
            circuits[connectionMap[to]] = new Set();
            // Update references.
            connectionMap = connectionMap.map(x => x === connectionMap[to] ? connectionMap[from] : x);
        }
        // If only one is in a circuit, the other one should join it
        else if (connectionMap[from] === undefined) {
            circuits[connectionMap[to]!]!.add(from);
            connectionMap[from] = connectionMap[to];
        } else {
            circuits[connectionMap[from]!]!.add(to);
            connectionMap[to] = connectionMap[from];
        }

        // If this circuit contains every box, we are done.
        if (circuits[connectionMap[from]!]!.size === 1000 || circuits[connectionMap[to]!]!.size === 1000) {
            return points[to]![0] * points[from]![0];
        }
    }
    
}

export async function partTwo() { return partOne(true); }