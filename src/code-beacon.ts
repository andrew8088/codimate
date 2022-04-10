export type CodeCharacter = {
  char: string;
  color: string;
};

export type CodeOutput = CodeCharacter[][];
export type CodeStep = number[];
type EndOfStep = true;
export type GeneratorOut = CodeOutput | EndOfStep;

export function* generator(
  code: string,
  steps: CodeStep[]
): Generator<GeneratorOut, void, void> {
  const current: CodeOutput = code
    .trim()
    .split("\n")
    .map((line) => line.split("").map((_) => ({ char: " ", color: "white" })));

  yield JSON.parse(JSON.stringify(current));
  yield true;

  for (let step of steps) {
    const endOfStep: CodeOutput = code
      .trim()
      .split("\n")
      .map((line, lineIdx) =>
        line.split("").map((char) => ({
          char: step.includes(lineIdx) ? char : " ",
          color: "white",
        }))
      );

    for (let i = 0; i < current.length; i++) {
      for (let j = 0; j < current[i].length; j++) {
        if (current[i][j].char !== endOfStep[i][j].char) {
          current[i][j].char = endOfStep[i][j].char;
          yield JSON.parse(JSON.stringify(current));
        }
      }
    }
    yield true;
  }
}

export function joinAll(v: void | GeneratorOut): string {
  if (!v) return "void";
  if (typeof v === "boolean") return v.toString();
  return v
    .map((line: CodeCharacter[]) => line.map((c) => c.char).join(""))
    .join("")
    .trim();
}
