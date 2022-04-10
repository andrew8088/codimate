export type CodeCharacter = {
  char: string;
};

export type CodeStep = number[];

export function* generator(
  code: string,
  steps: CodeStep[]
): Generator<CodeCharacter[][] | true> {
  const current: CodeCharacter[][] = code
    .trim()
    .split("\n")
    .map((line) => line.split("").map((_) => ({ char: " " })));

  yield JSON.parse(JSON.stringify(current));
  yield true;

  for (let step of steps) {
    const endOfStep: CodeCharacter[][] = code
      .trim()
      .split("\n")
      .map((line, lineIdx) =>
        line
          .split("")
          .map((char) => ({ char: step.includes(lineIdx) ? char : " " }))
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
