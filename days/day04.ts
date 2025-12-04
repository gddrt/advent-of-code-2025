import { readLines } from "../utils/file";

type Grid = string[][];
type Coordinate = [number, number]

// Note, we use x,y here but visually it's more like y,x.
// Doesn't make a difference.

function getChar(grid: Grid, [x, y]: Coordinate) {
    return grid[x]![y];
}

function getAdjacentCoords(grid: Grid, [x, y]: Coordinate): Coordinate[] {
    let coords = [];
    const maxDims: [number, number] = [grid.length ?? 0, grid[0]!.length ?? 0];

    // Only return adjacent coordinates that are in bounds.
    for (let i=-1; i<=1; i++) {
        for (let j=-1; j<=1; j++) {
            // ignore own square
            if (i === 0 && j === 0) continue;
            // If square is in bounds, add to list
            if (x+i >= 0 && x+i < maxDims[0] && y+j >= 0 && y+j < maxDims[1]) {
                coords.push([x+i, y+j] as Coordinate)
            }
        }
    }
    return coords;
}

async function findAccessibleRolls(grid: Grid, mutate=false) {
    let accessibleRolls = 0;

    // Iterate through the grid. If there is a roll of paper,
    // get all valid adjacent squares, and count how many have rolls.
    for (let x=0; x<grid.length; x++) {
        for (let y=0; y<grid[0]!.length; y++) {
            if (
                (getChar(grid, [x, y]) === '@')
                && (getAdjacentCoords(grid, [x, y])
                    .filter(c => getChar(grid, c) === '@')
                    .length < 4)
            ) {
                accessibleRolls += 1;
                // For part two, we'll remove the roll.
                if (mutate) grid[x]![y] = '.';
            }
        }
    }

    return accessibleRolls;
}

export async function partOne() {
    const lines = await readLines('../inputs/04.txt');
    const grid = lines.map(x => x.split('')) as Grid;
    return findAccessibleRolls(grid);
}

export async function partTwo() {
    const lines = await readLines('../inputs/04.txt');
    const grid = lines.map(x => x.split('')) as Grid;

    let total = 0;

    // Loop until we stop finding new rolls to remove
    while (true) {
        const newRolls = await findAccessibleRolls(grid, true);
        total += newRolls;
        if (newRolls === 0) break;
    }
    return total;
}