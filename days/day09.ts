import { readLines } from "../utils/file";

type Coordinate = [number, number];

async function getInput() {
    return (await readLines('../inputs/09.txt')).map(x => x.split(',').map(Number)) as Coordinate[]
}

function getArea(a: Coordinate, b: Coordinate) {
    // The area is inclusive of the tile, so you should add one to the difference.
    return (Math.abs(a[0] - b[0]) + 1) * (Math.abs(a[1] - b[1]) + 1)
}

export async function partOne() {
    // This smells like day 8...
    const redSquares = await getInput();
    let biggest = 0;
    for (let i=0; i<redSquares.length; i++) {
        for (let j=i+1; j<redSquares.length; j++) {
            biggest = Math.max(biggest, getArea(redSquares[i]!, redSquares[j]!))
        }
    }
    return biggest;
}

type PotentialRectangle = {
    from: number,
    to: number,
    size: number
}

type Orientation = "U" | "D" | "L" | "R" | "H" | "V";

function getOrientations(a: Coordinate, b: Coordinate) {
    let ao: Orientation[] = ["H", "V"];
    let bo: Orientation[] = ["H", "V"];
    if (a[0] >= b[0]) {
        ao[0] = "R";
        bo[0] = "L";
    }
    if (b[0] >= a[0]) {
        ao[0] = "L";
        bo[0] = "R";
    }
    if (a[1] >= b[1]) {
        ao[1] = "D";
        bo[1] = "U";
    }
    if (b[1] >= a[1]) {
        ao[1] = "U";
        bo[1] = "D";
    }
    return [ao, bo];
}

export async function partTwo() {
    // Incomplete!
    throw new Error("Not implemented!");

    // okay, it's one of those.
    // obviously drawing the 100kx100k grid would be too difficult
    // maybe it's possible to start from the biggest potential rectangle and work backwards.
    // or, wait, hold on. because the list loops
    const redSquares = await getInput();
    const potentialRectangles = [];

    // this is not going to be very efficient, oh well.
    for (let i=0; i<redSquares.length; i++) {
        for (let j=i+1; j<redSquares.length; j++) {
            potentialRectangles.push({
                from: i,
                to: j,
                size: getArea(redSquares[i]!, redSquares[j]!)
            })
        }
    }

    // First, find the fill side of the shape. Do this by counting the number of CW and CCW turns.
    // The fill side will have 4 more turns than the non-fill side.
    // Second, divide the shape into rectangles. The process is as follows:
        // 1. When you have two consecutive fill-side turns (let A-B-C and B-C-D)
        // 2. Create a square by creating the smallest intermediate (either A-B-C-A1 or D-C-B-D1)
        // 3. Remove points B and C, insert point A1 or D1 in that spot, add the rectangles to rectangles array
        // 4. Repeat until only four points remain; that is the final square.
    // Third, now you have rectangles which comprise the entire area. For each candidate big rectangle,
    // you can do something to calculate whether it overlaps entirely.


}