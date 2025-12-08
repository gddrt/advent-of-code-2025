export async function readLines(fileName: string) {
    const file = Bun.file(fileName);
    const lines = (await file.text()).trimEnd().split("\n");
    const end = lines[lines.length] === '' ? -1 : undefined;
    return lines.slice(0, end);
}

export async function readFile(fileName: string) {
    return (await Bun.file(fileName).text());
}

export async function readGrid(fileName: string) {
    return (await readLines(fileName)).map(x => Array.from(x))
}