import { readLines } from "../utils/file";

const inputFile = "../inputs/06.txt";

type Operand = "+" | "*";
type Problem = {
    values: number[],
    operand: Operand,
    startIndex?: number,
    numLength?: number
}


async function getProblems() {
    const lines = await readLines(inputFile);

    // First pick out all the numbers in each row
    const horizontalValues: string[][] = lines.map(
        x => x.trim().replaceAll(/\s+/g, ' ').split(' ')
    );

    // Then we need to rotate the grid. First pick out the operators.
    const rotated: Problem[] = horizontalValues[horizontalValues.length - 1]!.map(x => {
        return {
            values: new Array() as number[],
            operand: x as Operand
        }
    });

    // Then fill in the problems with the right values.
    for (const row of horizontalValues.slice(0, -1)) {
        for (let i=0; i<row.length; i++) {
            rotated[i]!.values.push(Number(row[i]))
        }
    }

    return rotated;
}

async function getProblemsPartTwo() {
    const lines = await readLines(inputFile);
    // Looking at the input, the operator is always aligned with the start of the problem.
    // We can use this.
    const operators = lines[lines.length-1]!.matchAll(/(\*|\+)(\s*)/g);

    // With all matched operators, we can calculate the start and length of each column.
    const rotated = Array.from(operators).map(x => {
        return {
            values: new Array(),
            operand: x[1]!,
            startIndex: x.index,
            numLength: x[2]!.length
        }
    })

    // The last line gets trimmed, woops. (even in the input it's a space short)
    // Fix it by calculating the max line length and subtracting the startIndex from it.
    const maxLineLength = lines.slice(0, -1).reduce((a, x) => Math.max(a, x.length), 0);
    rotated[rotated.length - 1]!.numLength = maxLineLength - rotated[rotated.length - 1]!.startIndex;

    // For each line, iterate through each column
    // For each column, iterate from end to start, adding the digit to the value
    for (const line of lines.slice(0, -1)) {
        // column is a reference; we can mutate it directly
        for (const column of rotated) {
            let numIndex = 0;
            for (let i=column.startIndex + column.numLength; i>=column.startIndex; i--) {
                // initialize a new number
                if (column.values[numIndex] === undefined) column.values[numIndex] = '';
                column.values[numIndex] += line.charAt(i);
                numIndex++;
            }
        }
    }

    // Now let's clean up our values and convert them to numbers.
    // I guess it's possible there are zeroes in the source.
    // So we'll trim and filter empty strings first before casting to number.
    for (const entry of rotated) {
        entry.values = entry.values.map(x => x.trim()).filter(x => x.length).map(Number)
    }

    return rotated as Problem[];
}

export async function calculateTotal(problemFunc: () => Promise<Problem[]>) {
    const problems = await problemFunc();

    const sumOfAllProblems = problems.reduce((a, x) => {
        return a + x.values.reduce((aa, ax) => {
            if (x.operand === "+") return aa + ax;
            return aa * ax;
        })
    }, 0);

    return sumOfAllProblems;
}

export async function partOne() { return calculateTotal(getProblems); }
export async function partTwo() { return calculateTotal(getProblemsPartTwo); }