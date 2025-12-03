export async function readLines(fileName: string) {
    const file = Bun.file(fileName);
    return (await file.text()).split("\n").map(x => x.trim());
}

export async function readFile(fileName: string) {
    return (await Bun.file(fileName).text());
}